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
    <section className="ranking-card">
      <div className="ranking-header">
        <div>
          <h2>Ranking de barrios</h2>
          <p>Top barrios según: {labelIndicador}</p>
        </div>
      </div>

      <div className="ranking-list">
        {barriosOrdenados.map((barrio, index) => {
          const valor = barrio[indicadorActivo];
          const porcentaje = (valor / valorMaximo) * 100;

          return (
            <button
              key={barrio.BARRIO}
              className="ranking-row"
              onClick={() => onBarrioClick(barrio)}
            >
              <span className="ranking-position">{index + 1}</span>

              <div className="ranking-info">
                <div className="ranking-top-line">
                  <strong>{barrio.nombre}</strong>
                  <span>{formatearValor(indicadorActivo, valor)}</span>
                </div>

                <div className="ranking-bar">
                  <div
                    className="ranking-bar-fill"
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