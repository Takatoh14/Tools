import './styles/style.scss';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Diff from './pages/Diff';
import JsonConvert from './pages/Json-convert';
import JsonCreate from './pages/Json-create';
import JsonFormat from './pages/Json-format';
import Replace from './pages/Replace';
import Top from './pages/Top';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tools/" element={<Top />} />
        <Route path="/tools/diff" element={<Diff />} />
        <Route path="/tools/replace" element={<Replace />} />
        <Route path="/tools/json-create" element={<JsonCreate />} />
        <Route path="/tools/json-convert" element={<JsonConvert />} />
        <Route path="/tools/json-format" element={<JsonFormat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
