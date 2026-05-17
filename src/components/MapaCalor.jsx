import {
  MapContainer,
  TileLayer,
  useMap,
  GeoJSON
} from "react-leaflet";

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import L from "leaflet";
import "leaflet.heat";

/* =========================
   🔥 HEAT LAYER
========================= */
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

/* =========================
   🟦 BORDES DE BARRIOS
========================= */
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

/* =========================
   📱 FIX MÓVIL / PWA
========================= */
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

/* =========================
   🗺 MAPA PRINCIPAL
========================= */
export default function MapaCalor({ data, barriosData }) {

  const navigate = useNavigate();
  const location = useLocation();

  /* 🔥 detectar origen */
  const params = new URLSearchParams(location.search);
  const from = params.get("from");

  /* 🔥 puntos heatmap */
  const points =
    data?.features.map(f => [
      f.geometry.coordinates[1],
      f.geometry.coordinates[0],
      1
    ]) || [];

  return (
    <div className="relative w-full h-[100dvh]">

      {/* 🔙 BOTÓN VOLVER INTELIGENTE */}
      <button
        onClick={() => {
          if (from === "servicios") {
            navigate("/servicios");
          } else {
            navigate("/tiendas");
          }
        }}
        className="absolute top-4 left-4 z-[1000] bg-slate-800 text-white px-4 py-2 rounded-xl border border-slate-600 hover:bg-slate-700 transition shadow-lg"
      >
        Volver
      </button>

      {/* 🗺 MAPA */}
      <MapContainer
        center={[42.8467, -2.6716]}
        zoom={13}
        className="w-full h-full"
        zoomControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={true}
      >

        {/* 🌍 base map */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🔥 heatmap */}
        <HeatLayer points={points} />

        {/* 🟦 barrios */}
        <BarriosBorders data={barriosData} />

        {/* 📱 fix móvil PWA */}
        <FixMapResize />

      </MapContainer>

    </div>
  );
}