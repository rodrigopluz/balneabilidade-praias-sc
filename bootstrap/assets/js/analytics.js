/**
 * Analytics e Error Tracking
 * Suporta Google Analytics 4 e Sentry
 */
(function() {
    'use strict';

    const Config = {
        GA_ID: 'G-XXXXXXXXXX',
        SENTRY_DSN: 'https://example@sentry.io/XXXXXX',
        ENABLE_ANALYTICS: true,
        ENABLE_ERROR_TRACKING: true
    };

    function initAnalytics() {
        if (!Config.ENABLE_ANALYTICS || Config.GA_ID === 'G-XXXXXXXXXX') {
            console.warn('Analytics desabilitado ou não configurado');
            return;
        }

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', Config.GA_ID, {
            'send_page_view': true,
            'anonymize_ip': true,
            'cookie_flags': 'SameSite=None;Secure'
        });

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${Config.GA_ID}`;
        document.head.appendChild(script);
    }

    function trackEvent(category, action, label, value) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }
    }

    function trackPageView(pagePath, pageTitle) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_path: pagePath,
                page_title: pageTitle
            });
        }
    }

    function initErrorTracking() {
        if (!Config.ENABLE_ERROR_TRACKING || Config.SENTRY_DSN.includes('example')) {
            console.warn('Error tracking desabilitado ou não configurado');
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://browser.sentry-cdn.com/7.54.0/bundle.min.js';
        script.crossOrigin = 'anonymous';
        script.onload = function() {
            Sentry.init({
                dsn: Config.SENTRY_DSN,
                environment: window.location.hostname === 'localhost' ? 'development' : 'production',
                integrations: [
                    new Sentry.BrowserTracing(),
                    new Sentry.Replay()
                ],
                tracesSampleRate: 0.1,
                replaysSessionSampleRate: 0.1,
                beforeSend(event) {
                    if (window.location.hostname === 'localhost') {
                        console.log('Sentry event (dev):', event);
                        return null;
                    }
                    return event;
                }
            });
        };
        document.head.appendChild(script);
    }

    function captureException(error, context) {
        if (typeof Sentry !== 'undefined') {
            Sentry.captureException(error, { extra: context });
        }
        console.error('Error captured:', error, context);
    }

    window.Analytics = {
        trackEvent,
        trackPageView,
        captureException,
        config: Config
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initAnalytics();
            initErrorTracking();
        });
    } else {
        initAnalytics();
        initErrorTracking();
    }
})();
