/* Dashboard · lee 10_dashboard_mercado.json, 03_ohlcv_sintetico_120d.json,
   05_clasificadores_binarios.json (consenso) y 06_regresores_precio_30d.json (proyección). */
addI18n({
  es: { "d.title": "Dashboard de mercado", "d.lead": "Resumen del universo de 26 activos, velas de las últimas 120 sesiones sintéticas y, por activo, la señal de los clasificadores y la proyección de los regresores.",
    "d.kpis": "Referencias de mercado", "d.candles": "Velas del activo (últimas 120 sesiones)", "d.asset": "Activo", "d.date": "Fecha", "d.open": "Apertura", "d.high": "Máximo",
    "d.low": "Mínimo", "d.close": "Cierre", "d.vol": "Volumen", "d.universe": "Universo de 26 activos", "d.filter": "Filtrar por grupo",
    "d.cap": "Variaciones, riesgo y señales del sistema (datos sintéticos)", "d.ticker": "Ticker", "d.group": "Grupo", "d.last": "Último (US$)",
    "d.v1d": "1 d", "d.v1m": "1 m", "d.v3m": "3 m", "d.volA": "Vol. anual", "d.beta": "Beta", "d.sig": "Consenso 30 s", "d.proj": "Proyección 30 s", "d.watch": "Watchlist",
    "d.today": "hoy", "d.chartAria": "Gráfico de velas de {t}: últimas 120 sesiones sintéticas, del {a} al {b}. Último cierre {c}.",
    "d.alt": "Últimas 15 sesiones de {t}", "d.ma": "Media móvil 20", "d.showAsset": "Ver {t} en el gráfico", "d.votes": "{v}/18" },
  en: { "d.title": "Market dashboard", "d.lead": "Overview of the 26-asset universe, candles of the last 120 synthetic sessions and, per asset, the classifiers' signal and the regressors' projection.",
    "d.kpis": "Market benchmarks", "d.candles": "Asset candles (last 120 sessions)", "d.asset": "Asset", "d.date": "Date", "d.open": "Open", "d.high": "High",
    "d.low": "Low", "d.close": "Close", "d.vol": "Volume", "d.universe": "Universe of 26 assets", "d.filter": "Filter by group",
    "d.cap": "Changes, risk and system signals (synthetic data)", "d.ticker": "Ticker", "d.group": "Group", "d.last": "Last (US$)",
    "d.v1d": "1 d", "d.v1m": "1 m", "d.v3m": "3 m", "d.volA": "Annual vol.", "d.beta": "Beta", "d.sig": "30-s consensus", "d.proj": "30-s projection", "d.watch": "Watchlist",
    "d.today": "today", "d.chartAria": "Candlestick chart of {t}: last 120 synthetic sessions, from {a} to {b}. Last close {c}.",
    "d.alt": "Last 15 sessions of {t}", "d.ma": "20-day moving average", "d.showAsset": "Show {t} in the chart", "d.votes": "{v}/18" }
});

let D, O, C, R, ROWS, WDEF;
window.init = async () => {
  [D, O, C, R, WDEF] = await Promise.all([loadJSON("10_dashboard_mercado.json"), loadJSON("03_ohlcv_sintetico_120d.json"),
    loadJSON("05_clasificadores_binarios.json"), loadJSON("06_regresores_precio_30d.json"), watchDefault()]);
  // Una fila por activo: el precio vive en un solo lugar (10_dashboard) y se cruza con 05 y 06
  ROWS = D.map(d => ({ ...d, votos: C.predicciones[d.ticker].votos_sube, consenso: C.predicciones[d.ticker].consenso,
    ret30: R.predicciones[d.ticker].retorno_proyectado_30d_pct }));
  $("#kpis").innerHTML = ["SPY", "QQQ", "EPU"].map(tk => {
    const d = D.find(x => x.ticker === tk);
    return `<div class="card kpi"><div class="mut">${tk} · ${d.nombre}</div><div class="v">${fmt.usd(d.ultimo)}</div><div>${chg(d.var_1d_pct)} ${t("d.today")}</div></div>`;
  }).join("");
  $("#sel").innerHTML = D.map(d => `<option value="${d.ticker}">${d.ticker} · ${d.nombre}</option>`).join("");
  const tk = State.ticker("SPY"); $("#sel").value = D.some(d => d.ticker === tk) ? tk : "SPY";
  $("#grp").innerHTML = `<option value="">${t("all")}</option>` + [...new Set(D.map(d => d.grupo))].map(g => `<option value="${g}">${groupLabel(g)}</option>`).join("");
  $("#sel").addEventListener("change", () => { State.setTicker($("#sel").value); draw(); });
  $("#grp").addEventListener("change", () => table(filtered()));
  $("#onlyW").addEventListener("change", () => table(filtered()));
  sortable($("#uni"), filtered, table);
  table(filtered()); draw();
  window.onTheme = draw;
};
function filtered() {
  const g = $("#grp").value, w = State.watch(WDEF), only = $("#onlyW").checked;
  return ROWS.filter(d => (!g || d.grupo === g) && (!only || w.includes(d.ticker)));
}
function table(rows) {
  const w = State.watch(WDEF);
  $("#tb").innerHTML = rows.map(d => {
    const on = w.includes(d.ticker);
    return `<tr><th scope="row"><button type="button" class="link" data-show="${d.ticker}" aria-label="${t("d.showAsset", { t: d.ticker })}">${d.ticker}</button></th>
    <td class="l">${groupLabel(d.grupo)}</td><td>${fmt.n(d.ultimo)}</td><td>${chg(d.var_1d_pct)}</td><td>${chg(d.var_1m_pct)}</td><td>${chg(d.var_3m_pct)}</td>
    <td>${fmt.pctU(d.volatilidad_anual_pct)}</td><td>${fmt.n(d.beta_vs_SPY)}</td>
    <td><a href="clasificacion.html?t=${d.ticker}">${sig(d.consenso)}</a> <span class="mut small">${t("d.votes", { v: d.votos })}</span></td>
    <td><a href="regresion.html?t=${d.ticker}">${chg(d.ret30)}</a></td>
    <td><button type="button" class="star" data-w="${d.ticker}" aria-pressed="${on}" aria-label="${t(on ? "watch.del" : "watch.add", { t: d.ticker })}">${on ? "★" : "☆"}</button></td></tr>`;
  }).join("");
  $$("[data-show]").forEach(b => b.onclick = () => { $("#sel").value = b.dataset.show; State.setTicker(b.dataset.show); draw(); $("#h-velas").scrollIntoView({ behavior: "smooth" }); });
  $$("[data-w]").forEach(b => b.onclick = () => { State.toggleWatch(b.dataset.w, WDEF); table(filtered()); $(`[data-w="${b.dataset.w}"]`)?.focus(); });
}
function draw() {
  const tk = $("#sel").value, s = O.series[tk], p = palette(), n = O.fechas.length;
  $("#links").innerHTML = `<a class="btn" href="clasificacion.html?t=${tk}">${t("nav.clasificacion")}: ${tk}</a><a class="btn" href="regresion.html?t=${tk}">${t("nav.regresion")}: ${tk}</a>`;
  $("#chart").setAttribute("aria-label", t("d.chartAria", { t: tk, a: fmt.date(O.fechas[0]), b: fmt.date(O.fechas[n - 1]), c: fmt.usd(s.c[n - 1]) }));
  // Media móvil de 20 sesiones derivada de los cierres del JSON 03 (campo derivado, declarado en el informe)
  const ma = s.c.map((_, i) => i < 19 ? null : +(s.c.slice(i - 19, i + 1).reduce((a, b) => a + b, 0) / 20).toFixed(2));
  makeChart($("#chart"), {
    tooltip: Object.assign({ trigger: "axis", axisPointer: { type: "cross" } }, tip()),
    legend: { data: [tk, t("d.ma")], textStyle: { color: p.fg }, top: 0 },
    grid: [{ left: 60, right: 18, top: 32, height: "58%" }, { left: 60, right: 18, top: "76%", height: "12%" }],
    xAxis: [axis({ type: "category", data: O.fechas.map(fmt.dshort), boundaryGap: true }), axis({ type: "category", gridIndex: 1, data: O.fechas.map(fmt.dshort), axisLabel: { show: false } })],
    yAxis: [axis({ scale: true, name: "US$" }), axis({ gridIndex: 1, scale: true, axisLabel: { show: false }, splitLine: { show: false } })],
    dataZoom: [{ type: "inside", xAxisIndex: [0, 1] }, { type: "slider", xAxisIndex: [0, 1], height: 16, bottom: 4 }],
    series: [
      { type: "candlestick", name: tk, data: s.o.map((o, i) => [o, s.c[i], s.l[i], s.h[i]]), itemStyle: { color: p.up, color0: p.dn, borderColor: p.up, borderColor0: p.dn } },
      { type: "line", name: t("d.ma"), data: ma, showSymbol: false, lineStyle: { width: 1.6, color: p.ac } },
      { type: "bar", name: t("d.vol"), xAxisIndex: 1, yAxisIndex: 1, data: s.v, itemStyle: { color: p.mut, opacity: .5 } }]
  });
  $("#altC").textContent = t("d.alt", { t: tk });
  $("#altT tbody").innerHTML = O.fechas.slice(-15).map((f, j) => { const i = n - 15 + j;
    return `<tr><th scope="row">${fmt.date(f)}</th><td>${fmt.n(s.o[i])}</td><td>${fmt.n(s.h[i])}</td><td>${fmt.n(s.l[i])}</td><td>${fmt.n(s.c[i])}</td><td>${fmt.n(s.v[i], 0)}</td></tr>`; }).join("");
}
