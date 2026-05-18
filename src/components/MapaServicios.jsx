import {MapContainer, TileLayer, GeoJSON, Marker, Popup, Tooltip, useMap } from "react-leaflet";

import { useEffect, useRef } from "react";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

export default function MapaServicios({
  serviciosData,
  filtros,
  diccionarioIconos,
  barriosData,
  onBarrioClick,
  barrioSeleccionado,
  mostrarTodasSiNoHayFiltros = false
}) {

  const mapRef = useRef();

const serviciosFiltrados = serviciosData?.features.filter(f => {

  const tipo = f.properties.amenity;

  const tieneIcono =
    diccionarioIconos[tipo];

  if (
    filtros.length === 0 &&
    !mostrarTodasSiNoHayFiltros
  ) {
    return false;
  }

  const pasaFiltro =
    filtros.length === 0 ||
    filtros.includes(tipo);

  return (
    tieneIcono &&
    pasaFiltro &&
    f.properties.id_barrio !== null
  );

});

const serviciosValidos = serviciosData?.features.filter(f => {

  const tipo = f.properties.amenity;

  return (
    diccionarioIconos[tipo] &&
    f.properties.id_barrio !== null
  );

});

const crearIcono = (tipoServicio) => {
  const nombreImagen =
    diccionarioIconos[tipoServicio] || "default.png";

  return L.divIcon({
    html: `
      <img
        src="${import.meta.env.BASE_URL}fotos_mapa/servicios/${nombreImagen}"
        class="w-[22px] h-[22px] rounded-full object-cover"
      />
    `,
    className: "",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11]
  });
};


function CentrarBarrio({ barrio }) {

  const map = useMap();

  useEffect(() => {

    if (!barrio) return;

    const layer = L.geoJSON(barrio);

    const bounds = layer.getBounds();

    map.fitBounds(bounds, {
      padding: [40, 40]
    });

  }, [barrio, map]);

  return null;
}

function obtenerColor(valor) {
  return valor > 200
    ? "#7f1d1d"
    : valor > 150
    ? "#991b1b"
    : valor > 100
    ? "#b91c1c"
    : valor > 60
    ? "#dc2626"
    : valor > 30
    ? "#ef4444"
    : "#f87171";
}

const conteoBarrios = {};

serviciosValidos?.forEach(t => {

  const idBarrio = t.properties.id_barrio;

  conteoBarrios[idBarrio] =
    (conteoBarrios[idBarrio] || 0) + 1;

});

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
      {barrioSeleccionado && (
  <CentrarBarrio barrio={barrioSeleccionado} />
)}

      {barriosData && !barrioSeleccionado && (
<GeoJSON
  data={barriosData}

  style={(feature) => {

    const idBarrio =
      feature.properties.BARRIO;

    const total =
      conteoBarrios[idBarrio] || 0;

    return {
      fillColor: obtenerColor(total),
      weight: 1.5,
      opacity: 1,
      color: "#475569",
      dashArray: "2",
      fillOpacity: 0.65
    };
  }}

  onEachFeature={(feature, layer) => {

    const idBarrio =
      feature.properties.BARRIO;

    const total =
      conteoBarrios[idBarrio] || 0;

    layer.bindTooltip(`
      <div style="
        font-family: sans-serif;
        font-size: 13px;
      ">
        <strong>${feature.properties.TEXTO}</strong>
        <br/>
        ${total} servicios
      </div>
    `);

    layer.on({

      mouseover: (e) => {

        e.target.setStyle({
          weight: 3,
          color: "#ffffff",
          fillOpacity: 0.8
        });

      },

      mouseout: (e) => {

        e.target.setStyle({
          weight: 1.5,
          color: "#475569",
          fillOpacity: 0.65
        });

      },

      click: () => {
        onBarrioClick(feature.properties);
      }

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

      {serviciosFiltrados?.map((t, i) => (
<Marker
  key={i}
  position={[
    t.geometry.coordinates[1],
    t.geometry.coordinates[0]
  ]}
  icon={crearIcono(t.properties.amenity)}
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
        {t.properties.name || "Servicio"}
      </strong>

      <span className="text-xs text-gray-500 uppercase">
        {t.properties.amenity}
      </span>

    </div>
  </Popup>

</Marker>
      ))}

    </MapContainer>
  );
}