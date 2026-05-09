import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Users, UserPlus, Home, Map as MapIcon, Store, Activity } from "lucide-react";
import Mapa from "../components/Mapa";

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

export default function BarriosPage() {
  const [barriosData, setBarriosData] = useState(null);
  const [indicadoresData, setIndicadores] = useState([]);
  const [indicadorActivo, setIndicadorActivo] = useState("renta");
  const [barrioSeleccionado, setBarrioSeleccionado] = useState(null);
  const navigate = useNavigate();

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

        <Link to="/" className="mb-0 text-sm text-blue-600 hover:underline">
          Volver
        </Link>

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

        <div className="flex flex-col gap-4">
          {barrioSeleccionado ? (
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 relative shadow-sm">
                <h3 className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wide">Densidad</h3>
                <p className="text-2xl font-bold text-slate-800">
                  {barrioSeleccionado.densidad ? barrioSeleccionado.densidad.toLocaleString("es-ES") : "Sin datos"} <span className="text-xs font-normal text-slate-500">hab/100m²</span>
                </p>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-blue-50 text-blue-600 rounded-full">
                  <UserPlus size={20} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 relative shadow-sm">
                <h3 className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wide">Habitantes</h3>
                <p className="text-3xl font-bold text-slate-800">
                  {barrioSeleccionado.poblacion ? (barrioSeleccionado.poblacion / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 }) + " mil" : "Sin datos"}
                </p>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-emerald-50 text-emerald-600 rounded-full">
                  <Users size={20} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 relative shadow-sm">
                <h3 className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wide">Valor Catastral Medio</h3>
                <p className="text-3xl font-bold text-slate-800">
                  {barrioSeleccionado.valor_catastral ? (barrioSeleccionado.valor_catastral / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 }) + " mil €" : "Sin datos"}
                </p>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-purple-50 text-purple-600 rounded-full">
                  <Home size={20} />
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button 
                  onClick={() => navigate(`/barrios/${barrioSeleccionado.BARRIO}/comercios`)}
                  className="flex-1 bg-blue-50 text-blue-700 font-semibold py-3 px-4 rounded-xl hover:bg-blue-600 hover:text-white transition-colors border border-blue-100 hover:border-blue-600 flex flex-col items-center justify-center gap-1 shadow-sm"
                >
                  <Store size={24} />
                  <span className="text-sm">Comercios</span>
                </button>
                <button 
                  onClick={() => navigate(`/barrios/${barrioSeleccionado.BARRIO}/salud`)}
                  className="flex-1 bg-emerald-50 text-emerald-700 font-semibold py-3 px-4 rounded-xl hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-100 hover:border-emerald-600 flex flex-col items-center justify-center gap-1 shadow-sm"
                >
                  <Activity size={24} />
                  <span className="text-sm">Salud Demográfica</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center justify-center h-full text-slate-500 text-center">
              <MapIcon size={48} className="text-slate-300 mb-4" />
              <p>Selecciona un barrio en el mapa para ver sus datos generales y explorar más detalles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}
