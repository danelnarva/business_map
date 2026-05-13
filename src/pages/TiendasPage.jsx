import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MapaTiendas from "../components/MapaTiendas";
import { useNavigate } from "react-router-dom";
import { ICONOS_BASE, ETIQUETAS } from "./tiendas/tiendasConfig";

export default function TiendasPage() {
  const navigate = useNavigate();
  const [tiendasData, setTiendasData] = useState(null);
  const [filtrosActivos, setFiltrosActivos] = useState([]);
  const [barriosData, setBarriosData] = useState(null);

  useEffect(() => {
  fetch("/data/comercios_clasificados.geojson")
    .then(res => res.json())
    .then(setTiendasData);

  fetch("/data/barrios.geojson")
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
    <div className="h-screen flex flex-col font-sans text-gray-800">
        <Link to="/" className="mb-0 text-sm text-blue-600 hover:underline">
          Volver
        </Link>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <MapaTiendas
            tiendasData={tiendasData}
            filtros={obtenerFiltrosReales()}
            diccionarioIconos={ICONOS_BASE}
            barriosData={barriosData}
            onBarrioClick={(barrio) => navigate(`/tiendasBarrio/${barrio.BARRIO}`)}
          />
        </div>

        <div className="w-72 bg-white p-4 overflow-y-auto border-l shadow-xl">
          
          <div className="flex gap-2 mb-6">
            
            <button
              className="flex-1 border border-blue-300 text-blue-600 rounded-md px-2 py-2 text-xs font-bold uppercase tracking-wider hover:bg-blue-50 transition-colors"
              onClick={seleccionarTodos}
            >
              Seleccionar todos
            </button>

            <button
              className="flex-1 border border-gray-300 rounded-md px-2 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
              onClick={() => setFiltrosActivos([])}
            >
              Limpiar filtros
            </button>

          </div>

          <div className="grid grid-cols-3 gap-y-6 gap-x-2">
            {imagenesUnicas.map(img => (
              <div
                key={img}
                onClick={() => toggleFiltro(img)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className={`p-1 rounded-full border-2 transition-all ${filtrosActivos.includes(img)
                    ? "border-blue-500 bg-blue-50 scale-110 shadow-md"
                    : "border-transparent group-hover:border-gray-100"
                  }`}>
                  <img
                    src={`/fotos_mapa/tiendas/${img}`}
                    alt={img}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <span className={`mt-1 text-[10px] text-center leading-tight font-medium ${filtrosActivos.includes(img) ? "text-blue-600 font-bold" : "text-gray-500"
                  }`}>
                  {ETIQUETAS[img] || "Tienda"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
