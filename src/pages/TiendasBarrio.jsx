import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BarrioTiendas() {
  const { id } = useParams();

  const [tiendas, setTiendas] = useState([]);

  useEffect(() => {
    fetch("/data/comercios_clasificados.geojson")
      .then(r => r.json())
      .then(data => {
        const filtradas = data.features.filter(
          t => String(t.properties.id_barrio) === id
        );
        setTiendas(filtradas);
      });
  }, [id]);

  const tipos = {};

  tiendas.forEach(t => {
    const tipo = t.properties.shop;
    tipos[tipo] = (tipos[tipo] || 0) + 1;
  });

  return (
    <div className="p-6">
        <Link to="/Tiendas" className="mb-0 text-sm text-blue-600 hover:underline">
          Volver
        </Link>
      <h1 className="text-2xl font-bold">
        Barrio {id}
      </h1>

      <p className="mt-2 text-gray-600">
        Total tiendas: {tiendas.length}
      </p>

      <h2 className="mt-6 font-semibold">Tipos de tiendas</h2>

      <ul className="mt-2">
        {Object.entries(tipos).map(([tipo, count]) => (
          <li key={tipo}>
            {tipo}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
}