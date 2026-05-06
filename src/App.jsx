import { useState } from "react";
import Barrios from "./components/Barrios";
import Tiendas from "./components/Tiendas";
import Servicios from "./components/Servicios";
import "./App.css";

function Home({ onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-200 px-6">

      {/* TÍTULO */}
      <h1 className="text-4xl font-bold text-slate-800 mb-10">
        V-G BUSINESSMAP
      </h1>

      {/* BOTONES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">

        <button
          onClick={() => onNavigate("tiendas")}
          className="bg-slate-300 text-slate-800 p-8 rounded-2xl shadow text-xl font-semibold 
                     hover:bg-blue-600 hover:text-white cursor-pointer transition"
        >
          🏬 Tiendas
        </button>

        <button
          onClick={() => onNavigate("servicios")}
          className="bg-slate-300 text-slate-800 p-8 rounded-2xl shadow text-xl font-semibold 
                     hover:bg-blue-600 hover:text-white cursor-pointer transition"
        >
          🧰 Servicios
        </button>

        <button
          onClick={() => onNavigate("barrios")}
          className="bg-slate-300 text-slate-800 p-8 rounded-2xl shadow text-xl font-semibold 
                     hover:bg-blue-600 hover:text-white cursor-pointer transition"
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