import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import MapaTiendas from "../components/MapaTiendas";
import { ICONOS_BASE, TRADUCCIONES_TIPO } from "./tiendas/tiendasConfig";

export default function TiendasBarrio() {

  const { id } = useParams();

  const [tiendasData, setTiendasData] = useState(null);
  const [barrioGeo, setBarrioGeo] = useState(null);
  

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

  return (
    <div className="h-screen flex flex-col">

      <div className="p-4 bg-white shadow z-10">

        <Link
          to="/Tiendas"
          className="text-sm text-blue-600 hover:underline"
        >
          Volver
        </Link>

        <h1 className="mt-2 text-2xl font-bold text-gray-800">
          {barrioGeo?.properties?.TEXTO}
        </h1>

        <p className="mt-2 text-gray-600">
          Total tiendas: {
            tiendasData?.features.length || 0
          }
        </p>

        <h2 className="mt-4 font-semibold">
          Tipos de tiendas
        </h2>

        <ul className="mt-2 text-sm grid grid-cols-2 gap-x-8 gap-y-1">
          {Object.entries(tipos).map(([tipo, count]) => (
            <li key={tipo}>
              {TRADUCCIONES_TIPO[tipo] || tipo}: {count}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1">

        <MapaTiendas
          tiendasData={tiendasData}
          filtros={[]}
          diccionarioIconos={ICONOS_BASE}
          barrioSeleccionado={barrioGeo}
          mostrarTodasSiNoHayFiltros={true}
        />

      </div>
    </div>
  );
}