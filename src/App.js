import './App.css';
import './i18n';
import { Routes, Route } from 'react-router-dom';
import { PA0002_ItineraryPage } from 'Components/pages/PA0002_ItineraryPage/view';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<PA0002_ItineraryPage />} />
      </Routes>
    </div>
  );
}

export default App;