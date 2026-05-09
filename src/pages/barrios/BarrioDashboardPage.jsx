import { useEffect, useState } from "react";
import { useParams, Outlet, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
        const [geojsonRes, indicadoresRes, historicoRes] = await Promise.all([
          fetch("/data/barrios.geojson"),
          fetch("/data/indicadores.json"),
          fetch("/data/historico.json"),
        ]);

        if (!geojsonRes.ok || !indicadoresRes.ok || !historicoRes.ok) {
          throw new Error("No se pudieron cargar los datos.");
        }

        const barriosData = await geojsonRes.json();
        const indicadoresData = await indicadoresRes.json();
        const historicoData = await historicoRes.json();

        const idNumerico = parseInt(barrioId, 10);
        const barrioInfo = indicadoresData.find((b) => b.BARRIO === idNumerico);

        if (!barrioInfo) {
          throw new Error("Barrio no encontrado");
        }

        setDatosContexto({
          barrio: barrioInfo,
          barriosData,
          indicadoresData,
          historicoData,
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

  if (path.endsWith("comercios")) {
    titulo = "Establecimientos por Sectores y Economía";
    showRightButton = (
      <button 
        onClick={() => navigate(`/barrios/${barrioId}/salud`)}
        className="bg-blue-600 text-white font-medium py-1.5 px-4 rounded-lg shadow-sm hover:bg-blue-700 transition text-sm"
      >
        Ir a Salud
      </button>
    );
  } else if (path.endsWith("salud")) {
    titulo = "Salud Demográfica del Barrio";
    showRightButton = (
      <button 
        onClick={() => navigate(`/barrios/${barrioId}/comercios`)}
        className="bg-blue-600 text-white font-medium py-1.5 px-4 rounded-lg shadow-sm hover:bg-blue-700 transition text-sm"
      >
        Ir a Comercios
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-white py-4 px-6 flex items-center justify-between shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <button 
          onClick={() => navigate("/Barrios")}
          className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition flex items-center justify-center p-2 rounded-full"
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-xl font-semibold text-slate-800 text-center flex-1">
          {titulo} - {datosContexto.barrio.nombre}
        </h1>

        <div className="w-[120px] flex justify-end">
           {showRightButton}
        </div>
      </header>

      <main className="p-6 max-w-[1400px] mx-auto">
        <Outlet context={datosContexto} />
      </main>
    </div>
  );
}
