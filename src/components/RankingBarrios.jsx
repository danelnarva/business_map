function formatearValor(indicador, valor) {
  if (valor == null) return "Sin datos";

  if (indicador === "renta" || indicador === "valor_catastral") {
    return `${valor.toLocaleString("es-ES")} €`;
  }

  if (indicador === "edad_media") {
    return `${valor} años`;
  }

  if (indicador === "densidad") {
    return `${valor} hab/100m²`;
  }

  return valor.toLocaleString("es-ES");
}

export default function RankingBarrios({
  indicadoresData,
  indicadorActivo,
  labelIndicador,
  onBarrioClick,
}) {
  const barriosOrdenados = [...indicadoresData]
    .filter((barrio) => typeof barrio[indicadorActivo] === "number")
    .sort((a, b) => b[indicadorActivo] - a[indicadorActivo])
    .slice(0, 8);

  const valorMaximo = barriosOrdenados[0]?.[indicadorActivo] || 1;

  return (
    <section className="mt-4 bg-white rounded-xl p-5 shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Ranking de barrios
          </h2>
          <p className="text-sm text-slate-500">
            Top barrios según: {labelIndicador}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {barriosOrdenados.map((barrio, index) => {
          const valor = barrio[indicadorActivo];
          const porcentaje = (valor / valorMaximo) * 100;

          return (
            <button
              key={barrio.BARRIO}
              className="ranking-row"
              onClick={() => onBarrioClick(barrio)}
               className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-500 transition-all text-left"
            >
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
                {index + 1}
              </span>

            <div className="flex-1">
              <div className="flex justify-between mb-1">
                  <strong className="text-sm text-slate-800">{barrio.nombre}</strong>
                  <span className="text-sm font-bold text-blue-600">{formatearValor(indicadorActivo, valor)}</span>
                </div>

                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}