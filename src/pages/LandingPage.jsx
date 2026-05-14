import { Link } from "react-router-dom";
import { Store, Wrench, Map as MapIcon } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-900 font-sans overflow-hidden">
      
      {/* Panel Izquierdo (Contenido) */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col px-8 py-12 md:px-16 lg:px-20 h-screen overflow-y-auto z-10 relative">
        
        {/* Glow de fondo */}
        <div className="absolute top-[-10%] left-[-20%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex-1 flex flex-col justify-center">
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-8">
            <span className="bg-gradient-to-br from-emerald-400 via-green-400 to-teal-500 text-transparent bg-clip-text drop-shadow-sm">
              V-G BUSINESSMAP
            </span>
          </h1>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-snug">
            Explora tu oportunidad de negocio en Vitoria-Gasteiz
          </h2>
          
          <p className="text-slate-400 text-lg mb-12 max-w-md leading-relaxed">
            Localiza comercios y servicios en tiempo real. Analiza la idoneidad y las métricas demográficas de cada barrio para tomar decisiones estratégicas.
          </p>

          <div className="flex flex-col gap-4 max-w-md">
            
            <Link to="/Tiendas" className="group bg-white/5 hover:bg-emerald-600/10 border border-white/10 hover:border-emerald-500/50 p-4 rounded-2xl flex items-center gap-5 transition-all duration-300">
              <div className="bg-emerald-500/20 p-3.5 rounded-xl text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-lg">
                <Store size={26} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg tracking-wide">Directorio de Tiendas</h3>
                <p className="text-slate-400 text-sm mt-0.5">Encuentra locales comerciales activos</p>
              </div>
            </Link>

            <Link to="/Servicios" className="group bg-white/5 hover:bg-emerald-600/10 border border-white/10 hover:border-emerald-500/50 p-4 rounded-2xl flex items-center gap-5 transition-all duration-300">
              <div className="bg-emerald-500/20 p-3.5 rounded-xl text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-lg">
                <Wrench size={26} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg tracking-wide">Red de Servicios</h3>
                <p className="text-slate-400 text-sm mt-0.5">Explora la oferta de servicios en la ciudad</p>
              </div>
            </Link>

            <Link to="/Barrios" className="group bg-white/5 hover:bg-emerald-600/10 border border-white/10 hover:border-emerald-500/50 p-4 rounded-2xl flex items-center gap-5 transition-all duration-300">
              <div className="bg-emerald-500/20 p-3.5 rounded-xl text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-lg">
                <MapIcon size={26} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg tracking-wide">Análisis de Barrios</h3>
                <p className="text-slate-400 text-sm mt-0.5">Métricas demográficas e inmobiliarias</p>
              </div>
            </Link>

          </div>
        </div>
      </div>

      {/* Panel Derecho (Imagen de Fondo) */}
      <div className="hidden lg:block lg:w-[55%] xl:w-[60%] relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/vitoria_bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-slate-900/10" />
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
      </div>

      {/* Logos Patrocinadores (Bottom Right) */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-6 bg-white/95 backdrop-blur-md px-8 py-5 rounded-2xl shadow-2xl border border-white">
        <img src="/ehu_upv.png" alt="UPV/EHU" className="h-10 md:h-12 object-contain" />
        <div className="w-px h-12 bg-slate-200"></div>
        <img src="/mobility_lab.png" alt="Mobility LAB Vitoria-Gasteiz" className="h-12 md:h-14 object-contain" />
      </div>

    </div>
  );
}
