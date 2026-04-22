import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

export default function Grafico({ barrio }) {
  if (!barrio) {
    return <p>Selecciona un barrio en el mapa.</p>;
  }

  const data = {
    labels: ["Renta", "Población"],
    datasets: [
      {
        label: barrio.nombre,
        data: [barrio.renta, barrio.poblacion],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: "500px" }}>
      <h2>{barrio.nombre}</h2>
      <Bar data={data} options={options} />
    </div>
  );
}