import { useEffect, useState } from "react";
import Mapa from "./components/Mapa";
import Grafico from "./components/Grafico";
import "./App.css";
import RankingBarrios from "./components/RankingBarrios";



const INDICADORES = [
  { value: "renta",                     label: "Renta media (€)" },
  { value: "poblacion",                 label: "Población" },
  { value: "edad_media",                label: "Edad media" },
  { value: "densidad",                  label: "Densidad (hab/100m²)" },
  { value: "valor_catastral",           label: "Valor catastral medio (€)" },
  { value: "num_viviendas",             label: "Nº de viviendas" },
  { value: "establecimientos_total",    label: "Total establecimientos" },
  { value: "establecimientos_comercio", label: "Comercios" },
  { value: "establecimientos_hosteleria", label: "Hostelería" },
  { value: "establecimientos_servicios",  label: "Servicios" },
];

export default function App() {
  const [barriosData, setBarriosData] = useState(null);
  const [indicadoresData, setIndicadores] = useState([]);
  const [indicadorActivo, setIndicadorActivo] = useState("renta");
  const [barrioSeleccionado, setBarrioSeleccionado] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        setCargando(true);

        const [geojsonRes, indicadoresRes] = await Promise.all([
          fetch("/data/barrios.geojson"),
          fetch("/data/indicadores.json"),
        ]);

        if (!geojsonRes.ok || !indicadoresRes.ok) {
          throw new Error("No se pudieron cargar los datos.");
        }

        setBarriosData(await geojsonRes.json());
        setIndicadores(await indicadoresRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  if (cargando) {
    return <div className="app">Cargando datos urbanos...</div>;
  }

  if (error) {
    return <div className="app">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-200 pt-10 pb-8">
      <div className="max-w-[1400px] mx-auto px-6">

      <h1 className="text-3xl font-semibold text-slate-800 mb-6">
        Vitoria-Gasteiz Business Map
      </h1>

      <div className="flex items-center gap-4 mb-8 bg-slate-100 px-6 py-5 rounded-2xl shadow-sm border border-slate-200">
        <label htmlFor="indicador" className="font-medium text-sm text-slate-600">Indicador: </label>
        <select
          id="indicador"
          value={indicadorActivo}
          onChange={(e) => setIndicadorActivo(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white cursor-pointer outline-none focus:border-blue-600"
        >
          {INDICADORES.map((ind) => (
            <option key={ind.value} value={ind.value}>
              {ind.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
          {barriosData && (
            <Mapa
              barriosData={barriosData}
              indicadoresData={indicadoresData}
              indicadorActivo={indicadorActivo}
              labelIndicador={INDICADORES.find((i) => i.value === indicadorActivo)?.label}
              onBarrioClick={setBarrioSeleccionado}
            />
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center justify-center">
          <Grafico
            barrio={barrioSeleccionado}
            indicadorActivo={indicadorActivo}
            indicadoresData={indicadoresData}
            labelIndicador={INDICADORES.find(i => i.value === indicadorActivo)?.label}
          />
        </div>
      </div>
      <RankingBarrios
        indicadoresData={indicadoresData}
        indicadorActivo={indicadorActivo}
        labelIndicador={INDICADORES.find((i) => i.value === indicadorActivo)?.label}
        onBarrioClick={setBarrioSeleccionado}
      />
    </div>
  </div>
  );
}
