import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Users, UserPlus, Home, Map as MapIcon, Landmark, Activity, Car, ArrowLeft } from "lucide-react";
import Mapa from "../components/Mapa";

const INDICADORES = [
  { value: "renta",                     label: "Renta media (€)" }, 
  { value: "poblacion",                 label: "Población" },
  { value: "edad_media",                label: "Edad media" },
  { value: "densidad",                  label: "Densidad (hab/km²)" },
  { value: "valor_catastral",           label: "Valor catastral medio (€)" },
  { value: "num_viviendas",             label: "Nº de viviendas" },
  { value: "vehiculos",                 label: "Vehículos" },
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

        const geojsonRes = await fetch(`${import.meta.env.BASE_URL}data/barrios_con_datos.geojson`);

        if (!geojsonRes.ok) {
          throw new Error("No se pudieron cargar los datos.");
        }

        const data = await geojsonRes.json();
        setBarriosData(data);
        
        // Extraer indicadores de las propiedades del geojson
        const extractedIndicadores = data.features.map(f => {
          const p = f.properties;
          
          let poblacionTotal = 0;
          if (p.poblacionPorRango && p.poblacionPorRango["2025"]) {
            const p25 = p.poblacionPorRango["2025"];
            poblacionTotal = (p25["0-15"]?.total || 0) + (p25["16-64"]?.total || 0) + (p25[">64"]?.total || 0);
          }

          const densidad = p.superficie && poblacionTotal ? Math.round(poblacionTotal / p.superficie) : null;
          
          return {
            BARRIO: p.BARRIO,
            nombre: p.TEXTO,
            poblacion: poblacionTotal,
            renta: p.renta?.familiar?.["2023"] || null,
            edad_media: p.edad_media?.["2025"] || null,
            valor_catastral: p.vivienda?.valor_catastral?.["2025"] || null,
            num_viviendas: p.vivienda?.cantidad?.["2025"] || null,
            vehiculos: p.vehiculos?.["2024"] || null,
            densidad: densidad
          };
        });

        setIndicadores(extractedIndicadores);
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
    <div className="min-h-screen bg-slate-900 pt-10 pb-8 font-sans">
      <div className="max-w-[1400px] mx-auto px-6">

      <Link to="/" className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity w-fit">
        <img src={`${import.meta.env.BASE_URL}logo_vg.png`} alt="V-G Business Map Logo" className="w-9 h-9 object-contain" />
        <h1 className="text-3xl font-bold text-white tracking-tight">
          V-G Business Map
        </h1>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-slate-800/50 px-6 py-5 rounded-2xl shadow-lg border border-slate-700 backdrop-blur-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor="indicador" className="font-medium text-sm text-slate-300 shrink-0">Indicador: </label>
          <select
            id="indicador"
            value={indicadorActivo}
            onChange={(e) => setIndicadorActivo(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-1.5 border border-slate-600 rounded-lg text-sm bg-slate-700 text-white cursor-pointer outline-none focus:border-emerald-500"
          >
            {INDICADORES.map((ind) => (
              <option key={ind.value} value={ind.value}>
                {ind.label}
              </option>
            ))}
          </select>
        </div>

        <Link to="/" className="flex items-center justify-center gap-2 text-sm font-bold text-slate-300 hover:text-white bg-slate-800 border border-slate-600 px-4 py-2 rounded-xl hover:bg-slate-700 hover:shadow-md transition-all shadow-sm w-full sm:w-auto">
          <ArrowLeft size={18} />
          Volver al Inicio
        </Link>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-700">
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
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 p-5 relative shadow-lg">
                <h3 className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wide">Densidad</h3>
                <p className="text-2xl font-bold text-white">
                  {barrioSeleccionado.densidad ? barrioSeleccionado.densidad.toLocaleString("es-ES") : "Sin datos"} <span className="text-xs font-normal text-slate-400">hab/km²</span>
                </p>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-blue-500/20 text-blue-400 rounded-full">
                  <UserPlus size={20} />
                </div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 p-5 relative shadow-lg">
                <h3 className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wide">Habitantes</h3>
                <p className="text-3xl font-bold text-white">
                  {barrioSeleccionado.poblacion ? (barrioSeleccionado.poblacion / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 }) + " mil" : "Sin datos"}
                </p>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-emerald-500/20 text-emerald-400 rounded-full">
                  <Users size={20} />
                </div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 p-5 relative shadow-lg">
                <h3 className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wide">Valor Catastral Medio</h3>
                <p className="text-3xl font-bold text-white">
                  {barrioSeleccionado.valor_catastral ? (barrioSeleccionado.valor_catastral / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 }) + " mil €" : "Sin datos"}
                </p>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-purple-500/20 text-purple-400 rounded-full">
                  <Home size={20} />
                </div>
              </div>
              
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 p-5 relative shadow-lg">
                <h3 className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wide">Vehículos</h3>
                <p className="text-3xl font-bold text-white">
                  {barrioSeleccionado.vehiculos ? barrioSeleccionado.vehiculos.toLocaleString("es-ES") : "Sin datos"}
                </p>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-amber-500/20 text-amber-400 rounded-full">
                  <Car size={20} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button 
                  onClick={() => navigate(`/barrios/${barrioSeleccionado.BARRIO}/economia`)}
                  className="flex-1 bg-slate-800 text-slate-300 font-semibold py-3.5 px-4 rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-slate-600 hover:border-emerald-500 flex items-center justify-center gap-2.5 shadow-lg group"
                >
                  <Landmark size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Economía y Patrimonio</span>
                </button>
                <button 
                  onClick={() => navigate(`/barrios/${barrioSeleccionado.BARRIO}/demografia`)}
                  className="flex-1 bg-slate-800 text-slate-300 font-semibold py-3.5 px-4 rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-slate-600 hover:border-emerald-500 flex items-center justify-center gap-2.5 shadow-lg group"
                >
                  <Users size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Demografía del Barrio</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/50 rounded-2xl p-6 shadow-sm border border-slate-700 flex flex-col items-center justify-center h-full text-slate-400 text-center backdrop-blur-sm">
              <MapIcon size={48} className="text-slate-600 mb-4" />
              <p>Selecciona un barrio en el mapa para ver sus datos generales y explorar más detalles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}
