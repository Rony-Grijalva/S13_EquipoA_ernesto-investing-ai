/* Optimizador · lee 07_optimizador_markowitz_nsga.json (fronteras y frentes YA calculados: no se recalcula nada),
   05_clasificadores_binarios.json y 06_regresores_precio_30d.json (solo para explicar por qué un activo es elegible). */
addI18n({
  es: { "o.title": "Optimizador: Markowitz, NSGA-II y NSGA-III", "o.elig": "Activos elegibles", "o.chart": "Riesgo (X) frente a retorno (Y)", "o.series": "Series",
    "o.mk": "Curva de Markowitz", "o.front": "Frontera de Markowitz", "o.onlyEl": "Solo elegibles", "o.full": "Universo completo (26)",
    "o.clickHint": "Haga clic en un punto para ver su composición. Con teclado, use la tabla de puntos de abajo (botón «Ver»).", "o.point": "Portafolio seleccionado",
    "o.explain": "¿Qué optimiza cada método?", "o.exMk": "Para cada nivel de riesgo busca la combinación de pesos con el mayor retorno esperado (media–varianza). Es una frontera exacta, calculada con un optimizador matemático.",
    "o.exN2": "Algoritmo genético multiobjetivo con 2 objetivos: maximizar el retorno y minimizar la volatilidad. Entrega un «frente» de soluciones no dominadas.",
    "o.exN3": "Variante para 3 o más objetivos: además del retorno y la volatilidad minimiza el CVaR 95 % (la pérdida media en el 5 % de los peores días). El color de sus puntos indica ese CVaR.",
    "o.table": "Tabla de puntos (alternativa accesible al gráfico)", "o.tabCap": "Puntos de las fronteras y frentes: retorno, volatilidad, Sharpe y CVaR",
    "o.method": "Método", "o.retS": "Retorno", "o.volS": "Volatilidad", "o.view": "Composición", "o.see": "Ver", "o.tabSum": "Ver la tabla de {n} puntos visibles",
    "o.lead": "Combina los dos módulos anteriores: solo entran los activos que los clasificadores marcan SUBE y cuya regresión proyecta un precio mayor a 30 sesiones. Tope de {tope} por activo y tasa libre de riesgo de {rf}.",
    "o.crit": "Criterio leído del JSON: «{c}». Pulse un activo para ver su regresión.",
    "o.chip": "{t}: {v}/18 SUBE · {r}", "o.inTk": "{t} es elegible: votos SUBE {v}/18 y proyección {r}. Los puntos que lo incluyen están en la tabla de abajo.",
    "o.outTk": "{t} NO es elegible: consenso {s} ({v}/18) y proyección {r}. Por eso no aparece en las carteras de elegibles.",
    "o.why": "¿Por qué los frentes NSGA quedan ligeramente por debajo de la curva de Markowitz? Markowitz resuelve el problema de forma exacta, mientras que NSGA-II/III son búsquedas evolutivas aproximadas: con un número finito de generaciones se acercan a la frontera sin alcanzarla. Además, NSGA-III reparte sus soluciones entre tres objetivos, de modo que acepta algo menos de retorno a cambio de menor CVaR. En este conjunto, el mejor Sharpe es {mk} en Markowitz, {n2} en NSGA-II y {n3} en NSGA-III.",
    "o.mkS": "Markowitz", "o.n2S": "NSGA-II", "o.n3S": "NSGA-III", "o.selS": "Seleccionado",
    "o.sum": "Suma de pesos: {s} {ok}", "o.max": "Peso máximo: {m} (tope {tope}) {ok}", "o.w": "Composición (pesos)",
    "o.chartAria": "Gráfico de dispersión riesgo–retorno: curva de Markowitz ({n0} puntos), frente NSGA-II ({n1}) y NSGA-III ({n2}, color según CVaR). Volatilidad en el eje X y retorno esperado en el eje Y.",
    "o.toPort": "Ver los 3 niveles de riesgo en Portafolios →", "o.cvarAxis": "CVaR 95 % diario" },
  en: { "o.title": "Optimizer: Markowitz, NSGA-II and NSGA-III", "o.elig": "Eligible assets", "o.chart": "Risk (X) versus return (Y)", "o.series": "Series",
    "o.mk": "Markowitz curve", "o.front": "Markowitz frontier", "o.onlyEl": "Eligible only", "o.full": "Full universe (26)",
    "o.clickHint": "Click a point to see its composition. With the keyboard, use the points table below (“View” button).", "o.point": "Selected portfolio",
    "o.explain": "What does each method optimize?", "o.exMk": "For each risk level it finds the weight mix with the highest expected return (mean–variance). It is an exact frontier, computed with a mathematical optimizer.",
    "o.exN2": "Multi-objective genetic algorithm with 2 objectives: maximize return and minimize volatility. It yields a “front” of non-dominated solutions.",
    "o.exN3": "Variant for 3 or more objectives: besides return and volatility it minimizes CVaR 95 % (the mean loss on the worst 5 % of days). The color of its points shows that CVaR.",
    "o.table": "Points table (accessible alternative to the chart)", "o.tabCap": "Points of the frontiers and fronts: return, volatility, Sharpe and CVaR",
    "o.method": "Method", "o.retS": "Return", "o.volS": "Volatility", "o.view": "Composition", "o.see": "View", "o.tabSum": "View the table of {n} visible points",
    "o.lead": "It combines the two previous modules: only assets that the classifiers mark UP and whose regression projects a higher price in 30 sessions are included. Cap of {tope} per asset and a {rf} risk-free rate.",
    "o.crit": "Criterion read from the JSON: “{c}”. Press an asset to see its regression.",
    "o.chip": "{t}: {v}/18 UP · {r}", "o.inTk": "{t} is eligible: UP votes {v}/18 and projection {r}. Points that include it are in the table below.",
    "o.outTk": "{t} is NOT eligible: consensus {s} ({v}/18) and projection {r}. That is why it is not in the eligible portfolios.",
    "o.why": "Why are the NSGA fronts slightly below the Markowitz curve? Markowitz solves the problem exactly, while NSGA-II/III are approximate evolutionary searches: with a finite number of generations they approach the frontier without reaching it. Moreover, NSGA-III spreads its solutions across three objectives, so it accepts a bit less return in exchange for a lower CVaR. In this data set the best Sharpe is {mk} for Markowitz, {n2} for NSGA-II and {n3} for NSGA-III.",
    "o.mkS": "Markowitz", "o.n2S": "NSGA-II", "o.n3S": "NSGA-III", "o.selS": "Selected",
    "o.sum": "Sum of weights: {s} {ok}", "o.max": "Max weight: {m} (cap {tope}) {ok}", "o.w": "Composition (weights)",
    "o.chartAria": "Risk–return scatter chart: Markowitz curve ({n0} points), NSGA-II front ({n1}) and NSGA-III ({n2}, colored by CVaR). Volatility on the X axis and expected return on the Y axis.",
    "o.toPort": "See the 3 risk levels in Portfolios →", "o.cvarAxis": "Daily CVaR 95 %" }
});

let O, C, R, PTS, cur, ch, WL = [];
window.init = async () => {
  [O, C, R] = await Promise.all([loadJSON("07_optimizador_markowitz_nsga.json"), loadJSON("05_clasificadores_binarios.json"), loadJSON("06_regresores_precio_30d.json")]);
  $("#lead").textContent = t("o.lead", { tope: fmt.pctU(O.tope_peso_por_activo * 100, 0), rf: fmt.pctU(O.tasa_libre_riesgo * 100, 0) });
  $("#crit").textContent = t("o.crit", { c: O.criterio_elegibilidad });
  const W = WL = await watchNow();
  $("#eligList").innerHTML = O.elegibles.map(tk => `<a class="btn" href="regresion.html?t=${tk}">${star(tk, W)}${t("o.chip", { t: tk, v: C.predicciones[tk].votos_sube, r: fmt.pct(R.predicciones[tk].retorno_proyectado_30d_pct) })}</a>`).join("");
  const q = (QS.get("t") || "").toUpperCase();
  if (q && C.predicciones[q]) {
    const inn = O.elegibles.includes(q), cp = C.predicciones[q], r = fmt.pct(R.predicciones[q].retorno_proyectado_30d_pct);
    $("#fromTk").innerHTML = inn ? `✔ ${t("o.inTk", { t: q, v: cp.votos_sube, r })}` : `✘ ${t("o.outTk", { t: q, s: sig(cp.consenso), v: cp.votos_sube, r })}`;
  }
  const best = k => Math.max(...O[k].map(p => p.sharpe));
  $("#why").textContent = t("o.why", { mk: fmt.n(best("markowitz_elegibles"), 3), n2: fmt.n(best("nsga2_elegibles"), 3), n3: fmt.n(best("nsga3_elegibles"), 3) });
  ["#sMk", "#sN2", "#sN3"].forEach(s => $(s).addEventListener("change", draw));
  $$('input[name="uni"]').forEach(r => r.addEventListener("change", draw));
  sortable($("#pts"), () => PTS, table);
  // Punto inicial: el de mayor Sharpe del frente NSGA-II (origen del portafolio Moderado)
  cur = build().find(p => p.met === "NSGA-II" && p.sharpe === best("nsga2_elegibles"));
  draw(); window.onTheme = draw;
};
const uni = () => $$('input[name="uni"]').find(r => r.checked).value;
/* Lista unificada de puntos visibles (lectura directa del JSON; los ID de Markowitz se numeran para la tabla) */
function build() {
  const out = [];
  if ($("#sMk").checked) O[uni()].forEach((p, i) => out.push({ id: (uni() === "markowitz_elegibles" ? "MK-E" : "MK-U") + String(i + 1).padStart(2, "0"), met: "Markowitz", src: p }));
  if ($("#sN2").checked) O.nsga2_elegibles.forEach(p => out.push({ id: p.id, met: "NSGA-II", src: p }));
  if ($("#sN3").checked) O.nsga3_elegibles.forEach(p => out.push({ id: p.id, met: "NSGA-III", src: p }));
  return out.map(o => ({ ...o, ret: o.src.retorno_esperado_anual_pct, vol: o.src.volatilidad_anual_pct, sharpe: o.src.sharpe, cvar: o.src.cvar95_diario_pct }));
}
function draw() {
  PTS = build(); const p = palette();
  const mk = PTS.filter(x => x.met === "Markowitz").sort((a, b) => a.vol - b.vol), n2 = PTS.filter(x => x.met === "NSGA-II"), n3 = PTS.filter(x => x.met === "NSGA-III");
  const cv = O.nsga3_elegibles.map(x => x.cvar95_diario_pct);
  $("#chart").setAttribute("aria-label", t("o.chartAria", { n0: mk.length, n1: n2.length, n2: n3.length }));
  const ser = [
    { id: "mk", name: t("o.mkS"), type: "line", data: mk.map(x => [x.vol, x.ret, x.id]), symbolSize: 6, lineStyle: { width: 2.5, color: p.fg }, itemStyle: { color: p.fg } },
    { id: "n2", name: t("o.n2S"), type: "scatter", data: n2.map(x => [x.vol, x.ret, x.id]), symbol: "diamond", symbolSize: 10, itemStyle: { color: p.ac, borderColor: p.panel, borderWidth: 1 } },
    { id: "n3", name: t("o.n3S"), type: "scatter", data: n3.map(x => [x.vol, x.ret, x.id, x.cvar]), symbol: "triangle", symbolSize: 10, itemStyle: { borderColor: p.fg, borderWidth: .6 } },
    { id: "sel", name: t("o.selS"), type: "scatter", data: cur ? [[cur.vol, cur.ret, cur.id]] : [], symbol: "circle", symbolSize: 22, itemStyle: { color: "transparent", borderColor: p.dn, borderWidth: 3 }, z: 20, silent: true }];
  ch = makeChart($("#chart"), {
    tooltip: Object.assign({ trigger: "item", formatter: d => `<strong>${d.value[2]}</strong> · ${d.seriesName}<br>${t("o.retS")}: ${fmt.pctU(d.value[1], 2)}<br>${t("o.volS")}: ${fmt.pctU(d.value[0], 2)}${d.value[3] != null ? "<br>CVaR: " + fmt.pctU(d.value[3], 2) : ""}` }, tip()),
    legend: { top: 0, textStyle: { color: p.fg } }, grid: { left: 58, right: 70, top: 34, bottom: 46 },
    xAxis: axis({ type: "value", scale: true, name: t("o.volS") + " (%)", nameLocation: "middle", nameGap: 28 }),
    yAxis: axis({ type: "value", scale: true, name: t("o.retS") + " (%)" }),
    visualMap: { type: "continuous", seriesIndex: 2, dimension: 3, min: Math.min(...cv), max: Math.max(...cv), right: 0, top: "middle", itemHeight: 120, calculable: false,
      text: ["CVaR ↑", "CVaR ↓"], textStyle: { color: p.fg }, inRange: { color: ["#1b7f5a", "#d9a400", "#c0392b"] } },
    series: ser
  });
  if (ch) ch.on("click", d => { if (d.seriesId === "sel") return; select(d.value[2]); });
  $("#tabSum").textContent = t("o.tabSum", { n: PTS.length });
  table(PTS); panel();
}
function select(id) { cur = PTS.find(x => x.id === id) || cur; draw(); $("#ptBox").focus(); }
function table(rows) {
  $("#pts tbody").innerHTML = rows.map(x => `<tr${cur && x.id === cur.id ? ' class="sel"' : ""}><th scope="row" class="l">${x.id}</th><td class="l">${x.met}</td><td>${fmt.pctU(x.ret, 2)}</td>
    <td>${fmt.pctU(x.vol, 2)}</td><td>${fmt.n(x.sharpe, 3)}</td><td>${fmt.pctU(x.cvar, 2)}</td><td><button type="button" data-p="${x.id}" aria-label="${t("o.see")} ${x.id}">${t("o.see")}</button></td></tr>`).join("");
  $$("[data-p]", $("#pts")).forEach(b => b.onclick = () => select(b.dataset.p));
}
function panel() {
  if (!cur) { $("#pt").textContent = ""; return; }
  const w = Object.entries(cur.src.pesos).sort((a, b) => b[1] - a[1]), s = w.reduce((a, x) => a + x[1], 0), mx = Math.max(...w.map(x => x[1]));
  const sumOk = Math.abs(s - 1) <= 0.02, maxOk = mx <= O.tope_peso_por_activo + 1e-9;
  $("#pt").innerHTML = `<p style="margin-top:0"><strong style="font-size:1.15rem">${cur.id}</strong> · ${cur.met}</p>
    <div class="metrics"><div><b>${fmt.pctU(cur.ret, 2)}</b><span>${t("m.ret")}</span></div><div><b>${fmt.pctU(cur.vol, 2)}</b><span>${t("m.vol")}</span></div>
    <div><b>${fmt.n(cur.sharpe, 3)}</b><span>${t("m.sharpe")}</span></div><div><b>${fmt.pctU(cur.cvar, 2)}</b><span>${t("m.cvar")}</span></div></div>
    <h3>${t("o.w")}</h3>
    <ul class="wbars">${w.map(([tk, v]) => `<li><a href="regresion.html?t=${tk}">${star(tk, WL)}${tk}</a><span class="track" aria-hidden="true"><span class="fill" style="width:${v / O.tope_peso_por_activo * 100}%;display:block"></span></span><span class="n">${fmt.pctU(v * 100)}</span></li>`).join("")}</ul>
    <p class="small">${t("o.sum", { s: fmt.pctU(s * 100, 2), ok: sumOk ? '<span class="ok">✔</span>' : '<span class="err">✘</span>' })}<br>
    ${t("o.max", { m: fmt.pctU(mx * 100), tope: fmt.pctU(O.tope_peso_por_activo * 100, 0), ok: maxOk ? '<span class="ok">✔</span>' : '<span class="err">✘</span>' })}</p>
    <a class="btn primary" href="portafolios.html">${t("o.toPort")}</a>`;
}
