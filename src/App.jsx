import { useEffect, useState } from "react";
import Mapa from "./components/Mapa";
import Grafico from "./components/Grafico";
import "./App.css";
import RankingBarrios from "./components/RankingBarrios";
import EvolucionBarrio from "./components/EvolucionBarrio";



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

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [historicoData, setHistoricoData] = useState([]);

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

        setBarriosData(await geojsonRes.json());
        setIndicadores(await indicadoresRes.json());
        setHistoricoData(await historicoRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  if (cargando) {
    return <div className="app">Cargando datos urbanos...</div>;
  }

  if (error) {
    return <div className="app">Error: {error}</div>;
  }

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
              labelIndicador={INDICADORES.find((i) => i.value === indicadorActivo)?.label}
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
      <RankingBarrios
        indicadoresData={indicadoresData}
        indicadorActivo={indicadorActivo}
        labelIndicador={INDICADORES.find((i) => i.value === indicadorActivo)?.label}
        onBarrioClick={setBarrioSeleccionado}
      />
      <EvolucionBarrio
        barrio={barrioSeleccionado}
        historicoData={historicoData}
        indicadorActivo={indicadorActivo}
        labelIndicador={INDICADORES.find((i) => i.value === indicadorActivo)?.label}
      />
    </div>
  );
}
