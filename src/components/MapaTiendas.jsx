import {MapContainer, TileLayer, GeoJSON, Marker, Popup, Tooltip } from "react-leaflet";

import { useEffect, useRef } from "react";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

export default function MapaTiendas({
  tiendasData,
  filtros,
  diccionarioIconos,
  barriosData,
  onBarrioClick,
  barrioSeleccionado,
  mostrarTodasSiNoHayFiltros = false
}) {

  const mapRef = useRef();

  const tiendasFiltradas = tiendasData?.features.filter(f => {

    const tieneIcono =
      diccionarioIconos[f.properties.shop];

    if (
      filtros.length === 0 &&
      !mostrarTodasSiNoHayFiltros
    ) {
      return false;
    }

    const pasaFiltro =
      filtros.length === 0 ||
      filtros.includes(f.properties.shop);

    return tieneIcono && pasaFiltro;

  });

const crearIcono = (tipoShop) => {
  const nombreImagen =
    diccionarioIconos[tipoShop] || "default.png";

  return L.divIcon({
    html: `
      <img
        src="${import.meta.env.BASE_URL}fotos_mapa/tiendas/${nombreImagen}"
        class="w-[22px] h-[22px] rounded-full object-cover"
      />
    `,
    className: "",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11]
  });
};

useEffect(() => {

  if (
    barrioSeleccionado &&
    mapRef.current
  ) {

    const layer =
      L.geoJSON(barrioSeleccionado);

    const bounds =
      layer.getBounds();

    mapRef.current.fitBounds(bounds, {
      padding: [20, 20]
    });

    mapRef.current.setMaxBounds(bounds);

  }

}, [barrioSeleccionado]);

  return (
    <MapContainer
      center={[42.8467, -2.6716]}
      zoom={14}
      className="w-full h-full z-0"
      whenCreated={(map) => {
        mapRef.current = map;
      }}
    >

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {barriosData && !barrioSeleccionado && (
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

      {barrioSeleccionado && (
        <GeoJSON
          data={barrioSeleccionado}
          style={() => ({
            color: "#2563eb",
            weight: 3,
            fillOpacity: 0.15
          })}
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

{barrioSeleccionado && (
  <Tooltip
    direction="top"
    offset={[0, -25]}
    opacity={1}
    permanent={false}
  >
    {t.properties.name}
  </Tooltip>
)}

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