/**
 * Script principal para visualização de balneabilidade das praias de SC
 * Utiliza Bootstrap 5 e Chart.js 4.x com lazy loading
 */
(function() {
  'use strict';

  const colorsList = [
    '#32CD32', '#0000CD', '#00CED1', '#FFA500', '#FFBF00', '#FF00FF', '#008080',
    '#228B22', '#8B4513', '#000000', '#808080', '#000080', '#FFFFFF', '#FFFF00',
    '#FFC0CB', '#FF0000', '#B22222', '#778899'
  ];

  let currentChart = null;
  let municipalities = [];
  let chartLoaded = false;

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    await loadMunicipalities();
    populateYearSelect();
    setupEventListeners();
    initializeToast();
    setupAccessibility();
  }

  async function loadMunicipalities() {
    try {
      const response = await fetch('assets/data/municipalities.json');
      if (!response.ok) throw new Error('Erro ao carregar municípios');
      municipalities = await response.json();
      populateMunicipioSelect();
    } catch (error) {
      showToast('Erro ao carregar lista de municípios', 'danger');
      captureError(error, { context: 'loadMunicipalities' });
    }
  }

  function populateMunicipioSelect() {
    const select = document.getElementById('municipio-select');
    select.innerHTML = '<option value="" selected disabled>' + I18n.t('municipalityPlaceholder') + '</option>';
    municipalities.forEach(municipio => {
      const option = document.createElement('option');
      option.value = municipio.id;
      option.textContent = municipio.name;
      select.appendChild(option);
    });
  }

  function populateYearSelect() {
    const select = document.getElementById('ano-select');
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 4; year--) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      if (year === currentYear) option.selected = true;
      select.appendChild(option);
    }
  }

  function setupEventListeners() {
    const municipioSelect = document.getElementById('municipio-select');
    const anoSelect = document.getElementById('ano-select');

    municipioSelect.addEventListener('change', handleMunicipioChange);
    anoSelect.addEventListener('change', handleMunicipioChange);
  }

  function setupAccessibility() {
    const municipioSelect = document.getElementById('municipio-select');
    
    municipioSelect.addEventListener('keydown', handleKeyboardNav);
    
    municipioSelect.addEventListener('focus', () => {
      municipioSelect.setAttribute('aria-expanded', 'true');
    });
    
    municipioSelect.addEventListener('blur', () => {
      municipioSelect.setAttribute('aria-expanded', 'false');
    });
  }

  function handleKeyboardNav(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const select = event.target;
      if (select.value) {
        handleMunicipioChange();
      }
    }
  }

  function handleMunicipioChange() {
    const municipioId = document.getElementById('municipio-select').value;
    const ano = document.getElementById('ano-select').value;

    if (municipioId && ano) {
      if (typeof Analytics !== 'undefined') {
        Analytics.trackEvent('Filter', 'Change Municipality', municipioId);
      }
      fetchMunicipioData(municipioId, ano);
    }
  }

  function initializeToast() {
    const toastEl = document.getElementById('toast-body');
    if (typeof bootstrap !== 'undefined' && toastEl) {
      new bootstrap.Toast(toastEl, { delay: 5000 });
    }
  }

  function showToast(message, type = 'danger') {
    const toastEl = document.getElementById('toast-body');
    if (!toastEl) return;
    
    const toastBody = toastEl.querySelector('.toast-body');
    const header = toastEl.querySelector('.toast-header');
    
    toastBody.textContent = message;
    header.className = `toast-header bg-${type} text-white`;
    
    if (typeof bootstrap !== 'undefined') {
      const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
      toast.show();
    } else {
      alert(message);
    }
  }

  function toggleLoading(show) {
    const spinner = document.getElementById('loading-spinner');
    const canvas = document.getElementById('line-chart');
    
    if (show) {
      spinner.classList.remove('d-none');
      spinner.setAttribute('aria-busy', 'true');
      canvas.style.display = 'none';
    } else {
      spinner.classList.add('d-none');
      spinner.setAttribute('aria-busy', 'false');
      canvas.style.display = 'block';
    }
  }

  function captureError(error, context) {
    if (typeof Analytics !== 'undefined' && Analytics.captureException) {
      Analytics.captureException(error, context);
    }
    console.error('Error:', error, context);
  }

  async function loadChartLibrary() {
    if (chartLoaded) return;
    
    return new Promise((resolve, reject) => {
      if (window.Chart) {
        chartLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
      script.async = true;
      script.onload = () => {
        chartLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Falha ao carregar Chart.js'));
      };
      document.head.appendChild(script);
    });
  }

  async function fetchMunicipioData(municipioId, ano) {
    toggleLoading(true);

    try {
      await loadChartLibrary();
      
      const response = await $.ajax({
        url: 'ima.php',
        method: 'POST',
        dataType: 'json',
        data: { 
          municipio: municipioId,
          ano: ano
        }
      });

      if (!response || response.length === 0 || response.error) {
        showToast(I18n.t('noDataFound'));
        toggleLoading(false);
        return;
      }

      const points = [];
      let dataLabels = [];

      response.forEach((item, index) => {
        if (index % 2 === 0 && item) {
          const series = item.map(data => data.ecoli);
          const dates = item.map(data => data.data);

          if (series.length > 0) {
            points.push({
              label: `${response[index - 1].Ponto_de_Coleta}: ${response[index - 1].Localizacao}`,
              data: series.reverse(),
              borderColor: colorsList[(index - 1) % colorsList.length],
              backgroundColor: colorsList[(index - 1) % colorsList.length] + '33',
              fill: false,
              tension: 0.3,
              pointRadius: 4,
              pointHoverRadius: 6
            });
            dataLabels = dates.reverse();
          }
        }
      });

      if (points.length > 0 && dataLabels.length > 0) {
        renderChart(dataLabels, points, response[1]);
      } else {
        showToast(I18n.t('processingError'));
      }

      if (typeof Analytics !== 'undefined') {
        Analytics.trackEvent('Chart', 'Render', `${municipioId}-${ano}`);
      }
    } catch (error) {
      showToast(`${I18n.t('connectionError')}: ${error.statusText || error.message}`);
      captureError(error, { municipioId, ano });
    }

    toggleLoading(false);
  }

  async function renderChart(labels, datasets, metaInfo) {
    const ctx = document.getElementById('line-chart').getContext('2d');
    const [day, month, year] = labels[0].split('/');

    if (currentChart) {
      currentChart.destroy();
    }

    const chartTitle = `Cidade de ${metaInfo.Municipio} - ${metaInfo.Balneario} - Ano: ${year || document.getElementById('ano-select').value}`;

    document.getElementById('line-chart').setAttribute('aria-label', chartTitle);

    currentChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 750,
          easing: 'easeInOutQuart'
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          title: {
            display: true,
            text: chartTitle,
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: 20,
            color: '#212529'
          },
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                size: 11
              },
              color: '#212529'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw} NMP/100ml`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: I18n.t('ecocoliLabel'),
              font: {
                size: 12,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            title: {
              display: true,
              text: I18n.t('dateLabel'),
              font: {
                size: 12,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      }
    });
  }
})();
