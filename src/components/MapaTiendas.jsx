import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";

export default function MapaTiendas({ tiendasData, filtros }) {

  const tiendasFiltradas = tiendasData?.features.filter(f =>
    filtros.length === 0 || filtros.includes(f.properties.shop)
  );

  return (
    <MapContainer
      center={[42.85, -2.68]}
      zoom={13}
      className="h-full w-full"
      //attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {tiendasFiltradas?.map((t, i) => (
        <Marker
          key={i}
          position={[
            t.geometry.coordinates[1],
            t.geometry.coordinates[0]
          ]}
        >
          <Popup>{t.properties.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}