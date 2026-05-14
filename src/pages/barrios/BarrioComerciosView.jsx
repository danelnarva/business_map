import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { TrendingUp, Building2, Car, Home } from "lucide-react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler
);

const METRICAS = [
  { id: "renta", nombre: "Renta Media (€)", icon: TrendingUp },
  { id: "vehiculos", nombre: "Parque de Vehículos", icon: Car },
  { id: "viviendas", nombre: "Parque de Viviendas", icon: Home },
  { id: "valor_catastral", nombre: "Valor Catastral (€)", icon: Building2 },
];

export default function BarrioComerciosView() {
  const { barrio } = useOutletContext();
  const [metricaActiva, setMetricaActiva] = useState("renta");

  const datosMetrica = useMemo(() => {
    let dataObj = {};
    if (metricaActiva === "renta") dataObj = barrio.renta?.familiar || {};
    else if (metricaActiva === "vehiculos") dataObj = barrio.vehiculos || {};
    else if (metricaActiva === "viviendas") dataObj = barrio.vivienda?.cantidad || {};
    else if (metricaActiva === "valor_catastral") dataObj = barrio.vivienda?.valor_catastral || {};

    return Object.entries(dataObj)
      .filter(([_, valor]) => typeof valor === "number" && !isNaN(valor))
      .map(([anio, valor]) => ({
        anio: parseInt(anio),
        valor: Math.round(valor)
      }))
      .sort((a, b) => b.anio - a.anio);
  }, [metricaActiva, barrio]);

  const chartDataArray = [...datosMetrica].reverse();

  const chartData = {
    labels: chartDataArray.map(d => d.anio),
    datasets: [
      {
        label: METRICAS.find(m => m.id === metricaActiva)?.nombre,
        data: chartDataArray.map(d => d.valor),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
    }
  };

  // Funciones auxiliares para calcular población total de un año
  const getPoblacion = (anio) => {
    const popData = barrio.poblacionPorRango?.[anio];
    if (!popData) return null;
    const k1 = popData["0-15"] ? "0-15" : "0~15";
    const k2 = popData["16-64"] ? "16-64" : "16~64";
    const k3 = ">64";
    const v1 = popData[k1]?.total || 0;
    const v2 = popData[k2]?.total || 0;
    const v3 = popData[k3]?.total || 0;
    return v1 + v2 + v3;
  };

  // Renderizar Panel Derecho Dinámico
  const renderPanelDerecho = () => {
    if (metricaActiva === "renta") {
      const anios = Object.keys(barrio.renta?.familiar || {}).sort((a, b) => b - a);
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl flex flex-col overflow-hidden max-h-[650px]">
          <div className="bg-slate-700/50 p-4 border-b border-slate-700">
            <h3 className="font-bold text-white">Renta Familiar vs Personal</h3>
            <p className="text-xs text-slate-400 mt-1">Brecha de ingresos a lo largo del tiempo</p>
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            <table className="w-full text-sm text-center">
              <thead className="sticky top-0 bg-slate-800 shadow-sm z-10">
                <tr>
                  <th className="py-3 px-2 font-semibold text-slate-400 text-xs uppercase tracking-wider text-left">Año</th>
                  <th className="py-3 px-2 font-semibold text-slate-400 text-xs uppercase tracking-wider text-right">Familiar (€)</th>
                  <th className="py-3 px-2 font-semibold text-slate-400 text-xs uppercase tracking-wider text-right">Personal (€)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {anios.map(anio => {
                  const fam = barrio.renta?.familiar?.[anio];
                  const per = barrio.renta?.personal?.[anio];
                  return (
                    <tr key={anio} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-2 font-medium text-slate-300 text-left">{anio}</td>
                      <td className="py-3 px-2 text-right font-medium text-emerald-400">{fam ? fam.toLocaleString("es-ES") : "-"}</td>
                      <td className="py-3 px-2 text-right font-medium text-teal-400">{per ? per.toLocaleString("es-ES") : "-"}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (metricaActiva === "vehiculos") {
      const anios = Object.keys(barrio.vehiculos || {}).sort((a, b) => b - a);
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl flex flex-col overflow-hidden max-h-[650px]">
          <div className="bg-slate-700/50 p-4 border-b border-slate-700">
            <h3 className="font-bold text-white">Motorización del Barrio</h3>
            <p className="text-xs text-slate-400 mt-1">Vehículos por cada 100 habitantes</p>
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            <table className="w-full text-sm text-center">
              <thead className="sticky top-0 bg-slate-800 shadow-sm z-10">
                <tr>
                  <th className="py-3 px-2 font-semibold text-slate-400 text-xs uppercase tracking-wider text-left">Año</th>
                  <th className="py-3 px-2 font-semibold text-slate-400 text-xs uppercase tracking-wider text-right">Vehículos</th>
                  <th className="py-3 px-2 font-semibold text-slate-400 text-xs uppercase tracking-wider text-right">Tasa (cada 100 hab.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {anios.map(anio => {
                  const vehs = barrio.vehiculos?.[anio];
                  const pop = getPoblacion(anio);
                  const tasa = vehs && pop ? ((vehs / pop) * 100).toFixed(1) : "-";
                  return (
                    <tr key={anio} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-2 font-medium text-slate-300 text-left">{anio}</td>
                      <td className="py-3 px-2 text-right font-medium text-slate-300">{vehs ? vehs.toLocaleString("es-ES") : "-"}</td>
                      <td className="py-3 px-2 text-right font-bold text-amber-500">{tasa}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (metricaActiva === "viviendas" || metricaActiva === "valor_catastral") {
      const anios = Object.keys(barrio.vivienda?.cantidad || {}).sort((a, b) => b - a);
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl flex flex-col overflow-hidden max-h-[650px]">
          <div className="bg-slate-700/50 p-4 border-b border-slate-700">
            <h3 className="font-bold text-white">Características Inmobiliarias</h3>
            <p className="text-xs text-slate-400 mt-1">Cantidad, Superficie Media y Valor</p>
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            <table className="w-full text-sm text-center">
              <thead className="sticky top-0 bg-slate-800 shadow-sm z-10">
                <tr>
                  <th className="py-3 px-2 font-semibold text-slate-400 text-xs uppercase tracking-wider text-left">Año</th>
                  <th className="py-3 px-2 font-semibold text-slate-400 text-xs uppercase tracking-wider text-right">Viviendas</th>
                  <th className="py-3 px-2 font-semibold text-slate-400 text-xs uppercase tracking-wider text-right">Sup. Media (m²)</th>
                  <th className="py-3 px-2 font-semibold text-slate-400 text-xs uppercase tracking-wider text-right">Valor Medio (€)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {anios.map(anio => {
                  const cant = barrio.vivienda?.cantidad?.[anio];
                  const sup = barrio.vivienda?.superficie?.[anio];
                  const val = barrio.vivienda?.valor_catastral?.[anio];
                  return (
                    <tr key={anio} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-2 font-medium text-slate-300 text-left">{anio}</td>
                      <td className="py-3 px-2 text-right font-medium text-slate-300">{cant ? cant.toLocaleString("es-ES") : "-"}</td>
                      <td className="py-3 px-2 text-right font-medium text-emerald-400">{sup ? sup.toLocaleString("es-ES") : "-"}</td>
                      <td className="py-3 px-2 text-right font-medium text-purple-400">{val ? val.toLocaleString("es-ES") : "-"}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_450px] gap-6 mt-2">
      
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
          
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Indicadores Económicos</h2>
            <div className="flex flex-col gap-2">
              {METRICAS.map((metrica) => {
                const isActivo = metrica.id === metricaActiva;
                const Icon = metrica.icon;
                return (
                  <button
                    key={metrica.id}
                    onClick={() => setMetricaActiva(metrica.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                      isActivo 
                        ? "bg-emerald-600 border-emerald-500 text-white shadow-lg" 
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:border-emerald-500/50 hover:bg-slate-700"
                    }`}
                  >
                    <Icon size={20} className={isActivo ? "text-emerald-200" : "text-slate-400"} />
                    <span className="text-sm font-medium leading-tight">{metrica.nombre}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <div className="bg-slate-700/50 p-4 border-b border-slate-700">
              <h3 className="font-bold text-white">Evolución Detallada</h3>
              <p className="text-xs text-slate-400 mt-1">Según el indicador seleccionado</p>
            </div>
            <div className="p-4 flex-1 overflow-y-auto max-h-[350px]">
              <div className="grid grid-cols-[60px_1fr] border-b border-slate-700 mb-2 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span>Año</span>
                <span className="text-right">Valor</span>
              </div>
              {datosMetrica.map((item) => (
                <div key={item.anio} className="grid grid-cols-[60px_1fr] items-center mb-2 group">
                  <span className="text-sm text-slate-300 font-medium">{item.anio}</span>
                  <div className="w-full bg-slate-700 h-6 relative rounded-md overflow-hidden flex items-center">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-500 group-hover:bg-emerald-400" 
                      style={{ width: `${(item.valor / Math.max(...datosMetrica.map(d=>d.valor))) * 100}%` }}
                    />
                    <span className="absolute right-3 text-xs font-bold text-white shadow-sm">{item.valor.toLocaleString("es-ES")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl h-[250px] flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-white">Trayectoria Histórica</h3>
             <span className="text-xs font-medium px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
               {METRICAS.find(m => m.id === metricaActiva)?.nombre}
             </span>
          </div>
          <div className="flex-1 min-h-0">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Dynamic Right Panel */}
      {renderPanelDerecho()}
      
    </div>
  );
}
