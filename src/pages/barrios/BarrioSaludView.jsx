import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
} from "chart.js";
import { Users, Activity, MapPin, HeartPulse, ShieldAlert } from "lucide-react";

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement
);

export default function BarrioSaludView() {
  const { barrio } = useOutletContext();
  const [sexoActivo, setSexoActivo] = useState("Ambos sexos");
  const [anioActivo, setAnioActivo] = useState("2025");

  // Opciones
  const opcionesSexo = ["Ambos sexos", "Hombres", "Mujeres"];
  const opcionesAnio = ["2022", "2023", "2024", "2025"];

  // Obtener datos de población para el año activo
  const popData = barrio.poblacionPorRango?.[anioActivo] || barrio.poblacionPorRango?.["2025"] || {};
  
  const key015 = popData["0-15"] ? "0-15" : "0~15";
  const key1664 = popData["16-64"] ? "16-64" : "16~64";
  const key64 = ">64";
  
  const getVal = (rangeData) => {
    if (!rangeData) return 0;
    if (sexoActivo === "Hombres") return rangeData.hombres || 0;
    if (sexoActivo === "Mujeres") return rangeData.mujeres || 0;
    return rangeData.total || 0;
  };
  
  const p0_15 = getVal(popData[key015]);
  const p16_64 = getVal(popData[key1664]);
  const p64 = getVal(popData[key64]);
  const poblacionTotal = p0_15 + p16_64 + p64;

  const totalHombres = (popData[key015]?.hombres || 0) + (popData[key1664]?.hombres || 0) + (popData[key64]?.hombres || 0);
  const totalMujeres = (popData[key015]?.mujeres || 0) + (popData[key1664]?.mujeres || 0) + (popData[key64]?.mujeres || 0);
  const densidad = barrio.superficie ? Math.round(poblacionTotal / barrio.superficie) : 0;
  
  const indiceEnvejecimiento = p0_15 > 0 ? ((p64 / p0_15) * 100).toFixed(1) : 0;
  const tasaDependencia = p16_64 > 0 ? (((p0_15 + p64) / p16_64) * 100).toFixed(1) : 0;

  // Gráfico: Edades (Doughnut)
  const dataEdad = {
    labels: ['0-15 años', '16-64 años', 'más de 64 años'],
    datasets: [{
      data: [p0_15, p16_64, p64],
      backgroundColor: ['#3b82f6', '#8b5cf6', '#f43f5e'],
      borderWidth: 2, borderColor: '#ffffff', hoverOffset: 4
    }]
  };
  const optionsEdad = {
    responsive: true, maintainAspectRatio: false, cutout: '65%',
    plugins: { legend: { position: 'bottom' } }
  };

  // Gráfico: Sexo (Doughnut)
  const dataSexo = {
    labels: ['Hombres', 'Mujeres'],
    datasets: [{
      data: [totalHombres, totalMujeres],
      backgroundColor: ['#3b82f6', '#ec4899'],
      borderWidth: 2, borderColor: '#ffffff', hoverOffset: 4
    }]
  };
  const optionsSexo = {
    responsive: true, maintainAspectRatio: false, cutout: '65%',
    plugins: { legend: { position: 'bottom' } }
  };

  // Gráfico Edad Media (Línea)
  const añosMedia = ["2023", "2024", "2025"];
  const datosMedia = añosMedia.map(a => barrio.edad_media?.[a] || 0);
  
  const minMedia = Math.floor(Math.min(...datosMedia.filter(v => v > 0)) - 0.5) || 40;
  const maxMedia = Math.ceil(Math.max(...datosMedia.filter(v => v > 0)) + 0.5) || 50;

  const dataMediaEdad = {
    labels: añosMedia,
    datasets: [{
      label: 'Media de Edad',
      data: datosMedia,
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#8b5cf6',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
    }]
  };
  const optionsMedia = {
    responsive: true, maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: { callbacks: { label: (context) => `${context.raw} años` } }
    },
    scales: { 
      y: { min: minMedia, max: maxMedia, grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }, 
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } } 
    }
  };

  // Gráfico: Evolución Histórica de Población (Línea)
  const datosHistorico = useMemo(() => {
    if (!barrio.poblacionPorRango) return { labels: [], data: [] };
    const años = Object.keys(barrio.poblacionPorRango).sort();
    const data = años.map(a => {
      const pd = barrio.poblacionPorRango[a];
      const k1 = pd["0-15"] ? "0-15" : "0~15";
      const k2 = pd["16-64"] ? "16-64" : "16~64";
      const k3 = ">64";
      const val0_15 = getVal(pd[k1]);
      const val16_64 = getVal(pd[k2]);
      const val64 = getVal(pd[k3]);
      return val0_15 + val16_64 + val64;
    });
    return { labels: años, data };
  }, [barrio, sexoActivo]);

  const dataHistPoblacion = {
    labels: datosHistorico.labels,
    datasets: [
      { 
        label: 'Población', 
        data: datosHistorico.data, 
        borderColor: '#10b981', 
        backgroundColor: 'rgba(16, 185, 129, 0.1)', 
        fill: true,
        tension: 0.3
      }
    ]
  };

  const optionsHistPoblacion = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { 
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } }, 
      y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } } 
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-2">
      
      {/* Barra de Filtros en la parte Superior */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row gap-6 items-stretch md:items-center justify-between">
        
        {/* Filtro: Sexo */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 sm:mb-0 mb-1">
            Segmentación por Sexo
          </label>
          <div className="flex rounded-lg overflow-hidden border border-slate-700 p-1 bg-slate-900/50 flex-1 max-w-md">
            {opcionesSexo.map(opcion => (
              <button
                key={opcion}
                onClick={() => setSexoActivo(opcion)}
                className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-colors cursor-pointer ${
                  sexoActivo === opcion 
                    ? "bg-slate-700 text-emerald-400 shadow-sm border border-slate-600 font-bold" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {opcion}
              </button>
            ))}
          </div>
        </div>

        {/* Filtro: Año */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Año de Análisis
          </label>
          <select 
            value={anioActivo}
            onChange={(e) => setAnioActivo(e.target.value)}
            className="flex-1 md:flex-initial p-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white font-medium outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition cursor-pointer text-sm"
          >
            {opcionesAnio.map(anio => <option key={anio} value={anio}>{anio}</option>)}
          </select>
        </div>

      </div>

      {/* Grid Principal de Datos */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        
        {/* Columna Izquierda (Gráficos) */}
        <div className="flex flex-col gap-6">
          
          {/* Evolución Histórica de Población */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white text-sm uppercase tracking-wide">Evolución Histórica de la Población</h3>
            </div>
            <div className="h-[250px]"><Line data={dataHistPoblacion} options={optionsHistPoblacion} /></div>
          </div>

          {/* Gráficos Principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[340px]">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-5 flex flex-col h-[320px] md:h-auto">
              <h3 className="font-bold text-white mb-4 uppercase text-sm tracking-wide text-center">Distribución por Sexo</h3>
              <div className="flex-1 min-h-0"><Doughnut data={dataSexo} options={optionsSexo} /></div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-5 flex flex-col h-[320px] md:h-auto">
              <h3 className="font-bold text-white mb-4 uppercase text-sm tracking-wide text-center">Distribución por Edades</h3>
              <div className="flex-1 min-h-0"><Doughnut data={dataEdad} options={optionsEdad} /></div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-5 flex flex-col h-[320px] md:h-auto">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2 uppercase text-sm tracking-wide">
                <Activity size={18} className="text-emerald-400" />
                Evolución de la Edad Media
              </h3>
              <div className="flex-1 min-h-0"><Line data={dataMediaEdad} options={optionsMedia} /></div>
            </div>
          </div>
        </div>

        {/* Columna Derecha (Resumen Demográfico) */}
        <div className="flex flex-col gap-6">
          
          {/* Población Total (KPI Card) */}
          <div className="bg-emerald-600 text-white rounded-2xl shadow-xl p-6 relative overflow-hidden hover:shadow-2xl transition">
            <div className="relative z-10">
              <h3 className="text-emerald-100 text-sm font-bold uppercase tracking-wider mb-2">Población Total ({anioActivo})</h3>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-extrabold">{poblacionTotal.toLocaleString("es-ES")}</span>
                <span className="text-emerald-200 mb-1 font-medium">hab.</span>
              </div>
            </div>
            <Users size={120} className="absolute right-[-20px] bottom-[-20px] text-emerald-500 opacity-50" />
          </div>

          {/* Densidad (KPI Card) */}
          {barrio.superficie && (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-6 relative overflow-hidden hover:shadow-2xl transition">
              <div className="relative z-10">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Densidad de Población</h3>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-white">{densidad.toLocaleString("es-ES")}</span>
                  <span className="text-slate-400 mb-1 font-medium">hab/km²</span>
                </div>
              </div>
              <MapPin size={80} className="absolute right-[-10px] bottom-[-10px] text-slate-700 opacity-50" />
            </div>
          )}

          {/* Envejecimiento y Dependencia */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-5 flex flex-col relative hover:shadow-2xl transition">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Índice de Envejecimiento</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white">{indiceEnvejecimiento}</span>
                <span className="text-sm text-slate-400 mb-1">%</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Población {">"}64 respecto a 0-15 años</p>
              <HeartPulse size={40} className="absolute right-4 top-4 text-rose-500/20" strokeWidth={1.5} />
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-5 flex flex-col relative hover:shadow-2xl transition">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tasa de Dependencia</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white">{tasaDependencia}</span>
                <span className="text-sm text-slate-400 mb-1">%</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Población inactiva vs activa</p>
              <ShieldAlert size={40} className="absolute right-4 top-4 text-amber-500/20" strokeWidth={1.5} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
