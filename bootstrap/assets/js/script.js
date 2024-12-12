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
      method: "GET",
      dataType: "json",
      data: { municipio: municipioId }, // Envie o município como parâmetro
      success: function (result) {
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

        renderChart(dataLabels, points, result[1]);
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
