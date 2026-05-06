import { useState, useEffect } from "react";
import MapaTiendas from "./MapaTiendas";

export default function Tiendas({ volver }) {
  const [tiendasData, setTiendasData] = useState(null);
  const [filtrosActivos, setFiltrosActivos] = useState([]);

  useEffect(() => {
    fetch("/data/comercios_clasificados.geojson")
      .then(res => res.json())
      .then(setTiendasData);
  }, []);

  function toggleFiltro(tipo) {
    setFiltrosActivos(prev =>
      prev.includes(tipo)
        ? prev.filter(t => t !== tipo)
        : [...prev, tipo]
    );
  }

  function limpiarFiltros() {
    setFiltrosActivos([]);
  }

  return (
    <div className="h-screen flex flex-col">
      
      <button onClick={volver}>Volver</button>

      <div className="flex flex-1">

        {/* MAPA */}
        <div className="flex-1">
          <MapaTiendas 
            tiendasData={tiendasData}
            filtros={filtrosActivos}
          />
        </div>

        {/* SIDEBAR */}
        <div className="w-80 bg-white p-4 overflow-y-auto">
          
          <button onClick={limpiarFiltros}>
            Limpiar filtros
          </button>

          {/* aquí tus iconos */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {["furniture", "department_store"].map(tipo => (
              <img
                key={tipo}
                src={`/data/fotos_mapa/tiendas/${tipo}.png`}
                onClick={() => toggleFiltro(tipo)}
                className="cursor-pointer"
              />
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}