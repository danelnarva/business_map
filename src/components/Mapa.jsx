import { useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function formatearValor(indicador, valor) {
  if (valor == null) return "Sin datos";

  if (indicador === "renta" || indicador === "valor_catastral") {
    return `${valor.toLocaleString("es-ES")} €`;
  }

  if (indicador === "edad_media") {
    return `${valor} años`;
  }

  if (indicador === "densidad") {
    return `${valor} hab/100m²`;
  }

  return valor.toLocaleString("es-ES");
}

function calcularCuartiles(valores) {
  const ordenados = [...valores].sort((a, b) => a - b);

  const getPercentil = (p) => {
    const index = Math.floor((ordenados.length - 1) * p);
    return ordenados[index];
  };

  return {
    q1: getPercentil(0.25),
    q2: getPercentil(0.5),
    q3: getPercentil(0.75),
  };
}

function getColorPorCuartiles(valor, cuartiles) {
  if (valor == null) return "#cbd5e1";

  if (valor >= cuartiles.q3) return "#1d4ed8";
  if (valor >= cuartiles.q2) return "#38bdf8";
  if (valor >= cuartiles.q1) return "#99f6e4";
  return "#ecfeff";
}

export default function Mapa({
  barriosData,
  indicadoresData,
  indicadorActivo,
  labelIndicador,
  onBarrioClick,
}) {
  const indicadoresPorBarrio = useMemo(() => {
    return Object.fromEntries(indicadoresData.map((b) => [b.BARRIO, b]));
  }, [indicadoresData]);

  const valoresIndicador = indicadoresData
  .map((b) => b[indicadorActivo])
  .filter((v) => typeof v === "number");

  const cuartiles = calcularCuartiles(valoresIndicador);

  function style(feature) {
    const id = feature.properties.BARRIO;
    const datos = indicadoresPorBarrio[id];
    const valor = datos?.[indicadorActivo];

    return {
      fillColor: getColorPorCuartiles(valor, cuartiles),
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.75,
    };
  }

  function onEachFeature(feature, layer) {
    const id = feature.properties.BARRIO;
    const nombre = feature.properties.TEXTO;
    const datos = indicadoresPorBarrio[id];
    const valor = datos?.[indicadorActivo];

    const popupContent = `
      <strong>${nombre}</strong><br/>
      <b>${labelIndicador}:</b> ${formatearValor(indicadorActivo, valor)}<br/><br/>
      ${
        datos
          ? `
            Renta: ${formatearValor("renta", datos.renta)}<br/>
            Población: ${formatearValor("poblacion", datos.poblacion)}<br/>
            Edad media: ${formatearValor("edad_media", datos.edad_media)}
          `
          : "Sin datos"
      }
    `;

    layer.bindPopup(popupContent);

    layer.on({
      click: () => {
        if (datos) {
          onBarrioClick({
            nombre,
            ...datos,
          });
        }
      },
      mouseover: (e) => {
        e.target.setStyle({
          weight: 2,
          color: "#0f172a",
          fillOpacity: 0.9,
        });
      },
      mouseout: (e) => {
        e.target.setStyle({
          weight: 1,
          color: "white",
          fillOpacity: 0.75,
        });
      },
    });
  }

  return (
    <div className="relative">
      <MapContainer
        center={[42.85, -2.68]}
        zoom={12}
        className="h-[500px] w-full rounded-2xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <GeoJSON
          key={indicadorActivo}
          data={barriosData}
          style={style}
          onEachFeature={onEachFeature}
        />

        <Marker position={[42.839227253054126, -2.6745152280911015]}>
          <Popup>Escuela de Ingeniería de Vitoria-Gasteiz</Popup>
        </Marker>
      </MapContainer>

      <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-slate-200 text-xs text-slate-600 pointer-events-none">
        <strong className="block mb-1 text-slate-800">{labelIndicador}</strong>
        <div className="flex items-center gap-2"> <span className="w-3 h-3 rounded-full bg-cyan-50 border border-slate-200"></span> Bajo</div>
        <div className="flex items-center gap-2 mt-1"> <span className="w-3 h-3 rounded-full bg-cyan-200"></span> Medio-bajo</div>
        <div className="flex items-center gap-2 mt-1"> <span className="w-3 h-3 rounded-full bg-sky-400"></span> Medio-alto</div>
        <div className="flex items-center gap-2 mt-1"> <span className="w-3 h-3 rounded-full bg-sky-700"></span> Alto</div>
      </div>
    </div>
  );
}