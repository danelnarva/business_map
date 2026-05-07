import { Link } from "react-router-dom";

export default function TendenciasPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-200 p-6">
      <h1 className="text-3xl font-bold mb-4">Tendencias</h1>
      <p className="mb-6">Contenido de la página de Tendencias.</p>
      <Link to="/" className="text-blue-600 hover:underline">Volver</Link>
    </div>
  );
}
