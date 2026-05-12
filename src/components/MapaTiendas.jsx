import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

export default function MapaTiendas({
  tiendasData,
  filtros,
  diccionarioIconos,
  barriosData,
  onBarrioClick
}) {

  const tiendasFiltradas = tiendasData?.features.filter(f =>
    filtros.includes(f.properties.shop)
  );

  const crearIcono = (tipoShop) => {
    const nombreImagen = diccionarioIconos[tipoShop] || "default.png";

    return L.icon({
      iconUrl: `/fotos_mapa/tiendas/${nombreImagen}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      className: "marker-personalizado"
    });
  };

  return (
    <MapContainer
      center={[42.8467, -2.6716]}
      zoom={14}
      className="h-full w-full"
    >

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {barriosData && (
        <GeoJSON
          data={barriosData}
          style={() => ({
            color: "#555",
            weight: 1.5,
            fillOpacity: 0.2
          })}
          onEachFeature={(feature, layer) => {
            layer.on("click", () => {
              onBarrioClick(feature.properties);
            });
          }}
        />
      )}

      {tiendasFiltradas?.map((t, i) => (
        <Marker
          key={i}
          position={[
            t.geometry.coordinates[1],
            t.geometry.coordinates[0]
          ]}
          icon={crearIcono(t.properties.shop)}
        >
          <Popup>
            <div className="text-center font-sans">
              <strong className="block border-b mb-1">
                {t.properties.name || "Comercio"}
              </strong>

              <span className="text-xs text-gray-500 uppercase">
                {t.properties.shop}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  );
}