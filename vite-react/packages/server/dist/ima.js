import { Router } from "express";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
const router = Router();
router.post('/chart', async (req, res) => {
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
                ano: '2024',
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
        const bathings = {};
        tables.forEach((table, key) => {
            const points = [];
            if (key % 2 !== 0) {
                // Monta o array dos pontos de coleta
                const labels = table.querySelectorAll('label');
                labels.forEach((label) => {
                    const point = label.textContent.split(': ');
                    if (point.length === 2) {
                        const title = point[0]
                            .trim()
                            .replace(/\s+/g, '_')
                            .replace(/&([a-z])[a-z]+;/gi, '$1');
                        const value = point[1].trim();
                        points[title] = value;
                    }
                });
            }
            else {
                // Monta o array das linhas de coleta
                const rows = table.querySelectorAll('tr');
                rows.forEach((row) => {
                    const cellsData = {};
                    const cells = row.querySelectorAll('td');
                    cells.forEach((cell) => {
                        const cellClass = cell.getAttribute('class');
                        if (cellClass) {
                            cellsData[cellClass] = cell.textContent.trim();
                        }
                    });
                    if (Object.keys(cellsData).length > 0) {
                        points.push(cellsData);
                    }
                });
            }
            if (points.length > 0) {
                bathings[key] = points;
            }
        });
        res.json(bathings);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao processar a solicitação.' });
    }
});
export default router;
