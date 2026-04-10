import { Router, Request, Response } from "express";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { z } from "zod";

const router = Router();

const querySchema = z.object({
  municipio: z.string().regex(/^\d+$/, "Município deve ser numérico").transform(Number),
  ano: z.string().regex(/^\d{4}$/, "Ano deve ter 4 dígitos").transform(Number).optional(),
});

interface Point {
  [key: string]: string;
}

interface PointInfo {
  ponto_de_coleta: string;
  localização: string;
  municipio: string;
  balneario: string;
  [key: string]: string;
}

interface BathingDataPoint {
  ecoli: string;
  data: string;
  condicao: string;
  [key: string]: string;
}

interface BathingData {
  [key: string]: {
    info: PointInfo;
    data: BathingDataPoint[];
  };
}

router.post('/chart', async (req: Request, res: Response): Promise<void> => {
  const ano = req.body.ano ?? new Date().getFullYear();

  try {
    const validationResult = querySchema.safeParse({
      municipio: String(req.body.municipio),
      ano: String(ano),
    });

    if (!validationResult.success) {
      res.status(400).json({ 
        error: 'Parâmetros inválidos.',
        details: validationResult.error.issues 
      });
      return;
    }

    const { municipio, ano: anoNum } = validationResult.data;

    const response = await fetch('https://balneabilidade.ima.sc.gov.br/relatorio/historico', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        municipioID: String(municipio),
        localID: '0',
        ano: String(anoNum),
        redirect: 'true',
      }),
    });

    if (!response.ok) {
      res.status(500).json({ error: `Erro ao acessar a URL: ${response.statusText}` });
      return;
    }

    const html = await response.text();

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
      const info: Point = {};

      if (index % 2 !== 0) {
        const labels = table.querySelectorAll('label');
        labels.forEach((label) => {
          const textContent = label.textContent || '';
          const parts = textContent.split(':').map((s: string) => s.trim());

          if (parts.length === 2) {
            const title = parts[0];
            const value = parts[1];
            const key = title
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/\s+/g, '_')
              .replace(/&([a-z])[a-z]+;/gi, '$1')
              .toLowerCase();
            info[key] = value;
          }
        });

        if (Object.keys(info).length > 0) {
          bathings[`point_${index}`] = { 
            info: info as PointInfo, 
            data: [] 
          };
        }
      } else {
        const rows = table.querySelectorAll('tr');

        rows.forEach((row) => {
          const cells = row.querySelectorAll('td');
          const cellsData: Point = {};

          cells.forEach((cell) => {
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

        const lastPointKey = `point_${index - 1}`;
        if (bathings[lastPointKey]) {
          bathings[lastPointKey].data = points as BathingDataPoint[];
        }
      }
    });

    res.json(bathings);
  } catch (error) {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }));
    res.status(500).json({ error: 'Erro ao processar a solicitação.' });
  }
});

export default router;
