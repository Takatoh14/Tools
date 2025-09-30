import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import DataReplace from '../pages/DataReplace';
import DiffTool from '../pages/DiffTool';
import Home from '../pages/Home';
import JsonConvert from '../pages/JsonConvert';
import JsonCreate from '../pages/JsonCreate';
import JsonFormat from '../pages/JsonFormat';

const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/tools" element={<Home />} />
        <Route path="/tools/data-replace" element={<DataReplace />} />
        <Route path="/tools/json-convert" element={<JsonConvert />} />
        <Route path="/tools/json-create" element={<JsonCreate />} />
        <Route path="tools/json-format" element={<JsonFormat />} />
        <Route path="tools/diff-tool" element={<DiffTool />} />
      </Routes>
    </Router>
  );
};

export default Routers;
