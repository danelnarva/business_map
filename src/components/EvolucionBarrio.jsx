import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function formatearValor(indicador, valor) {
  if (valor == null) return "Sin datos";

  if (indicador === "renta" || indicador === "valor_catastral") {
    return `${valor.toLocaleString("es-ES")} €`;
  }

  if (indicador === "edad_media") {
    return `${valor} años`;
  }

  return valor.toLocaleString("es-ES");
}

export default function EvolucionBarrio({
  barrio,
  historicoData,
  indicadorActivo,
  labelIndicador,
}) {
  if (!barrio) {
    return (
      <section className="evolution-card">
        <h2>Evolución temporal</h2>
        <p>Selecciona un barrio para ver su evolución.</p>
      </section>
    );
  }

  const historicoBarrio = historicoData.find(
    (item) =>
        Number(item.BARRIO) === Number(barrio.BARRIO) ||
        item.nombre?.toLowerCase().trim() === barrio.nombre?.toLowerCase().trim()
    );

  if (!historicoBarrio || !historicoBarrio.datos?.length) {
    return (
      <section className="evolution-card">
        <h2>Evolución temporal</h2>
        <p>No hay datos históricos disponibles para {barrio.nombre}.</p>
      </section>
    );
  }

  const labels = historicoBarrio.datos.map((item) => item.anio);
  const valores = historicoBarrio.datos.map((item) => item[indicadorActivo]);

  const primerValor = valores[0];
  const ultimoValor = valores[valores.length - 1];
  const diferencia = ultimoValor - primerValor;
  const porcentaje =
    primerValor !== 0 ? ((diferencia / primerValor) * 100).toFixed(1) : 0;

  const data = {
    labels,
    datasets: [
      {
        label: labelIndicador,
        data: valores,
        tension: 0.3,
        borderWidth: 3,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${labelIndicador}: ${formatearValor(
              indicadorActivo,
              context.raw
            )}`,
        },
      },
    },
  };

  return (
    <section className="evolution-card">
      <div className="evolution-header">
        <div>
          <h2>Evolución temporal</h2>
          <p>
            {barrio.nombre} · {labelIndicador}
          </p>
        </div>

        <div className="evolution-summary">
          <span>Variación</span>
          <strong className={diferencia >= 0 ? "positive" : "negative"}>
            {diferencia >= 0 ? "+" : ""}
            {porcentaje}%
          </strong>
        </div>
      </div>

      <div className="evolution-chart">
        <Line data={data} options={options} />
      </div>
    </section>
  );
}