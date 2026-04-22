import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function getColorRenta(valor) {
  return valor > 30000 ? "#084081" :
         valor > 20000 ? "#2b8cbe" :
         valor > 10000 ? "#7bccc4" :
                         "#edf8fb";
}

function getColorPoblacion(valor) {
  return valor > 20000 ? "#54278f" :
         valor > 15000 ? "#756bb1" :
         valor > 10000 ? "#9e9ac8" :
                         "#f2f0f7";
}

function getColorEdad(valor) {
  return valor > 45 ? "#a50f15" :
         valor > 40 ? "#de2d26" :
         valor > 35 ? "#fb6a4a" :
                      "#fee5d9";
}

function getColor(indicador, valor) {
  if (valor == null) return "#cccccc";
  if (indicador === "renta") return getColorRenta(valor);
  if (indicador === "poblacion") return getColorPoblacion(valor);
  if (indicador === "edad_media") return getColorEdad(valor);
  return "#cccccc";
}

export default function Mapa({barriosData, indicadoresData, indicadorActivo, onBarrioClick}) {
  
  function style(feature) {
    const id = feature.properties.BARRIO;
    const datos = indicadoresData.find(el => el.BARRIO == id);
    const valor = datos?.[indicadorActivo];

    return {
      fillColor: getColor(indicadorActivo, valor),
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    };
  }

  function onEachFeature(feature, layer) {
    const id = feature.properties.BARRIO;
    const nombre = feature.properties.TEXTO;
    const datos =  indicadoresData.find(el => el.BARRIO == id);

    const popupContent = `
      <strong>${nombre}</strong><br/>
      ${
        datos
          ? `
            Renta: ${datos.renta}<br/>
            Población: ${datos.poblacion}<br/>
            Edad media: ${datos.edad_media}
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
          color: "#333",
          fillOpacity: 0.9,
        });
      },
      mouseout: (e) => {
        e.target.setStyle({
          weight: 1,
          color: "white",
          fillOpacity: 0.7,
        });
      },
    });
  }

  return (
    <MapContainer center={[42.85, -2.68]} zoom={12} style={{ height: "500px", width: "100%" }}>
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <GeoJSON key={indicadorActivo} data={barriosData} style={style} onEachFeature={onEachFeature}/>
      <Marker position={[42.839227253054126, -2.6745152280911015]}>
        <Popup>
          Escuela de ingeniería de Vitoria-Gasteiz
        </Popup>
      </Marker>
    </MapContainer>
  );
}