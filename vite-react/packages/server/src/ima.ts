import { Router, Request, Response } from "express";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const router = Router();

interface Point {
  [key: string]: string;
}

interface BathingData {
  [key: string]: {
    info: Point;
    data: Point[];
  };
}

router.post('/chart', async (req: Request, res: Response): Promise<void> => {
  const { municipio } = req.body;

  if (!municipio) {
    res.status(400).json({ error: 'Parâmetro município ausente.' });
    return;
  }

  try {
    // Faz a requisição POST para a URL especificada
    const response = await fetch('https://balneabilidade.ima.sc.gov.br/relatorio/historico', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        municipioID: municipio,
        localID: '0',
        ano: '2025',
        redirect: 'true',
      }),
    });

    if (!response.ok) {
      res.status(500).json({ error: `Erro ao acessar a URL: ${response.statusText}` });
      return;
    }

    const html = await response.text();

    // Parseia o HTML retornado usando JSDOM
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const tables = document.querySelectorAll('table');

    if (!tables || tables.length === 0) {
      res.status(404).json({ error: "Nenhuma tabela encontrada na página retornada." });
      return;
    }

    const bathings: BathingData = {};

    tables.forEach((table, index) => {
      const points: Point[] = [];
      let info: Point = {};

      if (index % 2 !== 0) {
        // Monta o array dos pontos de coleta
        const labels = table.querySelectorAll('label');
        labels.forEach((label: any) => {
          const textContent = label.textContent || '';
          const [title, value] = textContent.split(':').map((collect: any) => collect.trim());

          if (title && value) {
            const key = title.replace(/\s+/g, '_').replace(/&([a-z])[a-z]+;/gi, '$1').toLowerCase();
            info[key] = value;
          }
        });

        if (Object.keys(info).length > 0) {
          bathings[`point_${index}`] = { info, data: [] };
        }
      } else {
        // Monta o array das linhas de coleta
        const rows = table.querySelectorAll('tr');

        rows.forEach((row) => {
          const cells = row.querySelectorAll('td');
          const cellsData: Point = {};

          cells.forEach((cell: any) => {
            const cellClass = cell.getAttribute('class') || '';
            const cellText = cell.textContent?.trim() || '';

            if (cellClass) {
              cellsData[cellClass] = cellText;
            }
          });

          if (Object.keys(cellsData).length > 0) {
            points.push(cellsData);
          }
        });

        // Associando os dados ao último ponto de coleta
        const lastPointKey = `point_${index -1}`;
        if (bathings[lastPointKey]) {
          bathings[lastPointKey].data = points;
        }
      }
    });

    res.json(bathings);
  } catch (error) {
      console.error('Erro durante o processamento', error);
      res.status(500).json({ error: 'Erro ao processar a solicitação.' });
  }
});

export default router;
