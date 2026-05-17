import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import MapaServicios from "../components/MapaServicios";

import {
  ICONOS_SERVICIOS,
  ETIQUETAS_SERVICIOS
} from "./servicios/serviciosConfig";

export default function ServiciosPage() {

  const navigate = useNavigate();

  const [serviciosData, setServiciosData] = useState(null);

  const [filtrosActivos, setFiltrosActivos] = useState([]);

  const [barriosData, setBarriosData] = useState(null);

  useEffect(() => {

    fetch("/data/servicios_clasificados.geojson")
      .then(res => res.json())
      .then(setServiciosData);

    fetch("/data/barrios.geojson")
      .then(res => res.json())
      .then(setBarriosData);

  }, []);

  const obtenerTiposPorImagen = (nombreImagen) => {

    return Object.keys(ICONOS_SERVICIOS)
      .filter(tipo =>
        ICONOS_SERVICIOS[tipo] === nombreImagen
      );

  };

  function toggleFiltro(nombreImagen) {

    setFiltrosActivos(prev =>
      prev.includes(nombreImagen)
        ? prev.filter(img => img !== nombreImagen)
        : [...prev, nombreImagen]
    );

  }

  const obtenerFiltrosReales = () => {

    return filtrosActivos.flatMap(img =>
      obtenerTiposPorImagen(img)
    );

  };

  function seleccionarTodos() {
    setFiltrosActivos(imagenesUnicas);
  }

  const imagenesUnicas = serviciosData
    ? [...new Set(
        serviciosData.features
          .map(f =>
            ICONOS_SERVICIOS[f.properties.amenity]
          )
          .filter(Boolean)
      )]
    : [];

  return (

    <div className="min-h-screen bg-slate-900 font-sans text-white">

      <div className="max-w-[1600px] mx-auto px-6 pt-8 pb-6">

        <Link to="/" className="inline-block mb-6 hover:opacity-80 transition-opacity">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            V-G BUSINESSMAP
          </h1>
        </Link>

        <div className="flex items-center justify-end mb-8 bg-slate-800/50 px-6 py-5 rounded-2xl shadow-lg border border-slate-700 backdrop-blur-sm">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white bg-slate-800 border border-slate-600 px-4 py-2 rounded-xl hover:bg-slate-700 hover:shadow-md transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
            Volver al Inicio
          </Link>
        </div>

        <div className="flex gap-6">

          <div className="flex-1 relative min-h-[700px] h-[85vh] bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">

            <MapaServicios
              serviciosData={serviciosData}
              filtros={obtenerFiltrosReales()}
              diccionarioIconos={ICONOS_SERVICIOS}
              barriosData={barriosData}
              onBarrioClick={(barrio) =>
                navigate(`/serviciosBarrios/${barrio.BARRIO}`)
              }
            />

          </div>

          <div className="w-80 bg-slate-800/80 backdrop-blur-sm p-5 overflow-y-auto border border-slate-700 rounded-2xl shadow-xl">

            <h2 className="text-lg font-bold text-white mb-5">
              Filtros
            </h2>

            <div className="flex gap-2 mb-6">

              <button
                className="flex-1 border border-emerald-500 text-emerald-400 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all"
                onClick={seleccionarTodos}
              >
                Seleccionar todos
              </button>

              <button
                className="flex-1 border border-slate-600 text-slate-300 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-slate-700 transition-all"
                onClick={() => setFiltrosActivos([])}
              >
                Limpiar
              </button>

            </div>

            <div className="grid grid-cols-3 gap-y-6 gap-x-3">

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
                      src={`/fotos_mapa/servicios/${img}`}
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

                    {ETIQUETAS_SERVICIOS[img] || "Servicio"}

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