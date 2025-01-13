import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from 'chart.js';

import { Chart } from 'react-chartjs-2';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    conditions: string;
  }[];
}

const MunicipalityChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  const colorsList = [
    'lime',
    'blue',
    'cyan',
    'orange',
    'amber',
    'magenta',
    'teal',
    'green',
    'brown',
    'black',
    'grey',
    'navy',
    'white',
    'yellow',
    'pink',
    'red',
    'ruby',
    'iron',
  ];

  const handleMunicipioChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const municipio = event.target.value;

    // Simulando dados para o gráfico
    if (!municipio) {
      alert('Selecione um município.');
      return;
    }

    try {
      const response = await fetch('/api/ima/chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ municipio }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('result', result);

      if (Object.keys(result).length === 0) {
        alert(
          'Nenhum dado encontrado para o município selecionado.',
        );
        return;
      }

      const datasets: any[] = [];
      const allLabels: Set<string> = new Set();

      Object.keys(result).forEach((key: any, index) => {
        const point = result[key];

        if (point.data && point.data.length > 0) {
          const series = point.data.map((item: any) =>
            parseFloat(item.ecoli || 0),
          );

          const dates = point.data.map((item: any) => item.data);
          const conditions = point.data.map(
            (item: any) => item.condicao,
          );

          // adiciona datas ao conjunto (sem duplicação)
          dates.forEach((date: string) => {
            const label = `${date}`;
            allLabels.add(label);
          });

          // adiciona dataset
          datasets.push({
            label: `${point.info.ponto_de_coleta}: ${point.info.localização}`,
            data: series.reverse(),
            borderColor: colorsList[index % colorsList.length],
            backgroundColor:
              colorsList[index % colorsList.length],
            tension: 0.4,
            conditions: conditions.reverse(),
          });
        }
      });

      setChartData({
        labels: Array.from(allLabels).sort(),
        datasets,
      });
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
      alert('Erro ao carregar os dados do município.');
    }
  };

  return (
    <div className="container">
      <nav className="navbar navbar-expand-md navbar-dark navbar-title">
        <a className="navbar-brand navbar-center" href="#">
          IMA - BALNEABILIDADE
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle Navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </nav>
      <div className="containers">
        <div className="starter-template">
          <label
            htmlFor="municipio-select"
            className="form-label"
          >
            Selecione o município:
          </label>
          <select
            id="municipio-select"
            className="form-select"
            onChange={handleMunicipioChange}
            defaultValue=""
          >
            <option value="" disabled>
              Escolha um município
            </option>
            <option value="1">Biguaçu</option>
            <option value="2">Florianópolis</option>
            <option value="3">São José</option>
            <option value="4">Palhoça</option>
            <option value="5">Garopaba</option>
            <option value="6">Imbituba</option>
            <option value="7">Laguna</option>
            <option value="8">Jaguaruna</option>
            <option value="9">Balneário Rincão</option>
            <option value="10">Araranguá</option>
            <option value="11">Passo de Torres</option>
            <option value="12">Balneário Arroio do Silva</option>
            <option value="14">Balneário Gaivota</option>
            <option value="15">Itapoá</option>
            <option value="16">Joinville</option>
            <option value="17">São Francisco do Sul</option>
            <option value="18">Balneário da Barra do Sul</option>
            <option value="19">Barra Velha</option>
            <option value="20">Balneário Piçarras</option>
            <option value="21">Penha</option>
            <option value="22">Navegantes</option>
            <option value="23">Itajaí</option>
            <option value="24">Balneário Camboriú</option>
            <option value="25">Itapema</option>
            <option value="26">Porto Belo</option>
            <option value="27">Bombinhas</option>
            <option value="28">Governador Celso Ramos</option>
            <option value="29">Paulo Lopes</option>
          </select>
          <br />
          <br />
          <Chart
            type="line"
            data={chartData}
            options={{
              responsive: true,
              scales: {
                x: {
                  ticks: {
                    autoSkip: true,
                    maxRotation: 45,
                    minRotation: 45,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MunicipalityChart;
