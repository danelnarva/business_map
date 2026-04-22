import { useEffect, useState } from "react";
import Mapa from "./components/Mapa";
import Grafico from "./components/Grafico";
import "./App.css";

const INDICADORES = [
  { value: "renta",                     label: "Renta media (€)" },
  { value: "poblacion",                 label: "Población" },
  { value: "edad_media",                label: "Edad media" },
  { value: "densidad",                  label: "Densidad (hab/100m²)" },
  { value: "valor_catastral",           label: "Valor catastral medio (€)" },
  { value: "num_viviendas",             label: "Nº de viviendas" },
  { value: "establecimientos_total",    label: "Total establecimientos" },
  { value: "establecimientos_comercio", label: "Comercios" },
  { value: "establecimientos_hosteleria", label: "Hostelería" },
  { value: "establecimientos_servicios",  label: "Servicios" },
];

export default function App() {
  const [barriosData, setBarriosData] = useState(null);
  const [indicadoresData, setIndicadores] = useState([]);
  const [indicadorActivo, setIndicadorActivo] = useState("renta");
  const [barrioSeleccionado, setBarrioSeleccionado] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      const [geojsonRes, indicadoresRes] = await Promise.all([
        fetch("/data/barrios.geojson"),
        fetch("/data/indicadores.json"),
      ]);
      setBarriosData(await geojsonRes.json());
      setIndicadores(await indicadoresRes.json());
    }
    cargarDatos();
  }, []);

  return (
    <div className="app">
      <h1>Vitoria-Gasteiz Business Map</h1>

      <div className="controls">
        <label htmlFor="indicador">Indicador: </label>
        <select
          id="indicador"
          value={indicadorActivo}
          onChange={(e) => setIndicadorActivo(e.target.value)}
        >
          {INDICADORES.map((ind) => (
            <option key={ind.value} value={ind.value}>
              {ind.label}
            </option>
          ))}
        </select>
      </div>

      <div className="layout">
        <div className="map-container">
          {barriosData && (
            <Mapa
              barriosData={barriosData}
              indicadoresData={indicadoresData}
              indicadorActivo={indicadorActivo}
              onBarrioClick={setBarrioSeleccionado}
            />
          )}
        </div>

        <div className="chart-container">
          <Grafico
            barrio={barrioSeleccionado}
            indicadorActivo={indicadorActivo}
            indicadoresData={indicadoresData}
            labelIndicador={INDICADORES.find(i => i.value === indicadorActivo)?.label}
          />
        </div>
      </div>
    </div>
  );
}
