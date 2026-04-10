<?php

/**
 * API Proxy para dados de balneabilidade do IMA SC
 * 
 * Este arquivo faz scraping dos dados de balneabilidade do site do IMA
 * e retorna os dados em formato JSON.
 * 
 * @author Rodrigo Pereira
 * @version 2.0
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$cacheKey = md5(($protocol . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']));

$etag = '"' . $cacheKey . '"';
header('ETag: ' . $etag);

if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && $_SERVER['HTTP_IF_NONE_MATCH'] === $etag) {
    http_response_code(304);
    exit;
}

$municipio = filter_input(INPUT_POST, 'municipio', FILTER_VALIDATE_INT);
$ano = filter_input(INPUT_POST, 'ano', FILTER_VALIDATE_INT) ?? (int)date('Y');

if (!$municipio) {
    http_response_code(400);
    echo json_encode(['error' => 'Parâmetro município ausente ou inválido.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$imaUrl = 'https://balneabilidade.ima.sc.gov.br/relatorio/historico';

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $imaUrl,
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POSTFIELDS => http_build_query([
        'municipioID' => $municipio,
        'localID' => '0',
        'ano' => (string)$ano,
        'redirect' => 'true',
    ]),
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 3,
    CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($response === false || $httpCode !== 200) {
    $error = curl_error($ch);
    curl_close($ch);
    http_response_code(502);
    echo json_encode(['error' => 'Erro ao acessar o IMA: ' . $error], JSON_UNESCAPED_UNICODE);
    exit;
}
curl_close($ch);

$doc = new DOMDocument();
libxml_use_internal_errors(true);
$doc->loadHTML(mb_convert_encoding($response, 'HTML-ENTITIES', 'UTF-8'));
libxml_clear_errors();

$tables = $doc->getElementsByTagName('table');

$bathings = [];
foreach ($tables as $key => $table) {
    $points = [];
    
    if ($key % 2 !== 0) {
        $labels = $table->getElementsByTagName('label');
        foreach ($labels as $label) {
            $textContent = trim($label->textContent);
            $parts = explode(': ', $textContent, 2);
            
            if (count($parts) === 2) {
                $title = preg_replace('/\s+/', '_', trim($parts[0]));
                $title = preg_replace('/&([a-z])[a-z]+;/i', '$1', htmlentities($title, ENT_QUOTES, 'UTF-8'));
                $title = preg_replace('/[^a-zA-Z0-9_]/', '', $title);
                
                $value = htmlspecialchars(trim($parts[1]), ENT_QUOTES, 'UTF-8');
                $points[$title] = $value;
            }
        }
    } else {
        $rows = $table->getElementsByTagName('tr');
        foreach ($rows as $row) {
            $cellsData = [];
            $cells = $row->getElementsByTagName('td');
            
            foreach ($cells as $cell) {
                $cellClass = $cell->getAttribute('class');
                if ($cellClass) {
                    $cellsData[$cellClass] = htmlspecialchars(trim($cell->textContent), ENT_QUOTES, 'UTF-8');
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

if (empty($bathings)) {
    http_response_code(404);
    echo json_encode(['error' => 'Nenhum dado encontrado para os parâmetros fornecidos.'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode($bathings, JSON_UNESCAPED_UNICODE);
