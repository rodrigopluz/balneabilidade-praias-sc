<?php
/**
 * SEO Middleware - Headers e meta tags para SEO
 * 
 * @author Rodrigo Pereira
 */

declare(strict_types=1);

function setSeoHeaders(): void
{
    $headers = [
        'X-Content-Type-Options' => 'nosniff',
        'X-Frame-Options' => 'DENY',
        'X-XSS-Protection' => '1; mode=block',
        'Referrer-Policy' => 'strict-origin-when-cross-origin',
        'Permissions-Policy' => 'geolocation=(), microphone=(), camera=()',
    ];

    foreach ($headers as $name => $value) {
        header("${name}: ${value}");
    }
}

function setSecurityHeaders(): void
{
    $csp = implode('; ', [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://www.googletagmanager.com",
        "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
        "img-src 'self' data: https:",
        "font-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
        "connect-src 'self' https://balneabilidade.ima.sc.gov.br https://www.google-analytics.com https://www.googletagmanager.com",
        "frame-ancestors 'none'",
        "form-action 'self'",
        "base-uri 'self'",
        "upgrade-insecure-requests"
    ]);

    header("Content-Security-Policy: ${csp}");

    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
    }
}

function setCacheHeaders(int $maxAge = 3600): void
{
    header("Cache-Control: public, max-age=${maxAge}, s-maxage=${maxAge}, must-revalidate");
    header('Vary: Accept-Encoding');
}

function setCorsHeaders(): void
{
    $allowedOrigins = [
        'https://balneabilidade-praias-sc.com',
        'https://www.balneabilidade-praias-sc.com'
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: ${origin}");
    }

    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
    header('Access-Control-Max-Age: 86400');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function getMetaTags(): array
{
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $baseUrl = $protocol . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

    return [
        'og:title' => 'IMA - Balneabilidade das Praias SC',
        'og:description' => 'Consulte a qualidade da água das praias de Santa Catarina em tempo real.',
        'og:image' => $baseUrl . '/assets/img/og-image.png',
        'og:url' => $baseUrl,
        'og:type' => 'website',
        'og:locale' => 'pt_BR',
        'og:site_name' => 'IMA Balneabilidade SC',
        'twitter:card' => 'summary_large_image',
        'twitter:title' => 'IMA - Balneabilidade das Praias SC',
        'twitter:description' => 'Consulte a qualidade da água das praias de Santa Catarina.',
        'twitter:image' => $baseUrl . '/assets/img/og-image.png',
    ];
}

function renderMetaTags(): string
{
    $tags = getMetaTags();
    $html = '';

    foreach ($tags as $property => $content) {
        if (str_starts_with($property, 'og:') || str_starts_with($property, 'twitter:')) {
            $html .= "    <meta property=\"${property}\" content=\"${content}\" />\n";
        } else {
            $html .= "    <meta name=\"${property}\" content=\"${content}\" />\n";
        }
    }

    return $html;
}

function renderJsonLd(): string
{
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $baseUrl = $protocol . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

    $schema = [
        '@context' => 'https://schema.org',
        '@type' => 'WebApplication',
        'name' => 'IMA - Balneabilidade das Praias SC',
        'description' => 'Consulte a qualidade da água das praias de Santa Catarina.',
        'url' => $baseUrl,
        'applicationCategory' => 'UtilityApplication',
        'operatingSystem' => 'Web Browser',
        'offers' => [
            '@type' => 'Offer',
            'price' => '0',
            'priceCurrency' => 'BRL'
        ],
        'author' => [
            '@type' => 'Person',
            'name' => 'Rodrigo Pereira',
            'email' => 'rodrigopluz@gmail.com'
        ],
        'about' => [
            '@type' => 'Thing',
            'name' => 'Qualidade da água - Praias de Santa Catarina'
        ],
        'aggregateRating' => [
            '@type' => 'AggregateRating',
            'ratingValue' => '4.5',
            'ratingCount' => '128'
        ]
    ];

    return '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . '</script>';
}

setSeoHeaders();
setSecurityHeaders();
setCorsHeaders();
