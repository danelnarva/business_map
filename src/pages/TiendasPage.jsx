import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MapaTiendas from "../components/MapaTiendas";
import { useNavigate } from "react-router-dom";
import { ICONOS_BASE, ETIQUETAS } from "./tiendas/tiendasConfig";
import { ArrowLeft, Flame } from "lucide-react";

export default function TiendasPage() {
  const navigate = useNavigate();
  const [tiendasData, setTiendasData] = useState(null);
  const [filtrosActivos, setFiltrosActivos] = useState([]);
  const [barriosData, setBarriosData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/comercios_clasificados.geojson`)
      .then(res => res.json())
      .then(setTiendasData);

    fetch(`${import.meta.env.BASE_URL}data/barrios.geojson`)
      .then(res => res.json())
      .then(setBarriosData);
  }, []);

  const obtenerShopsPorImagen = (nombreImagen) => {
    return Object.keys(ICONOS_BASE).filter(shop => ICONOS_BASE[shop] === nombreImagen);
  };

  function toggleFiltro(nombreImagen) {
    setFiltrosActivos(prev =>
      prev.includes(nombreImagen)
        ? prev.filter(img => img !== nombreImagen)
        : [...prev, nombreImagen]
    );
  }

  const obtenerFiltrosReales = () => {
    return filtrosActivos.flatMap(img => obtenerShopsPorImagen(img));
  };

  function seleccionarTodos() {
    setFiltrosActivos(imagenesUnicas);
  }

  const imagenesUnicas = tiendasData
    ? [...new Set(tiendasData.features
      .map(f => ICONOS_BASE[f.properties.shop])
      .filter(img => img !== undefined)
    )]
    : [];

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-white">
      
      <div className="max-w-[1600px] mx-auto px-6 pt-8 pb-6">

        <Link to="/" className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity w-fit">
          <img src={`${import.meta.env.BASE_URL}logo_vg.png`} alt="V-G Business Map Logo" className="w-9 h-9 object-contain" />
          <h1 className="text-3xl font-bold text-white tracking-tight">
            V-G Business Map, Comercios
          </h1>

        </Link>
        <div className="flex items-center justify-between mb-8 bg-slate-800/50 px-6 py-5 rounded-2xl shadow-lg border border-slate-700 backdrop-blur-sm">

          <Link
            to="/MapaCalor"  state={{ from: "tiendas" }}
            className="flex items-center gap-2 text-sm font-bold text-orange-300 hover:text-white bg-orange-500/10 border border-orange-500/40 px-4 py-2 rounded-xl hover:bg-orange-500/20 transition-all"
          >
            Mapas de calor
          </Link>
.

          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white bg-slate-800 border border-slate-600 px-4 py-2 rounded-xl hover:bg-slate-700 hover:shadow-md transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
            Volver al Inicio
          </Link>

        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          <div className="w-full lg:flex-1 relative h-[50vh] lg:min-h-[700px] lg:h-[85vh] bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl order-1 lg:order-1">
            <MapaTiendas
              tiendasData={tiendasData}
              filtros={obtenerFiltrosReales()}
              diccionarioIconos={ICONOS_BASE}
              barriosData={barriosData}
              onBarrioClick={(barrio) =>
                navigate(`/tiendasBarrio/${barrio.BARRIO}`)
              }
            />
          </div>

          <div className="w-full lg:w-80 bg-slate-800/80 backdrop-blur-sm p-5 border border-slate-700 rounded-2xl shadow-xl order-2 lg:order-2">
            
            <h2 className="text-lg font-bold text-white mb-5">
              Filtros
            </h2>

            <div className="flex gap-2 mb-6">

              <button
                className="flex-1 border border-emerald-500 text-emerald-400 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                onClick={seleccionarTodos}
              >
                Seleccionar todos
              </button>

              <button
                className="flex-1 border border-slate-600 text-slate-300 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-slate-700 transition-all cursor-pointer"
                onClick={() => setFiltrosActivos([])}
              >
                Limpiar
              </button>

            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-3 gap-y-6 gap-x-3">
              {imagenesUnicas.map((img) => (
                <div
                  key={img}
                  onClick={() => toggleFiltro(img)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`p-2 rounded-2xl border transition-all ${
                      filtrosActivos.includes(img)
                        ? "border-emerald-500 bg-emerald-500/10 scale-110 shadow-lg"
                        : "border-slate-700 bg-slate-700/40 hover:border-slate-500"
                    }`}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}fotos_mapa/tiendas/${img}`}
                      alt={img}
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  <span
                    className={`mt-2 text-[11px] text-center leading-tight font-medium ${
                      filtrosActivos.includes(img)
                        ? "text-emerald-400 font-bold"
                        : "text-slate-400"
                    }`}
                  >
                    {ETIQUETAS[img] || "Tienda"}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
