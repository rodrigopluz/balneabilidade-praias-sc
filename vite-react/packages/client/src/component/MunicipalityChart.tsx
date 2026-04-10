import React, { useState, useCallback } from 'react';
import { useI18n } from '../i18n';
import { municipalities, getYearOptions } from '../data/municipalities';
import { ChartSkeleton } from './Loading';
import { ToastContainer } from './Toast';
import { ThemeToggle, LanguageToggle } from './ThemeToggle';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import type { ChartOptions, ChartData as ChartJsData } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface BathingDataPoint {
  ecoli: string;
  data: string;
  condicao: string;
}

interface PointInfo {
  ponto_de_coleta: string;
  localizacao: string;
  municipio: string;
  balneario: string;
}

interface BathingData {
  [key: string]: {
    info: PointInfo;
    data: BathingDataPoint[];
  };
}

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

const colorsList = [
  '#32CD32', '#0000CD', '#00CED1', '#FFA500', '#FFBF00', '#FF00FF', '#008080',
  '#228B22', '#8B4513', '#000000', '#808080', '#000080', '#FFFFFF', '#FFFF00',
  '#FFC0CB', '#FF0000', '#B22222', '#778899'
];

const MunicipalityChart: React.FC = () => {
  const { translationKey } = useI18n();
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [chartData, setChartData] = useState<ChartJsData<'line'> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [chartKey, setChartKey] = useState<number>(0);

  const yearOptions = getYearOptions();

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'danger') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const fetchData = useCallback(async () => {
    if (!selectedMunicipio) {
      showToast(translationKey('invalidMunicipality'));
      return;
    }

    setIsLoading(true);
    setChartData(null);

    try {
      const response = await fetch('/api/ima/chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          municipio: selectedMunicipio,
          ano: selectedYear 
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }

      const result: BathingData = await response.json();

      if (Object.keys(result).length === 0) {
        showToast(translationKey('noDataFound'));
        setIsLoading(false);
        return;
      }

      const datasets: ChartJsData<'line'>['datasets'] = [];
      const allLabels: Set<string> = new Set();

      Object.entries(result).forEach(([, point], index: number) => {
        if (point.data && point.data.length > 0) {
          const ecoliValues: number[] = point.data.map((item) => parseFloat(item.ecoli || '0'));
          const dates: string[] = point.data.map((item) => item.data);

          dates.forEach((date: string) => {
            allLabels.add(date);
          });

          const colorIndex = index % colorsList.length;
          datasets.push({
            label: `${point.info.ponto_de_coleta || 'Ponto ' + (index + 1)}: ${point.info.localizacao 
              || 'Local'}`,
            data: ecoliValues.reverse(),
            borderColor: colorsList[colorIndex],
            backgroundColor: colorsList[colorIndex] + '33',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
          });
        }
      });

      const sortedLabels = Array.from(allLabels).sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('/');
        const [dayB, monthB, yearB] = b.split('/');
        const dateA = new Date(parseInt(yearA), parseInt(monthA) - 1, parseInt(dayA));
        const dateB = new Date(parseInt(yearB), parseInt(monthB) - 1, parseInt(dayB));
        return dateA.getTime() - dateB.getTime();
      });

      setChartData({
        labels: sortedLabels,
        datasets,
      });
      setChartKey((prev) => prev + 1);

      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as unknown as { gtag: (cmd: string, action: string, params: object) => void }).gtag('event', 'chart_render', {
          event_category: 'engagement',
          event_label: `${selectedMunicipio}-${selectedYear}`,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
      showToast(`${translationKey('connectionError')}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setIsLoading(false);
  }, [selectedMunicipio, selectedYear, showToast, translationKey]);

  const handleMunicipioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMunicipio(event.target.value);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchData();
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      title: {
        display: true,
        text: `Balneabilidade - Ano: ${selectedYear}`,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: 20,
      },
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y} NMP/100ml`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: translationKey('ecocoliLabel'),
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        title: {
          display: true,
          text: translationKey('dateLabel'),
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className="container">
      <nav className="navbar navbar-expand-md navbar-dark bg-dark" role="navigation" aria-label={translationKey('navigation')}>
        <div className="container-fluid">
          <a className="navbar-brand" href="#" aria-label={translationKey('home')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-water me-2" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M.036 12.314a6 6 0 0 1 6.929-5.926.5.5 0 1 0 .5-.866A4 4 0 0 0 4.162 8H.5a.5.5 0 0 0 0 1h3.162a3 3 0 0 1 2.824 2.5 4 4 0 0 1-2.93 2.5H.5a.5.5 0 0 0 0 1h3.162a4 4 0 0 1 2.824 2.5 6 6 0 0 1-6.929 5.926.5.5 0 1 0-.5.866v.5a.5.5 0 0 1-1 0v-.5a.5.5 0 0 0-.5-.866.5.5 0 0 0-.5.866v.5a.5.5 0 0 1-1 0v-.5a.5.5 0 0 0-.5-.866.5.5 0 0 0-.5.866v.5a.5.5 0 0 1-1 0v-.5Z"/>
            </svg>
            IMA - BALNEABILIDADE
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label={translationKey('openMenu')}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="https://balneabilidade.ima.sc.gov.br" target="_blank" rel="noopener noreferrer">
                  {translationKey('source')}
                </a>
              </li>
              <LanguageToggle />
              <li className="nav-item">
                <ThemeToggle />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="containers py-4" role="main">
        <a href="#main-content" className="visually-hidden-focusable position-absolute top-0 start-0 w-100 text-center py-2 bg-dark text-white">
          Pular para o conteúdo principal
        </a>

        <div id="main-content" tabIndex={-1}>
          <h1 className="visually-hidden">{translationKey('appTitle')}</h1>

          <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label htmlFor="municipio-select" className="form-label fw-bold">
                  {translationKey('selectMunicipality')}
                </label>
                <select
                  id="municipio-select"
                  className="form-select form-select-lg"
                  value={selectedMunicipio}
                  onChange={handleMunicipioChange}
                  aria-required="true"
                  aria-describedby="municipio-help"
                >
                  <option value="" disabled>
                    {translationKey('municipalityPlaceholder')}
                  </option>
                  {municipalities.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <div id="municipio-help" className="form-text">
                  {translationKey('municipalityHelp')}
                </div>
              </div>
              <div className="col-12 col-md-4">
                <label htmlFor="ano-select" className="form-label fw-bold">
                  {translationKey('selectYear')}
                </label>
                <select
                  id="ano-select"
                  className="form-select form-select-lg"
                  value={selectedYear}
                  onChange={handleYearChange}
                  aria-required="true"
                >
                  {yearOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-2 d-flex align-items-center justify-content-center">
                <button type="submit" className="btn btn-primary w-100 h-50" disabled={isLoading}>
                  {isLoading ? translationKey('loading') : translationKey('loadingData')}
                </button>
              </div>
            </div>
          </form>

          <div className="chart-wrapper" style={{ minHeight: '400px' }}>
            {isLoading && <ChartSkeleton height={400} />}
            {!isLoading && chartData && (
              <div style={{ height: '400px' }}>
                <Chart
                  key={chartKey}
                  type="line"
                  data={chartData}
                  options={chartOptions}
                  role="img"
                  aria-label={translationKey('chartAriaLabel')}
                />
              </div>
            )}
            {!isLoading && !chartData && (
              <div className="text-center text-muted py-5">
                <p>{translationKey('selectMunicipality')}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="footer mt-auto py-3 bg-light">
        <div className="container text-center">
          <p className="text-muted mb-1">
            {translationKey('footerText')} {' '}
            <a href="https://balneabilidade.ima.sc.gov.br" target="_blank" rel="noopener noreferrer">
              {translationKey('footerLink')}
            </a>
          </p>
          <p className="small text-muted mb-0">
            &copy; 2024 Rodrigo Pereira
          </p>
        </div>
      </footer>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default MunicipalityChart;
