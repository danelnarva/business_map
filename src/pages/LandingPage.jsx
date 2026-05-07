import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-200 px-6">

      {/* TÍTULO */}
      <h1 className="text-4xl font-bold text-slate-800 mb-10">
        V-G BUSINESSMAP
      </h1>

      {/* BOTONES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">

        <Link
          to="/Tiendas"
          className="bg-slate-300 text-slate-800 p-8 rounded-2xl shadow text-xl font-semibold 
                     hover:bg-blue-600 hover:text-white cursor-pointer transition text-center"
        >
          🏬 Tiendas
        </Link>

        <Link
          to="/Servicios"
          className="bg-slate-300 text-slate-800 p-8 rounded-2xl shadow text-xl font-semibold 
                     hover:bg-blue-600 hover:text-white cursor-pointer transition text-center"
        >
          🧰 Servicios
        </Link>

        <Link
          to="/Barrios"
          className="bg-slate-300 text-slate-800 p-8 rounded-2xl shadow text-xl font-semibold 
                     hover:bg-blue-600 hover:text-white cursor-pointer transition text-center"
        >
          🏙️ Barrios
        </Link>

      </div>
    </div>
  );
}
