import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BarriosPage from "./pages/BarriosPage";
import TiendasPage from "./pages/TiendasPage";
import ServiciosPage from "./pages/ServiciosPage";
import TendenciasPage from "./pages/TendenciasPage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Barrios" element={<BarriosPage />} />
        <Route path="/Tiendas" element={<TiendasPage />} />
        <Route path="/Servicios" element={<ServiciosPage />} />
        <Route path="/Tendencias" element={<TendenciasPage />} />
      </Routes>
    </BrowserRouter>
  );
}