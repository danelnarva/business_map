import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, Building2, Wrench, ShoppingBag } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

const SECTORES = [
  { id: "agricultura", nombre: "Agricultura, ganadería y pesca", icon: TrendingUp },
  { id: "construccion", nombre: "Construcción", icon: Wrench },
  { id: "comercio", nombre: "Comercio, hostelería y transporte", icon: ShoppingBag },
  { id: "servicios", nombre: "Otras actividades de servicios", icon: Building2 },
];

export default function BarrioComerciosView() {
  const { barrio } = useOutletContext();
  const [sectorActivo, setSectorActivo] = useState("comercio");

  // Generar datos dinámicos simulados basados en el sector y el barrio
  // Esto simula que cambian al cambiar de pestaña
  const datosBarras = useMemo(() => {
    let base = 50;
    if (sectorActivo === "comercio") base = 220;
    if (sectorActivo === "construccion") base = 30;
    if (sectorActivo === "servicios") base = 120;
    
    // Seed variation with barrio ID to make it look different per barrio
    const seed = barrio.BARRIO || 1;

    return Array.from({ length: 14 }, (_, i) => ({
      anio: 2006 + i,
      valor: Math.floor(base + Math.sin(i + seed) * (base * 0.2) + (i * 2))
    })).reverse();
  }, [sectorActivo, barrio]);

  const datosTablaSaldo = useMemo(() => {
    return Array.from({ length: 17 }, (_, i) => {
      const anio = 2006 + i;
      return {
        anio,
        cons: Math.floor(Math.random() * 10) - 4,
        ind: Math.random() > 0.3 ? Math.floor(Math.random() * 5) - 2 : null,
        serv: Math.floor(Math.random() * 16) - 6,
      };
    }).reverse();
  }, [barrio]);

  const IconoSaldo = ({ valor }) => {
    if (valor === null) return null;
    if (valor > 0) return <CheckCircle2 className="text-emerald-500 inline ml-1" size={16} />;
    if (valor < -3) return <XCircle className="text-red-500 inline ml-1" size={16} />;
    return <AlertCircle className="text-amber-500 inline ml-1" size={16} />;
  };

  const chartData = {
    labels: [...datosBarras].reverse().filter((_, i) => i % 2 === 0).map(d => d.anio),
    datasets: [
      {
        label: SECTORES.find(s => s.id === sectorActivo)?.nombre,
        data: [...datosBarras].reverse().filter((_, i) => i % 2 === 0).map(d => d.valor),
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
      y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 mt-2">
      
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
          
          {/* Categorías */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Actividad de Establecimiento</h2>
            <div className="flex flex-col gap-2">
              {SECTORES.map((sector) => {
                const isActivo = sector.id === sectorActivo;
                const Icon = sector.icon;
                return (
                  <button
                    key={sector.id}
                    onClick={() => setSectorActivo(sector.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                      isActivo 
                        ? "bg-blue-600 border-blue-600 text-white shadow-md" 
                        : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={20} className={isActivo ? "text-blue-200" : "text-slate-400"} />
                    <span className="text-sm font-medium leading-tight">{sector.nombre}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Barras Horizontales */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">Número de Establecimientos</h3>
              <p className="text-xs text-slate-500 mt-1">Según actividad seleccionada</p>
            </div>
            <div className="p-4 flex-1 overflow-y-auto max-h-[350px]">
              <div className="grid grid-cols-[60px_1fr] border-b border-slate-100 mb-2 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Año</span>
                <span className="text-right">Establecimientos</span>
              </div>
              {datosBarras.map((item) => (
                <div key={item.anio} className="grid grid-cols-[60px_1fr] items-center mb-2 group">
                  <span className="text-sm text-slate-600 font-medium">{item.anio}</span>
                  <div className="w-full bg-slate-100 h-6 relative rounded-md overflow-hidden flex items-center">
                    <div 
                      className="bg-blue-200 h-full transition-all duration-500 group-hover:bg-blue-300" 
                      style={{ width: `${(item.valor / Math.max(...datosBarras.map(d=>d.valor))) * 100}%` }}
                    />
                    <span className="absolute right-3 text-xs font-bold text-slate-700">{item.valor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gráfico de línea */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm h-[250px] flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-slate-800">Evolución Histórica</h3>
             <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
               {SECTORES.find(s => s.id === sectorActivo)?.nombre}
             </span>
          </div>
          <div className="flex-1 min-h-0">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Tabla Derecha (Saldo por sector) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden max-h-[650px]">
        <div className="bg-slate-50 p-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-800">Saldo por Sector</h3>
          <p className="text-xs text-slate-500 mt-1">Diferencia anual de establecimientos</p>
        </div>
        <div className="overflow-y-auto flex-1 p-2">
          <table className="w-full text-sm text-center">
            <thead className="sticky top-0 bg-white shadow-sm z-10">
              <tr>
                <th className="py-3 px-2 font-semibold text-slate-500 text-xs uppercase tracking-wider w-16">Año</th>
                <th className="py-3 px-2 font-semibold text-slate-500 text-xs uppercase tracking-wider">Construcción</th>
                <th className="py-3 px-2 font-semibold text-slate-500 text-xs uppercase tracking-wider">Industria</th>
                <th className="py-3 px-2 font-semibold text-slate-500 text-xs uppercase tracking-wider">Servicios</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {datosTablaSaldo.map((row) => (
                <tr key={row.anio} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-2 font-medium text-slate-700">{row.anio}</td>
                  <td className="py-3 px-2 text-right">
                    <span className="font-medium text-slate-700">{row.cons}</span> <IconoSaldo valor={row.cons} />
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="font-medium text-slate-700">{row.ind !== null ? row.ind : "-"}</span> <IconoSaldo valor={row.ind} />
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="font-medium text-slate-700">{row.serv}</span> <IconoSaldo valor={row.serv} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
