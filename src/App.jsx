import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BarriosPage from "./pages/BarriosPage";
import TiendasPage from "./pages/TiendasPage";
import ServiciosPage from "./pages/ServiciosPage";
import TendenciasPage from "./pages/TendenciasPage";
import BarrioDashboardPage from "./pages/barrios/BarrioDashboardPage";
import BarrioComerciosView from "./pages/barrios/BarrioComerciosView";
import BarrioSaludView from "./pages/barrios/BarrioSaludView";
import TiendasBarrio from "./pages/TiendasBarrio";
import ServiciosBarrios from "./pages/ServiciosBarrios";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter basename="/business_map/">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Barrios" element={<BarriosPage />} />
        <Route path="/barrios/:barrioId" element={<BarrioDashboardPage />}>
          <Route path="economia" element={<BarrioComerciosView />} />
          <Route path="demografia" element={<BarrioSaludView />} />
        </Route>
        <Route path="/Tiendas" element={<TiendasPage />} />
        <Route path="/tiendasBarrio/:id" element={<TiendasBarrio/>} />
        <Route path="/Servicios" element={<ServiciosPage />} />
        <Route path="/serviciosBarrios/:id" element={<ServiciosBarrios/>} />
        <Route path="/Tendencias" element={<TendenciasPage />} />
      </Routes>
    </BrowserRouter>
  );
}