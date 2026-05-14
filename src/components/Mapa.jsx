import { useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
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
    return `${valor} hab/km²`;
  }

  return valor.toLocaleString("es-ES");
}

function getColorContinuo(valor, min, max) {
  if (valor == null) return "#e2e8f0"; // slate-200 para datos nulos
  if (min === max) return "hsl(221, 83%, 53%)"; // Valor fijo si no hay variación
  
  const ratio = (valor - min) / (max - min);
  // L (Lightness) va de 95% (más claro) a 30% (más oscuro)
  const lightness = 95 - (ratio * 65); 
  return `hsl(221, 83%, ${lightness}%)`;
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

  const min = valoresIndicador.length > 0 ? Math.min(...valoresIndicador) : 0;
  const max = valoresIndicador.length > 0 ? Math.max(...valoresIndicador) : 100;

  function style(feature) {
    const id = feature.properties.BARRIO;
    const datos = indicadoresPorBarrio[id];
    const valor = datos?.[indicadorActivo];

    return {
      fillColor: getColorContinuo(valor, min, max),
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.85,
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
          fillOpacity: 1,
        });
      },
      mouseout: (e) => {
        e.target.setStyle({
          weight: 1,
          color: "white",
          fillOpacity: 0.85,
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
      </MapContainer>

      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200 text-xs text-slate-600 pointer-events-none min-w-[240px]">
        <strong className="block mb-3 text-slate-800 font-bold uppercase tracking-wider">{labelIndicador}</strong>
        
        {/* Barra de degradado */}
        <div className="w-full h-3 rounded-full mb-2 shadow-inner" style={{ background: 'linear-gradient(to right, hsl(221, 83%, 95%), hsl(221, 83%, 30%))' }}></div>
        
        {/* Etiquetas Min/Max */}
        <div className="flex justify-between font-semibold text-slate-500">
          <span>{formatearValor(indicadorActivo, min)}</span>
          <span>{formatearValor(indicadorActivo, max)}</span>
        </div>
      </div>
    </div>
  );
}