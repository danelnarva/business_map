import { useState } from "react";
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
import { Users, Euro, Activity, TrendingUp, TrendingDown } from "lucide-react";

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement
);

function StatBox({ label, value, type = "neutral" }) {
  const colors = {
    positive: "bg-emerald-50 text-emerald-700 border-emerald-100",
    negative: "bg-rose-50 text-rose-700 border-rose-100",
    neutral: "bg-slate-50 text-slate-700 border-slate-200"
  };

  return (
    <div className={`${colors[type]} border rounded-xl p-4 flex flex-col justify-center shadow-sm relative overflow-hidden transition-all hover:shadow-md`}>
      <span className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">{label}</span>
      <span className="text-3xl font-bold">{value}</span>
      {type === "positive" && <TrendingUp className="absolute right-[-10px] bottom-[-10px] opacity-10 text-emerald-900" size={80} />}
      {type === "negative" && <TrendingDown className="absolute right-[-10px] bottom-[-10px] opacity-10 text-rose-900" size={80} />}
    </div>
  );
}

export default function BarrioSaludView() {
  const { barrio } = useOutletContext();
  const [sexoActivo, setSexoActivo] = useState("Ambos sexos");
  const [anioActivo, setAnioActivo] = useState("2022");

  const multiplicadorSexo = sexoActivo === "Ambos sexos" ? 1 : (sexoActivo === "Mujeres" ? 0.52 : 0.48);
  const variacionAnio = (parseInt(anioActivo) - 2020) * 0.02; 
  
  const baseNacimientos = barrio.nacimientos || 90;
  const baseDefunciones = barrio.defunciones || 158;

  const nacimientos = Math.round(baseNacimientos * multiplicadorSexo * (1 - variacionAnio));
  const defunciones = Math.round(baseDefunciones * multiplicadorSexo * (1 + variacionAnio));
  const inmigracion = Math.round(521 * multiplicadorSexo * (1 + variacionAnio));
  const emigracion = Math.round(287 * multiplicadorSexo * (1 - variacionAnio));

  const basePoblacion = barrio.poblacion || 12300;
  const poblacionTotal = Math.round(basePoblacion * multiplicadorSexo * (1 + variacionAnio));
  
  const baseRenta = barrio.renta || 32297;
  const rentaCalculada = Math.round(baseRenta * (1 + variacionAnio));

  // Gráfico: Crecimiento Natural (Barras Horizontales)
  const dataCrecimiento = {
    labels: ['Crecimiento Natural'],
    datasets: [
      { label: 'Nacimientos', data: [nacimientos], backgroundColor: '#10b981', borderRadius: 4 },
      { label: 'Defunciones', data: [defunciones], backgroundColor: '#ef4444', borderRadius: 4 }
    ]
  };
  const optionsBarrasComparativas = {
    indexAxis: 'y', responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: { x: { grid: { color: '#f1f5f9' } }, y: { display: false } }
  };

  // Gráfico: Saldo Migratorio (Barras Horizontales)
  const dataMigratorio = {
    labels: ['Saldo Migratorio'],
    datasets: [
      { label: 'Inmigración', data: [inmigracion], backgroundColor: '#3b82f6', borderRadius: 4 },
      { label: 'Emigración', data: [emigracion], backgroundColor: '#f59e0b', borderRadius: 4 }
    ]
  };

  // Gráfico: Edades (Doughnut)
  const dataEdad = {
    labels: ['0-15 años', '16-64 años', 'más de 64 años'],
    datasets: [{
      data: [
        11.6 + (sexoActivo === "Mujeres" ? -1 : 1), 
        55.9, 
        32.4 + (sexoActivo === "Mujeres" ? 2 : -1)
      ].map(v => Number((v * (1 + variacionAnio)).toFixed(1))),
      backgroundColor: ['#3b82f6', '#8b5cf6', '#f43f5e'],
      borderWidth: 2, borderColor: '#ffffff', hoverOffset: 4
    }]
  };
  const optionsEdad = {
    responsive: true, maintainAspectRatio: false, cutout: '65%',
    plugins: { legend: { position: 'right' } }
  };

  // Gráfico Edad Media (Barras)
  const dataMediaEdad = {
    labels: ['2020', '2021', '2022', '2023'],
    datasets: [{
      label: 'Media de Edad',
      data: [45.1, 45.4, 45.8, 46.2].map(v => Number((v + (sexoActivo === "Mujeres" ? 1.5 : (sexoActivo === "Hombres" ? -1.5 : 0))).toFixed(1))),
      backgroundColor: '#8b5cf6',
      borderRadius: 6,
      barThickness: 24
    }]
  };
  const optionsMedia = {
    responsive: true, maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw} años`
        }
      }
    },
    scales: { 
      y: { min: 40, max: 50, grid: { color: '#f1f5f9' } }, 
      x: { grid: { display: false } } 
    }
  };

  const opcionesSexo = ["Ambos sexos", "Hombres", "Mujeres"];
  const opcionesAnio = ["2020", "2021", "2022", "2023"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 mt-2">
      
      {/* Columna Izquierda */}
      <div className="flex flex-col gap-6">
        
        {/* Balances */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Crecimiento Natural</h3>
              <span className={`text-sm font-bold px-2 py-1 rounded-lg ${nacimientos - defunciones >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                Balance: {nacimientos - defunciones > 0 ? '+' : ''}{nacimientos - defunciones}
              </span>
            </div>
            <div className="h-[120px]"><Bar data={dataCrecimiento} options={optionsBarrasComparativas} /></div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Saldo Migratorio</h3>
              <span className={`text-sm font-bold px-2 py-1 rounded-lg ${inmigracion - emigracion >= 0 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                Balance: {inmigracion - emigracion > 0 ? '+' : ''}{inmigracion - emigracion}
              </span>
            </div>
            <div className="h-[120px]"><Bar data={dataMigratorio} options={optionsBarrasComparativas} /></div>
          </div>
        </div>

        {/* Gráficos Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[300px]">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col">
            <h3 className="font-bold text-slate-800 mb-4 uppercase text-sm tracking-wide">Distribución por Edades</h3>
            <div className="flex-1 min-h-0"><Doughnut data={dataEdad} options={optionsEdad} /></div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase text-sm tracking-wide">
              <Activity size={18} className="text-purple-500" />
              Evolución de la Edad Media
            </h3>
            <div className="flex-1 min-h-0"><Bar data={dataMediaEdad} options={optionsMedia} /></div>
          </div>
        </div>
      </div>

      {/* Columna Derecha (Filtros y Resumen) */}
      <div className="flex flex-col gap-6">
        
        {/* Filtros Interactivos */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-5">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Segmentación por Sexo</label>
            <div className="flex rounded-lg overflow-hidden border border-slate-200 p-1 bg-slate-50">
              {opcionesSexo.map(opcion => (
                <button
                  key={opcion}
                  onClick={() => setSexoActivo(opcion)}
                  className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                    sexoActivo === opcion 
                      ? "bg-white text-blue-600 shadow-sm border border-slate-200" 
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Periodo de Análisis</label>
            <select 
              value={anioActivo}
              onChange={(e) => setAnioActivo(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
            >
              {opcionesAnio.map(anio => <option key={anio} value={anio}>{anio}</option>)}
            </select>
          </div>
        </div>

        {/* Población Total (KPI Card) */}
        <div className="bg-blue-600 text-white rounded-2xl shadow-md p-6 relative overflow-hidden hover:shadow-lg transition">
          <div className="relative z-10">
            <h3 className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-2">Población Total del Barrio</h3>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-extrabold">{poblacionTotal.toLocaleString("es-ES")}</span>
              <span className="text-blue-200 mb-1 font-medium">habitantes</span>
            </div>
          </div>
          <Users size={120} className="absolute right-[-20px] bottom-[-20px] text-blue-500 opacity-50" />
        </div>

        {/* Renta y Procedencia */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col relative hover:shadow-md transition">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Renta Familiar Estimada</span>
            <span className="text-3xl font-bold text-slate-800">{rentaCalculada.toLocaleString("es-ES")} <span className="text-lg text-slate-500">€</span></span>
            <Euro size={40} className="absolute right-4 bottom-4 text-emerald-100" strokeWidth={1.5} />
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col relative hover:shadow-md transition">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Principal Origen (Extranjero)</span>
            <span className="text-xl font-bold text-blue-600 mb-1">América del Sur</span>
            <span className="text-sm font-medium text-slate-500">{Math.round(624 * multiplicadorSexo)} residentes</span>
          </div>
        </div>

      </div>
    </div>
  );
}
