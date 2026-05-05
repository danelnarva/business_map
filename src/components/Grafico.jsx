import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

export default function Grafico({ barrio, indicadorActivo, indicadoresData, labelIndicador }) {
  if (!barrio) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] text-slate-400 text-sm text-center px-4">
        <p>🗺️ Haz clic en un barrio del mapa para ver sus datos.</p>
      </div>
    );
  }

  function calcularMediaCiudad() {
    if (indicadoresData.length === 0) return 0;

    if (indicadorActivo === "renta" || indicadorActivo === "edad_media") {
      const totalPoblacion = indicadoresData.reduce(
        (sum, b) => sum + (b.poblacion ?? 0),
        0
      );

      return (
        indicadoresData.reduce(
          (sum, b) => sum + (b[indicadorActivo] ?? 0) * (b.poblacion ?? 0),
          0
        ) / totalPoblacion
      );
    }

    return (
      indicadoresData.reduce((sum, b) => sum + (b[indicadorActivo] ?? 0), 0) /
      indicadoresData.length
    );
  }

  const media = calcularMediaCiudad();

  const valorBarrio = barrio[indicadorActivo] ?? 0;

  const data = {
    labels: [barrio.nombre, "Media ciudad"],
    datasets: [
      {
        label: labelIndicador || indicadorActivo,
        data: [valorBarrio, Math.round(media)],
        backgroundColor: ["#2563eb", "#94a3b8"],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y;
            if (indicadorActivo === "renta" || indicadorActivo === "valor_catastral")
              return ` ${v.toLocaleString("es-ES")} €`;
            if (indicadorActivo === "edad_media") return ` ${v} años`;
            if (indicadorActivo === "densidad") return ` ${v} hab/100m²`;
            return ` ${v.toLocaleString("es-ES")}`;
          },
        },
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-1">
        {barrio.nombre}
      </h2>

      <p className="text-xs text-slate-500 mb-3">
        {labelIndicador}
      </p>

      <div className="h-[220px] mb-4">
        <Bar data={data} options={options} />
      </div>

      {/* Ficha resumen del barrio */}
      <div className="grid grid-cols-2 gap-2 mt-3">

        <div className="bg-slate-50 rounded-lg p-2 flex flex-col">
          <span className="text-[11px] text-slate-500">👥 Población</span>
          <strong className="text-sm text-slate-800">
            {barrio.poblacion?.toLocaleString("es-ES")}
          </strong>
        </div>

        <div className="bg-slate-50 rounded-lg p-2 flex flex-col">
          <span className="text-[11px] text-slate-500">🏠 Viviendas</span>
          <strong className="text-sm text-slate-800">
            {barrio.num_viviendas?.toLocaleString("es-ES")}
          </strong>
        </div>

        <div className="bg-slate-50 rounded-lg p-2 flex flex-col">
          <span className="text-[11px] text-slate-500">💶 Renta media</span>
          <strong className="text-sm text-slate-800">
            {barrio.renta?.toLocaleString("es-ES")} €
          </strong>
        </div>

        <div className="bg-slate-50 rounded-lg p-2 flex flex-col">
          <span className="text-[11px] text-slate-500">🎂 Edad media</span>
          <strong className="text-sm text-slate-800">
            {barrio.edad_media} años
          </strong>
        </div>

        <div className="bg-slate-50 rounded-lg p-2 flex flex-col">
          <span className="text-[11px] text-slate-500">🏪 Comercios</span>
          <strong className="text-sm text-slate-800">
            {barrio.establecimientos_comercio}
          </strong>
        </div>

        <div className="bg-slate-50 rounded-lg p-2 flex flex-col">
          <span className="text-[11px] text-slate-500">🍽️ Hostelería</span>
          <strong className="text-sm text-slate-800">
            {barrio.establecimientos_hosteleria}
          </strong>
        </div>

      </div>
    </div>
  );
}
