import './App.css';
import './i18n';
import { Routes, Route } from 'react-router-dom';
import { PA0002_ItineraryPage } from 'Components/pages/PA0002_ItineraryPage/view';
import MC0003_AppBar from 'Components/molecules/MC0003_AppBar/view';
import MC0004_Footer from 'Components/molecules/MC0004_Footer/view';
import theme from 'theme';
import { ThemeProvider } from "@material-ui/core/styles";

function App() {
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <MC0003_AppBar />
                <Routes>
                    <Route path="/" element={<PA0002_ItineraryPage />} />
                    <Route path="/itineraries" element={<PA0002_ItineraryPage />} >
                        <Route path=":itineraryId" element={<PA0002_ItineraryPage />} />
                    </Route>
                </Routes>
                <MC0004_Footer />
            </ThemeProvider>
        </div>
    );
}

export default App;