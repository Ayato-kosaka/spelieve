import './App.css';
import './i18n';
import { Routes, Route } from 'react-router-dom';
import theme from 'theme';
import { ThemeProvider } from '@material-ui/core/styles';

import PA0002ItineraryPage from 'SV0001Itinerary/Components/pages/PA0002ItineraryPage';
import MC0003AppBar from 'SV0001Itinerary/Components/molecules/MC0003AppBar';
import MC0004Footer from 'SV0001Itinerary/Components/molecules/MC0004Footer';

function App() {
    return (
        <div className='App'>
            <ThemeProvider theme={theme}>
                <MC0003AppBar />
                <Routes>
                    <Route path='/' element={<PA0002ItineraryPage />} />
                    <Route path='/itineraries' element={<PA0002ItineraryPage />} >
                        <Route path=':itineraryId' element={<PA0002ItineraryPage />} />
                    </Route>
                </Routes>
                <MC0004Footer />
            </ThemeProvider>
        </div>
    );
}

export default App;