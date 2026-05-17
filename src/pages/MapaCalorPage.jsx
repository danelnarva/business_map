import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Flame } from "lucide-react";

import MapaCalor from "../components/MapaCalor";

export default function MapaCalorPage() {

  const [tiendas, setTiendas] = useState(null);
  const [servicios, setServicios] = useState(null);

  useEffect(() => {

    fetch(
      `${import.meta.env.BASE_URL}data/comercios_clasificados.geojson`
    )
      .then(r => r.json())
      .then(setTiendas);

    fetch(
      `${import.meta.env.BASE_URL}data/servicios_clasificados.geojson`
    )
      .then(r => r.json())
      .then(setServicios);

  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">

      <div className="max-w-[1700px] mx-auto">

        <div className="flex items-center justify-between mb-8">

          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Flame className="text-orange-400" />
            Mapas de Calor
          </h1>

          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white bg-slate-800 border border-slate-600 px-4 py-2 rounded-xl hover:bg-slate-700 transition-all"
          >
            <ArrowLeft size={18} />
            Volver al Inicio
          </Link>

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">

            <div className="p-4 border-b border-slate-700">
              <h2 className="font-bold text-lg">
                Densidad de Tiendas
              </h2>
            </div>

            <div className="h-[75vh]">
              <MapaCalor data={tiendas} />
            </div>

          </div>

          <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">

            <div className="p-4 border-b border-slate-700">
              <h2 className="font-bold text-lg">
                Densidad de Servicios
              </h2>
            </div>

            <div className="h-[75vh]">
              <MapaCalor data={servicios} />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}