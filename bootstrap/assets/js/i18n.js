/**
 * Sistema de internacionalização (i18n) para Balneabilidade SC
 * Suporte: pt-BR, en-US
 */
const I18n = (function() {
    'use strict';

    const translations = {
        'pt-BR': {
            appTitle: 'Balneabilidade das Praias SC',
            appDescription: 'Consulte a qualidade da água das praias de Santa Catarina',
            selectMunicipality: 'Selecione o município:',
            selectYear: 'Selecione o ano:',
            municipalityPlaceholder: 'Escolha um município',
            municipalityHelp: 'Use Tab para navegar e Enter para selecionar',
            loading: 'Carregando...',
            loadingData: 'Carregando dados...',
            noDataFound: 'Nenhum dado encontrado para o município selecionado.',
            processingError: 'Não foi possível processar os dados do gráfico.',
            connectionError: 'Erro ao carregar os dados.',
            error: 'Erro',
            close: 'Fechar',
            source: 'Fonte: IMA SC',
            footerText: 'Dados fornecidos pelo',
            footerLink: 'Instituto do Meio Ambiente de Santa Catarina (IMA)',
            chartAriaLabel: 'Gráfico de balneabilidade das praias',
            municipalityLabel: 'Município',
            yearLabel: 'Ano',
            ecocoliLabel: 'Coliformes Termotolerantes (NMP/100ml)',
            dateLabel: 'Data de Coleta',
            navigation: 'Navegação principal',
            openMenu: 'Abrir menu de navegação',
            home: 'Página inicial',
            errorTitle: 'Erro',
            networkError: 'Erro de conexão. Verifique sua internet.',
            serverError: 'Erro no servidor. Tente novamente mais tarde.',
            invalidMunicipality: 'Município inválido selecionado.'
        },
        'en-US': {
            appTitle: 'Beach Water Quality SC',
            appDescription: 'Check water quality of Santa Catarina beaches',
            selectMunicipality: 'Select municipality:',
            selectYear: 'Select year:',
            municipalityPlaceholder: 'Choose a municipality',
            municipalityHelp: 'Use Tab to navigate and Enter to select',
            loading: 'Loading...',
            loadingData: 'Loading data...',
            noDataFound: 'No data found for the selected municipality.',
            processingError: 'Unable to process chart data.',
            connectionError: 'Error loading data.',
            error: 'Error',
            close: 'Close',
            source: 'Source: IMA SC',
            footerText: 'Data provided by',
            footerLink: 'Santa Catarina Environmental Institute (IMA)',
            chartAriaLabel: 'Beach water quality chart',
            municipalityLabel: 'Municipality',
            yearLabel: 'Year',
            ecocoliLabel: 'Thermotolerant Coliforms (MPN/100ml)',
            dateLabel: 'Collection Date',
            navigation: 'Main navigation',
            openMenu: 'Open navigation menu',
            home: 'Home page',
            errorTitle: 'Error',
            networkError: 'Connection error. Check your internet.',
            serverError: 'Server error. Try again later.',
            invalidMunicipality: 'Invalid municipality selected.'
        }
    };

    let currentLocale = 'pt-BR';

    function detectLocale() {
        const browserLang = navigator.language || navigator.userLanguage;
        if (translations[browserLang]) {
            return browserLang;
        }
        const langPrefix = browserLang.split('-')[0];
        for (const lang in translations) {
            if (lang.startsWith(langPrefix)) {
                return lang;
            }
        }
        return 'pt-BR';
    }

    function setLocale(locale) {
        if (translations[locale]) {
            currentLocale = locale;
            localStorage.setItem('locale', locale);
            return true;
        }
        return false;
    }

    function getLocale() {
        return currentLocale;
    }

    function t(key) {
        const translation = translations[currentLocale];
        return translation && translation[key] ? translation[key] : key;
    }

    function init() {
        const stored = localStorage.getItem('locale');
        currentLocale = stored && translations[stored] ? stored : detectLocale();
        document.documentElement.lang = currentLocale;
    }

    return {
        init,
        setLocale,
        getLocale,
        t,
        getAvailableLocales: () => Object.keys(translations)
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}
