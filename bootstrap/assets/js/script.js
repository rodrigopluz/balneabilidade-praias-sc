$(document).ready(function () {
  const colorsList = [
    "lime", "blue", "cyan", "orange", "amber", "magenta", "teal",
    "green", "brown", "black", "grey", "navy", "white", "yellow",
    "pink", "red", "ruby", "iron"
  ];

  $('#municipio-select').on('change', function () {
    const selectedMunicipio = $(this).val();

    if (selectedMunicipio) {
      fetchMunicipioData(selectedMunicipio);
    }
  });

  function fetchMunicipioData(municipioId) {
    $.ajax({
      url: "ima.php",
      method: "POST",
      dataType: "json",
      data: { municipio: municipioId }, // Envie o município como parâmetro
      success: function (result) {
        if (!result || result.length === 0) {
          alert("Nenhum dado encontrado para o município selecionado.");
          return;
        }

        const points = [];
        let dataLabels = [];

        result.forEach((item, index) => {
          if (index % 2 === 0 && item) {
            const series = item.map(data => data.ecoli);
            const dates = item.map(data => data.data);

            if (series.length > 0) {
              points.push({
                label: `${result[index - 1].Ponto_de_Coleta}: ${result[index - 1].Localizacao}`,
                data: series.reverse(),
                borderColor: colorsList[index - 1],
                fill: false
              });
              dataLabels = dates.reverse();
            }
          }
        });

        if (points.length > 0 && dataLabels.length > 0) {
          renderChart(dataLabels, points, result[1]);
        } else {
          alert("Não foi possível processar os dados do gráfico.");
        }
      },
      error: function () {
        alert("Erro ao carregar os dados.");
      }
    });
  }

  function renderChart(labels, datasets, metaInfo) {
    const [day, month, year] = labels[0].split('/');
    new Chart(document.getElementById("line-chart"), {
      type: "line",
      data: {
        labels,
        datasets
      },
      options: {
        title: {
          display: true,
          text: `CIDADE DE ${metaInfo.Municipio} - ${metaInfo.Balneario} - ANO: ${year}`
        }
      }
    });
  }
});
