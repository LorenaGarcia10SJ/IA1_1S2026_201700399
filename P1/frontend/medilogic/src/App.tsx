import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Paciente from "./pages/Paciente";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/paciente" element={<Paciente />} />

        <Route path="/admin" element={<Admin />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;