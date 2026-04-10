import { I18nProvider } from './i18n';
import ErrorBoundary from './component/ErrorBoundary';
import MunicipalityChart from './component/MunicipalityChart';
import './App.css';

const App = () => {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <MunicipalityChart />
      </I18nProvider>
    </ErrorBoundary>
  );
};

export default App;
