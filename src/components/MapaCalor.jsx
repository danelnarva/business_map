import {
  MapContainer,
  TileLayer,
  useMap,
  GeoJSON
} from "react-leaflet";

import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import L from "leaflet";
import "leaflet.heat";

function HeatLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points?.length) return;

    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 20,
      maxZoom: 17
    }).addTo(map);

    return () => {
      heat.remove();
    };
  }, [map, points]);

  return null;
}

function BarriosBorders({ data }) {
  if (!data) return null;

  return (
    <GeoJSON
      data={data}
      style={() => ({
        color: "#555",
        weight: 1.5,
        fillOpacity: 0.1
      })}
    />
  );
}

function FixMapResize() {
  const map = useMap();

  useEffect(() => {
    const t = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => clearTimeout(t);
  }, [map]);

  return null;
}


export default function MapaCalor({ data, barriosData }) {

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const from = params.get("from");

  const points =
    data?.features.map(f => [
      f.geometry.coordinates[1],
      f.geometry.coordinates[0],
      1
    ]) || [];

  return (
    <div className="relative w-full h-[100dvh]">

      {/* MAPA */}
      <MapContainer
        center={[42.8467, -2.6716]}
        zoom={13}
        className="w-full h-full"
        zoomControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={true}
      >

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <HeatLayer points={points} />

        <BarriosBorders data={barriosData} />

        <FixMapResize />

      </MapContainer>

    </div>
  );
}