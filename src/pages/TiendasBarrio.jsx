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
          const mismoBarrio =
            String(t.properties.id_barrio) === id;

          const tieneImagen =
            ICONOS_BASE[t.properties.shop];

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

  const tiposArray = Object.entries(tipos)
  .sort((a, b) => b[1] - a[1]);

  const tiposVisibles = mostrarTodos
    ? tiposArray
    : tiposArray.slice(0, 6);

return (
  <div className="min-h-screen bg-slate-900 font-sans text-white">
    
    <div className="p-6">

      <Link to="/" className="inline-block mb-6 hover:opacity-80 transition-opacity">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          V-G BUSINESSMAP
        </h1>
      </Link>

      <div className="flex items-center justify-end mb-6 bg-slate-800/50 px-6 py-5 rounded-2xl shadow-lg border border-slate-700 backdrop-blur-sm">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white bg-slate-800 border border-slate-600 px-4 py-2 rounded-xl hover:bg-slate-700 hover:shadow-md transition-all shadow-sm"
        >
          <ArrowLeft size={18} />
          Volver al Inicio
        </Link>
      </div>

      <div className="mt-6 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
        
        <h1 className="text-3xl font-bold text-white">
          {barrioGeo?.properties?.TEXTO}
        </h1>

        <p className="mt-2 text-slate-400">
          Total tiendas: {tiendasData?.features.length || 0}
        </p>

        <h2 className="mt-6 font-semibold text-slate-200 uppercase tracking-wide text-sm">
          Tipos de tiendas
        </h2>

        <ul className="mt-4 text-sm grid grid-cols-2 gap-x-8 gap-y-2">
            {tiposVisibles.map(([tipo, count]) => (            <li
              key={tipo}
              className="bg-slate-700/40 border border-slate-600 rounded-lg px-3 py-2 text-slate-300"
            >
              {TRADUCCIONES_TIPO[tipo] || tipo}:{" "}
              <span className="font-bold text-white">{count}</span>
            </li>
          ))}
        </ul>
        {tiposArray.length > 6 && (

          <button
            onClick={() =>
              setMostrarTodos(!mostrarTodos)
            }
            className="mt-4 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-all"
          >

            {mostrarTodos
              ? "Mostrar menos"
              : `Mostrar más (${tiposArray.length - 6})`
            }

          </button>

        )}

      </div>
    </div>

    <div className="flex-1 px-6 pb-6">
      <div className="h-[75vh] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
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