import { useEffect, useState } from "react";
import { useParams, Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";

export default function BarrioDashboardPage() {
  const { barrioId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [datosContexto, setDatosContexto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        setCargando(true);
        const geojsonRes = await fetch("/data/barrios_con_datos.geojson");

        if (!geojsonRes.ok) {
          throw new Error("No se pudieron cargar los datos.");
        }

        const barriosData = await geojsonRes.json();
        const idNumerico = parseInt(barrioId, 10);
        const barrioFeature = barriosData.features.find((f) => f.properties.BARRIO === idNumerico);

        if (!barrioFeature) {
          throw new Error("Barrio no encontrado");
        }

        const barrioInfo = { ...barrioFeature.properties, nombre: barrioFeature.properties.TEXTO };

        setDatosContexto({
          barrio: barrioInfo,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, [barrioId]);

  if (cargando) return <div className="p-8 text-center text-xl font-semibold">Cargando datos del barrio...</div>;
  if (error) return <div className="p-8 text-center text-xl text-red-600">Error: {error}</div>;

  const path = location.pathname;
  let titulo = "Idoneidad del Barrio";
  let showRightButton = null;

  if (path.endsWith("economia")) {
    titulo = "Economía y Patrimonio";
    showRightButton = (
      <button 
        onClick={() => navigate(`/barrios/${barrioId}/demografia`)}
        className="bg-emerald-600 text-white font-medium py-2 px-5 rounded-xl shadow-lg hover:bg-emerald-500 transition text-sm"
      >
        Ir a Demografía
      </button>
    );
  } else if (path.endsWith("demografia")) {
    titulo = "Demografía del Barrio";
    showRightButton = (
      <button 
        onClick={() => navigate(`/barrios/${barrioId}/economia`)}
        className="bg-emerald-600 text-white font-medium py-2 px-5 rounded-xl shadow-lg hover:bg-emerald-500 transition text-sm"
      >
        Ir a Economía
      </button>
    );
  }

  const barrioObj = datosContexto.barrio;

  return (
    <div className="min-h-screen bg-slate-900 pt-10 pb-12 font-sans">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Título Principal */}
        <Link to="/" className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity w-fit">
          <img src="/logo_vg.png" alt="V-G Business Map Logo" className="w-9 h-9 object-contain" />
          <h1 className="text-3xl font-bold text-white tracking-tight">
            V-G Business Map
          </h1>
        </Link>

        {/* Navegación */}
        <div className="mb-6">
          <Link to="/Barrios" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition font-medium">
            <ArrowLeft size={18} />
            Volver a Barrios
          </Link>
        </div>

        {/* Encabezado del Dashboard */}
        <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-slate-700/50 p-4 rounded-xl text-emerald-400">
                <MapPin size={32} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{titulo}</h1>
                <p className="text-slate-400 text-lg flex items-center gap-2">
                  <span className="font-semibold text-white">{barrioObj.nombre}</span>
                </p>
              </div>
            </div>
            {/* Controles extra / Botón superior derecho */}
            <div className="flex items-center gap-4 self-start md:self-auto">
              {showRightButton}
            </div>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL (Renderizado por las rutas hijas) */}
        <Outlet context={{ barrio: barrioObj }} />

      </div>
    </div>
  );
}
