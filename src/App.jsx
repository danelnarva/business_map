import { useState } from "react";
import Barrios from "./components/Barrios";
import Tiendas from "./components/Tiendas";
import Servicios from "./components/Servicios";
import "./App.css";

function Home({ onNavigate }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200 px-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">

        <button className="bg-white p-8 rounded-2xl shadow text-xl font-semibold"
          onClick={() => onNavigate("tiendas")}
        >
          🏬 Tiendas
        </button>

        <button className="bg-white p-8 rounded-2xl shadow text-xl font-semibold"
          onClick={() => onNavigate("servicios")}
        >
          🧰 Servicios
        </button>

        <button
          onClick={() => onNavigate("barrios")}
          className="bg-blue-600 text-white p-8 rounded-2xl shadow text-xl font-semibold"
        >
          🏙️ Barrios
        </button>

      </div>
    </div>
  );
}

export default function App() {
  const [vista, setVista] = useState("home");

  if (vista === "home") {
    return <Home onNavigate={setVista} />;
  }

  if (vista === "barrios") {
    return <Barrios volver={() => setVista("home")} />;
  }

  if (vista === "tiendas") {
    return <Tiendas volver={() => setVista("home")} />;
  }

  if (vista === "servicios") {
    return <Servicios volver={() => setVista("home")} />;
  }

  return null;
}