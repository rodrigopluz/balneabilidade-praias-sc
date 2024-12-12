<?php

// chart.js - exemplo de grafico
header('Cache-Control: no-cache');
header('Content-type: application/json; charset=utf-8');

$municipio = $_POST['municipio'] ?? null;

if (!$municipio) {
	// Retorna erro caso o parâmetro não seja fornecido
	echo json_encode(['error' => 'Parâmetro município ausente.']);
	exit;
}

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, 'https://balneabilidade.ima.sc.gov.br/relatorio/historico');
curl_setopt($curl, CURLOPT_POST, 1);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query([
	'municipioID' => $municipio,
	'localID' => 0,
	'ano' => 2024,
	'redirect' => true,
]));
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($curl);
if ($response === false) {
    echo json_encode(['error' => 'Erro ao acessar a URL: ' . curl_error($curl)]);
    curl_close($curl);
    exit;
}
curl_close($curl);

$doc = new DOMDocument();
libxml_use_internal_errors(true); // Suprime erros de parsing de HTML inválido
if (!$doc->loadHTML($response)) {
    echo json_encode(['error' => 'Erro ao processar o HTML recebido']);
    exit;
}
libxml_clear_errors();

$tables = $doc->getElementsByTagName('table');

$bathings = [];
foreach ($tables as $key => $table) {
    $points = [];
    
    if ($key % 2 != 0) {
        /**
        * monta o array dos pontos de coleta
        */
        $labels = $table->getElementsByTagName('label');
        foreach ($labels as $label) {
            $point = explode(': ', $label->textContent);
            if (count($point) === 2) {
                $title = str_replace(" ", "_", preg_replace("/&([a-z])[a-z]+;/i", "$1", htmlentities(trim($point[0]))));
                $value = trim($point[1]);
                $points[$title] = $value;
            }
        }
    } else {    
        /**
         * monta o array das linhas de coleta
         */
        $rows = $table->getElementsByTagName('tr');
        foreach ($rows as $row) {
            $cellsData = [];
            $cells = $row->getElementsByTagName('td');
            foreach ($cells as $cell) {
                $cellClass = $cell->getAttribute('class');
                if ($cellClass) {
                    $cellsData[$cellClass] = trim($cell->textContent);
                }
            }
            if (!empty($cellsData)) {
                $points[] = $cellsData;
            }
        }
    }

    if (!empty($points)) {
        $bathings[$key] = $points;
    }
}

echo json_encode($bathings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
