<?php

// chart.js - exemplo de grafico
header('Cache-Control: no-cache');
header('Content-type: application/json; charset="utf-8"', true);

$layout = curl_init();

curl_setopt($layout, CURLOPT_URL,'https://balneabilidade.ima.sc.gov.br/relatorio/historico');
curl_setopt($layout, CURLOPT_POST, 1);
curl_setopt($layout, CURLOPT_RETURNTRANSFER, true);
curl_setopt($layout, CURLOPT_POSTFIELDS,'municipioID=25&localID=44&ano=2018&redirect=true');
// curl_setopt($layout, CURLOPT_POSTFIELDS,'municipioID=24&localID=40&ano=2018&redirect=true');
// curl_setopt($layout, CURLOPT_POSTFIELDS,'municipioID=25&localID=219&ano=2018&redirect=true');
curl_setopt($layout, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($layout, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($layout);
$doc = new DOMDocument();
$doc->loadHTML($response);

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
            $title = str_replace(" ", "_", preg_replace("/&([a-z])[a-z]+;/i", "$1", htmlentities(trim($point[0]))));
            $value = $point[1];

            $points[$title] = $value;
        }
    } else {    
        /**
         * monta o array das linhas de coleta
         */
        $collect = [];
        $lines = $table->getElementsByTagName('tr');
        foreach ($lines as $line) {
            $cells = $line->getElementsByTagName('td');
            foreach ($cells as $cell) {
                $cellule = $cell->getAttribute('class');
                if ($cellule != null) $collect[$cellule] = $cell->textContent;
            }

            $points[] = array_filter($collect);
        }
    }

    $bathings[$key] = array_filter($points);
}

echo json_encode(array_filter($bathings));
