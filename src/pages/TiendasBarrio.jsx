import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import MapaTiendas from "../components/MapaTiendas";
import { ICONOS_BASE, TRADUCCIONES_TIPO } from "./tiendas/tiendasConfig";

export default function TiendasBarrio() {
  const { id } = useParams();
  const [tiendasData, setTiendasData] = useState(null);
  const [barrioGeo, setBarrioGeo] = useState(null);
  const [mostrarTodos, setMostrarTodos] = useState(false);

  useEffect(() => {
    fetch("/data/comercios_clasificados.geojson")
      .then(r => r.json())
      .then(data => {
        const filtradas = data.features.filter(t => {
          const mismoBarrio = String(t.properties.id_barrio) === id;
          const tieneImagen = ICONOS_BASE[t.properties.shop];
          return mismoBarrio && tieneImagen;
        });

        setTiendasData({
          type: "FeatureCollection",
          features: filtradas
        });
      });

    fetch("/data/barrios.geojson")
      .then(r => r.json())
      .then(data => {
        const barrio = data.features.find(
          b => String(b.properties.BARRIO) === id
        );
        setBarrioGeo(barrio);
      });
  }, [id]);

  const tipos = {};
  tiendasData?.features.forEach(t => {
    const tipo = t.properties.shop;
    tipos[tipo] = (tipos[tipo] || 0) + 1;
  });

  const tiposArray = Object.entries(tipos).sort((a, b) => b[1] - a[1]);
  const tiposVisibles = mostrarTodos ? tiposArray : tiposArray.slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-white flex flex-col">
      
      {/* Header Container */}
      <div className="p-6 pb-0">
        <Link to="/" className="inline-block mb-6 hover:opacity-80 transition-opacity">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            V-G BUSINESSMAP
          </h1>
        </Link>

        <div className="flex items-center justify-end mb-6 bg-slate-800/50 px-6 py-5 rounded-2xl shadow-lg border border-slate-700 backdrop-blur-sm">
          <Link
            to="/Tiendas"
            className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white bg-slate-800 border border-slate-600 px-4 py-2 rounded-xl hover:bg-slate-700 hover:shadow-md transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
            Volver a Tiendas
          </Link>
        </div>
      </div>

      {/* Main Responsive Grid Container */}
      <div className="flex flex-col lg:flex-row gap-6 p-6 pt-0 flex-1">
        
        {/* Info Card Panel */}
        <div className="flex-1 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl order-2 lg:order-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {barrioGeo?.properties?.TEXTO}
            </h1>

            <p className="mt-2 text-slate-400">
              Total tiendas en este barrio: <span className="text-emerald-400 font-bold">{tiendasData?.features.length || 0}</span>
            </p>

            <h2 className="mt-6 font-semibold text-slate-200 uppercase tracking-wide text-xs">
              Distribución por categorías
            </h2>

            <ul className="mt-4 text-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tiposVisibles.map(([tipo, count]) => (
                <li
                  key={tipo}
                  className="bg-slate-700/40 border border-slate-600 rounded-xl px-4 py-3 text-slate-300 flex justify-between items-center hover:bg-slate-700/60 transition-colors"
                >
                  <span>{TRADUCCIONES_TIPO[tipo] || tipo}</span>
                  <span className="font-bold text-white bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs">{count}</span>
                </li>
              ))}
            </ul>

            {tiposArray.length > 6 && (
              <button
                onClick={() => setMostrarTodos(!mostrarTodos)}
                className="mt-5 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-all flex items-center gap-1 cursor-pointer"
              >
                {mostrarTodos ? "Mostrar menos" : `Mostrar más (${tiposArray.length - 6})`}
              </button>
            )}
          </div>
        </div>

        {/* Map Panel */}
        <div className="w-full lg:flex-1 h-[50vh] lg:h-[75vh] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl order-1 lg:order-2 relative bg-slate-800">
          <MapaTiendas
            tiendasData={tiendasData}
            filtros={[]}
            diccionarioIconos={ICONOS_BASE}
            barrioSeleccionado={barrioGeo}
            mostrarTodasSiNoHayFiltros={true}
          />
        </div>

      </div>

    </div>
  );
}