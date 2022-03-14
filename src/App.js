import './App.css';
import './i18n';
import { Routes, Route } from 'react-router-dom';
import YsiList from "./Components/organisms/OG0000_YsiList/view";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<YsiList />} />
      </Routes>
    </div>
  );
}

export default App;