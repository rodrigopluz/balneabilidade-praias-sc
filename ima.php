<?php

// chart.js - exemplo de grafico
// header('Cache-Control: no-cache');
// header('Content-type: application/json; charset="utf-8"', true);

$layout = curl_init();

curl_setopt($layout, CURLOPT_URL,'https://balneabilidade.ima.sc.gov.br/relatorio/historico');
curl_setopt($layout, CURLOPT_POST, 1);
curl_setopt($layout, CURLOPT_RETURNTRANSFER, true);
curl_setopt($layout, CURLOPT_POSTFIELDS,'municipioID=25&localID=44&ano=2018&redirect=true');
curl_setopt($layout, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($layout, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($layout);
$doc = new DOMDocument();
$doc->loadHTML($response);

$tables = $doc->getElementsByTagName('table');

foreach ($tables as $key_t => $table) {
    $ponto = [];
    $balneabilidade[$key_t] = [];

    if ($key_t % 2 != 0) {
        /**
         * monta o array dos pontos de coleta
         */
        $labels = $table->getElementsByTagName('label');
        foreach ($labels as $key_l => $label) {
            $ponto_table = explode(': ', $label->textContent);
            $titulo = str_replace(" ", "_", preg_replace("/&([a-z])[a-z]+;/i", "$1", htmlentities(trim($ponto_table[0]))));
            $valor = $ponto_table[1];

            $ponto[$key_l] = [$titulo => $valor];
        }
        
        /**
         * monta o array dos 
         */
        $divs = $table->getElementsByTagName('tr');
        foreach ($divs as $div) {
            var_dump($div->textContent);
        }

        $balneabilidade[$key_t] = $ponto;
    }
}

// var_dump($balneabilidade);
exit;

// curl_close ($layout);
echo json_encode($balneabilidade);


