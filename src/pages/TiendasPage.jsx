import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MapaTiendas from "../components/MapaTiendas";
import { useNavigate } from "react-router-dom";

const ICONOS_BASE = {
  anti: "mapa_antiguedades.jpg",
  art: "mapa_arte_pintura.jpg",
  beauty: "mapa_belleza.jpg",
  bicycle: "mapa_bici.jpg",
  bolsos: "mapa_bolsos.jpg",
  coffee: "mapa_cafe.jpg",
  carniceria: "mapa_carniceria.jpg",
  butcher: "mapa_carniceria.jpg",
  cerrajeria: "mapa_cerrajeria.jpg",
  locksmith: "mapa_cerrajeria.jpg",
  confiteria: "mapa_confiteria.jpg",
  pastry: "mapa_confiteria.jpg",
  concesionario: "mapa_consesionario.jpg",
  car: "mapa_consesionario.jpg",
  furniture: "mapa_hogar.jpg",
  interior_decoration: "mapa_hogar.jpg",
  clothes: "mapa_ropa.jpg",
  supermarket: "mapa_supermecado.jpg",
  bakery: "mapa_panaderia.jpg",
  sports: "mapa_deporte.jpg",
  jewelry: "mapa_joyeria.jpg",
  shoes: "mapa_zapateria.jpg",
  optician: "mapa_optica.jpg",
  hairdresser: "mapa_peluqueria.jpg",
  florist: "mapa_floristeria.jpg",
  greengrocer: "mapa_frutas_verduras.jpg",
  laundry: "mapa_lavanderia.jpg",
  stationery: "mapa_libros_papeleria.jpg",
  books: "mapa_libros_papeleria.jpg",
  lighting: "mapa_iluminacion.jpg",
  electronics: "mapa_electronica.jpg",
  mobile_phone: "mapa_electronica.jpg",
  telecommunication: "mapa_electronica.jpg",
  pharmacy: "mapa_farmacia.jpg",
  toys: "mapa_jugueteria.jpg",
  music: "mapa_musica.jpg",
  photo: "mapa_fotografia.jpg",
  tailor: "mapa_sastreria_costureria.jpg",
  copyshop: "mapa_copisteria.jpg",
  lottery: "mapa_loteria.jpg",
  tattoo: "mapa_tatuajes.jpg"
};

const ETIQUETAS = {
  "mapa_antiguedades.jpg": "Antigüedades",
  "mapa_arte_pintura.jpg": "Arte",
  "mapa_belleza.jpg": "Belleza",
  "mapa_bici.jpg": "Bicis",
  "mapa_bolsos.jpg": "Bolsos",
  "mapa_cafe.jpg": "Café",
  "mapa_carniceria.jpg": "Carnicería",
  "mapa_cerrajeria.jpg": "Cerrajería",
  "mapa_confiteria.jpg": "Confitería",
  "mapa_consesionario.jpg": "Coches",
  "mapa_hogar.jpg": "Hogar",
  "mapa_ropa.jpg": "Ropa",
  "mapa_supermecado.jpg": "Súper",
  "mapa_panaderia.jpg": "Panadería",
  "mapa_deporte.jpg": "Deporte",
  "mapa_joyeria.jpg": "Joyas",
  "mapa_zapateria.jpg": "Calzado",
  "mapa_optica.jpg": "Óptica",
  "mapa_peluqueria.jpg": "Peluquería",
  "mapa_floristeria.jpg": "Floristería",
  "mapa_frutas_verduras.jpg": "Frutería",
  "mapa_lavanderia.jpg": "Lavandería",
  "mapa_libros_papeleria.jpg": "Librería",
  "mapa_iluminacion.jpg": "Iluminación",
  "mapa_electronica.jpg": "Electrónica",
  "mapa_farmacia.jpg": "Farmacia",
  "mapa_jugueteria.jpg": "Juguetes",
  "mapa_musica.jpg": "Música",
  "mapa_fotografia.jpg": "Foto",
  "mapa_sastreria_costureria.jpg": "Sastrería",
  "mapa_copisteria.jpg": "Copias",
  "mapa_loteria.jpg": "Lotería",
  "mapa_tatuajes.jpg": "Tatuajes"
};


export default function TiendasPage() {
  const navigate = useNavigate();
  const [tiendasData, setTiendasData] = useState(null);
  const [filtrosActivos, setFiltrosActivos] = useState([]);
  const [barriosData, setBarriosData] = useState(null);

  useEffect(() => {
  fetch("/data/comercios_clasificados.geojson")
    .then(res => res.json())
    .then(setTiendasData);

  fetch("/data/barrios.geojson")
    .then(res => res.json())
    .then(setBarriosData);

}, []);

  const obtenerShopsPorImagen = (nombreImagen) => {
    return Object.keys(ICONOS_BASE).filter(shop => ICONOS_BASE[shop] === nombreImagen);
  };

  function toggleFiltro(nombreImagen) {
    setFiltrosActivos(prev =>
      prev.includes(nombreImagen)
        ? prev.filter(img => img !== nombreImagen)
        : [...prev, nombreImagen]
    );
  }

  const obtenerFiltrosReales = () => {
    return filtrosActivos.flatMap(img => obtenerShopsPorImagen(img));
  };

  function seleccionarTodos() {
    setFiltrosActivos(imagenesUnicas);
  }

  const imagenesUnicas = tiendasData
    ? [...new Set(tiendasData.features
      .map(f => ICONOS_BASE[f.properties.shop])
      .filter(img => img !== undefined)
    )]
    : [];

  return (
    <div className="h-screen flex flex-col font-sans text-gray-800">
        <Link to="/" className="mb-0 text-sm text-blue-600 hover:underline">
          Volver
        </Link>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <MapaTiendas
            tiendasData={tiendasData}
            filtros={obtenerFiltrosReales()}
            diccionarioIconos={ICONOS_BASE}
            barriosData={barriosData}
            onBarrioClick={(barrio) => navigate(`/tiendasBarrio/${barrio.BARRIO}`)}
          />
        </div>

        <div className="w-72 bg-white p-4 overflow-y-auto border-l shadow-xl">
          
          <div className="flex gap-2 mb-6">
            
            <button
              className="flex-1 border border-blue-300 text-blue-600 rounded-md px-2 py-2 text-xs font-bold uppercase tracking-wider hover:bg-blue-50 transition-colors"
              onClick={seleccionarTodos}
            >
              Seleccionar todos
            </button>

            <button
              className="flex-1 border border-gray-300 rounded-md px-2 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
              onClick={() => setFiltrosActivos([])}
            >
              Limpiar filtros
            </button>

          </div>

          <div className="grid grid-cols-3 gap-y-6 gap-x-2">
            {imagenesUnicas.map(img => (
              <div
                key={img}
                onClick={() => toggleFiltro(img)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className={`p-1 rounded-full border-2 transition-all ${filtrosActivos.includes(img)
                    ? "border-blue-500 bg-blue-50 scale-110 shadow-md"
                    : "border-transparent group-hover:border-gray-100"
                  }`}>
                  <img
                    src={`/fotos_mapa/tiendas/${img}`}
                    alt={img}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <span className={`mt-1 text-[10px] text-center leading-tight font-medium ${filtrosActivos.includes(img) ? "text-blue-600 font-bold" : "text-gray-500"
                  }`}>
                  {ETIQUETAS[img] || "Tienda"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
