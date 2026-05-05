import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

export default function Grafico({ barrio, indicadorActivo, indicadoresData, labelIndicador }) {
  if (!barrio) {
    return (
      <div className="chart-placeholder">
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
      <h2>{barrio.nombre}</h2>
      <p className="chart-subtitle">{labelIndicador}</p>

      <div style={{ height: "220px", marginBottom: "1rem" }}>
        <Bar data={data} options={options} />
      </div>

      {/* Ficha resumen del barrio */}
      <div className="barrio-stats">
        <div className="stat"><span>👥 Población: </span><strong>{barrio.poblacion?.toLocaleString("es-ES")}</strong></div>
        <div className="stat"><span>🏠 Viviendas: </span><strong>{barrio.num_viviendas?.toLocaleString("es-ES")}</strong></div>
        <div className="stat"><span>💶 Renta media: </span><strong>{barrio.renta?.toLocaleString("es-ES")} €</strong></div>
        <div className="stat"><span>🎂 Edad media: </span><strong>{barrio.edad_media} años</strong></div>
        <div className="stat"><span>🏪 Comercios: </span><strong>{barrio.establecimientos_comercio}</strong></div>
        <div className="stat"><span>🍽️ Hostelería: </span><strong>{barrio.establecimientos_hosteleria}</strong></div>
        <div className="stat"><span>🏢 Servicios: </span><strong>{barrio.establecimientos_servicios}</strong></div>
        <div className="stat"><span>📦 Total establec.: </span><strong>{barrio.establecimientos_total}</strong></div>
      </div>
    </div>
  );
}
