import './App.css';
import './i18n';
import { Routes, Route } from 'react-router-dom';
import theme from 'theme';
import { ThemeProvider } from '@material-ui/core/styles';

import { CT0003DialogProvider } from 'SV0000Common/Hooks/contexts/CT0003Dialog'
import PA0002ItineraryPage from 'SV0001Itinerary/Components/pages/PA0002ItineraryPage';
import MC0003AppBar from 'SV0001Itinerary/Components/molecules/MC0003AppBar';
import MC0004Footer from 'SV0001Itinerary/Components/molecules/MC0004Footer';

function App() {
    return (
        <div className='App'>
            <CT0003DialogProvider>
                <ThemeProvider theme={theme}>
                    <MC0003AppBar />
                    <Routes>
                        <Route path='/' element={<PA0002ItineraryPage />} />
                        <Route path='/itineraries' element={<PA0002ItineraryPage />} >
                            <Route path=':itineraryID' element={<PA0002ItineraryPage />} />
                        </Route>
                    </Routes>
                    <MC0004Footer />
                </ThemeProvider>
            </CT0003DialogProvider>
        </div>
    );
}

export default App;