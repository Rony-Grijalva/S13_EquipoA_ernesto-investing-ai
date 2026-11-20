/* Backtesting · lee 09_backtesting_portafolios.json (curvas, drawdown, métricas, rebalanceos y referencias),
   05_clasificadores_binarios.json y 07_optimizador_markowitz_nsga.json (para explicar el resultado).
   La interpretación se redacta desde los números leídos: NO hay conclusiones fijas en el código
   y los resultados se muestran tal como salieron (sin ajustar datos ni parámetros). */
addI18n({
  es: { "b.title": "Backtesting de portafolios", "b.interp": "Interpretación (generada a partir de las métricas)", "b.equity": "Curvas de capital (base 100)",
    "b.showS": "Series mostradas", "b.dd": "Drawdown (caída desde el máximo previo)", "b.alt": "Ver las curvas en una tabla (cierre de cada mes)",
    "b.altCap": "Valor de cada curva (base 100) al cierre de cada bloque de 21 sesiones", "b.metrics": "Métricas del periodo",
    "b.metCap": "Retorno, riesgo y eficiencia de las 3 carteras frente a las 4 referencias", "b.series": "Serie", "b.kind": "Tipo", "b.ret": "Retorno total",
    "b.vol": "Volatilidad", "b.mdd": "Máx. drawdown", "b.pos": "Meses positivos", "b.vsSpy": "vs. SPY", "b.reb": "Línea de tiempo de rebalanceos", "b.cart": "Cartera",
    "b.kCart": "Cartera del sistema", "b.kRef": "Referencia",
    "b.lead": "Método leído del JSON: {m} Periodo: {a} a {b} ({n} sesiones).",
    "b.i1": "Resultado: {k} de las 3 carteras superaron al SPY en el periodo. SPY rindió {spy}; {list}.",
    "b.iRow": "{c} {r} ({d} frente a SPY, Sharpe {s})",
    "b.i2": "Ninguna cartera tuvo mejor relación retorno/riesgo que el mercado: el mejor Sharpe de las carteras fue {bs} frente a {ss} del SPY, y su máxima caída llegó a {dd} (SPY: {sdd}).",
    "b.i2b": "Al menos una cartera tuvo mejor relación retorno/riesgo que el mercado (Sharpe {bs} frente a {ss} del SPY).",
    "b.i3": "¿Por qué pudo ocurrir? (1) Las señales que eligen los activos tienen poco poder predictivo: los clasificadores aciertan entre {amin} y {amax}, casi como una moneda, y los datos sintéticos tienen poca persistencia, así que el filtro de momentum de {mom} sesiones persigue tendencias que se revierten. (2) La rotación es alta: el turnover medio por rebalanceo es de {to}, y con {pb} pb de comisión eso cuesta del orden de {cost} al año (estimación derivada: turnover × 12 rebalanceos × comisión). (3) Concentración: hasta {cap} en un solo activo, frente a la diversificación amplia de SPY o del portafolio 1/N.",
    "b.i4": "Lectura correcta: es una consecuencia legítima de datos con poca persistencia; no se corrigió manipulando datos ni parámetros para que la estrategia «gane». El desempeño pasado no garantiza resultados futuros.",
    "b.obsCap": "Observación de los datos: en los rebalanceos de {c} el peso máximo llega a {w}, por encima del tope de {tope} del Optimizador. Se muestra tal como viene en el JSON.",
    "b.verif": "Verificación automática: el último valor de cada curva coincide con su retorno total con una diferencia máxima de {d} puntos porcentuales (tolerancia 0,05).",
    "b.turn": "Turnover medio por rebalanceo: {to} · {n} rebalanceos", "b.rebAria": "Barras apiladas con los pesos de la cartera {c} en cada uno de sus {n} rebalanceos.",
    "b.eqAria": "Curvas de capital base 100 de {n} series entre {a} y {b}. Final: {list}.", "b.ddAria": "Curvas de drawdown en porcentaje; la peor caída fue {w} en {c}.",
    "b.date": "Fecha" },
  en: { "b.title": "Portfolio backtesting", "b.interp": "Interpretation (generated from the metrics)", "b.equity": "Equity curves (base 100)",
    "b.showS": "Series shown", "b.dd": "Drawdown (fall from the previous peak)", "b.alt": "View the curves as a table (end of each month)",
    "b.altCap": "Value of each curve (base 100) at the end of each 21-session block", "b.metrics": "Period metrics",
    "b.metCap": "Return, risk and efficiency of the 3 portfolios versus the 4 benchmarks", "b.series": "Series", "b.kind": "Type", "b.ret": "Total return",
    "b.vol": "Volatility", "b.mdd": "Max drawdown", "b.pos": "Positive months", "b.vsSpy": "vs. SPY", "b.reb": "Rebalancing timeline", "b.cart": "Portfolio",
    "b.kCart": "System portfolio", "b.kRef": "Benchmark",
    "b.lead": "Method read from the JSON: {m} Period: {a} to {b} ({n} sessions).",
    "b.i1": "Result: {k} of the 3 portfolios beat SPY over the period. SPY returned {spy}; {list}.",
    "b.iRow": "{c} {r} ({d} versus SPY, Sharpe {s})",
    "b.i2": "No portfolio had a better risk/return ratio than the market: the best portfolio Sharpe was {bs} versus {ss} for SPY, and its worst drawdown reached {dd} (SPY: {sdd}).",
    "b.i2b": "At least one portfolio had a better risk/return ratio than the market (Sharpe {bs} versus {ss} for SPY).",
    "b.i3": "Why could this happen? (1) The signals that pick the assets have little predictive power: the classifiers are right between {amin} and {amax}, close to a coin flip, and the synthetic data have little persistence, so the {mom}-session momentum filter chases trends that reverse. (2) Turnover is high: the average turnover per rebalancing is {to}, and with a {pb} bp commission that costs roughly {cost} per year (derived estimate: turnover × 12 rebalancings × commission). (3) Concentration: up to {cap} in a single asset, versus the broad diversification of SPY or the 1/N portfolio.",
    "b.i4": "Correct reading: this is a legitimate consequence of data with little persistence; it was not fixed by manipulating data or parameters so that the strategy “wins”. Past performance does not guarantee future results.",
    "b.obsCap": "Data note: in the {c} rebalancings the maximum weight reaches {w}, above the Optimizer's {tope} cap. It is shown as it comes in the JSON.",
    "b.verif": "Automatic check: the last value of each curve matches its total return with a maximum difference of {d} percentage points (tolerance 0.05).",
    "b.turn": "Average turnover per rebalancing: {to} · {n} rebalancings", "b.rebAria": "Stacked bars with the weights of the {c} portfolio at each of its {n} rebalancings.",
    "b.eqAria": "Base-100 equity curves of {n} series between {a} and {b}. End values: {list}.", "b.ddAria": "Drawdown curves in percent; the worst fall was {w} in {c}.",
    "b.date": "Date" }
});

const OFF_KEY = "eia_bt_ocultas";
let B, C, O, SERIES, WL = [];
window.init = async () => {
  WL = await watchNow();
  [B, C, O] = await Promise.all([loadJSON("09_backtesting_portafolios.json"), loadJSON("05_clasificadores_binarios.json"), loadJSON("07_optimizador_markowitz_nsga.json")]);
  $("#lead").textContent = t("b.lead", { m: B.metodo, a: fmt.date(B.periodo.inicio), b: fmt.date(B.periodo.fin), n: B.periodo.sesiones });
  // Drawdown de las referencias derivado de su curva (máximo acumulado); las carteras lo traen en el JSON
  const ddOf = c => { let m = -Infinity; return c.map(v => { m = Math.max(m, v); return +((v / m - 1) * 100).toFixed(3); }); };
  SERIES = [...Object.entries(B.carteras).map(([k, v]) => ({ name: k, kind: "c", curva: v.curva, dd: v.drawdown, m: v.metricas, reb: v.rebalanceos, to: v.turnover_medio })),
    ...Object.entries(B.referencias).map(([k, v]) => ({ name: k, kind: "r", curva: v.curva, dd: ddOf(v.curva), m: v.metricas }))];
  const spy = SERIES.find(s => s.name === "SPY");
  SERIES.forEach(s => Object.assign(s, s.m, { kindL: s.kind === "c" ? t("b.kCart") : t("b.kRef"), vsSPY: +(s.m.retorno_total_pct - spy.m.retorno_total_pct).toFixed(2) }));
  $("#toggles").innerHTML = SERIES.map((s, i) => `<label class="chk"><input type="checkbox" data-s="${s.name}"> ${s.kind === "c" ? "━" : "┅"} ${s.name}</label>`).join("");
  $$("[data-s]").forEach(cb => { cb.checked = !(store(OFF_KEY) || []).includes(cb.dataset.s); cb.onchange = () => { const off = $$("[data-s]").filter(x => !x.checked).map(x => x.dataset.s); store(OFF_KEY, off); charts(); }; });
  $("#cart").innerHTML = Object.keys(B.carteras).map(k => `<option>${k}</option>`).join("");
  $("#cart").addEventListener("change", reb);
  sortable($("#met"), () => SERIES.map(s => ({ ...s, kind: s.kindL })), metrics);
  interpret(); metrics(SERIES.map(s => ({ ...s, kind: s.kindL }))); charts(); reb(); altTable();
  window.onTheme = () => { charts(); reb(); };
};
function lineStyle(s, i, p) { return s.kind === "c" ? { width: 3, color: p.series[[1, 0, 2][i]] } : { width: 1.6, type: [ "dashed", "dotted", "dashdot", "dashed"][i - 3] || "dashed", color: p.series[[6, 4, 3, 5][i - 3]] }; }
function charts() {
  const p = palette(), x = B.fechas.map(f => f === "inicio" ? fmt.dshort(B.periodo.inicio) : fmt.dshort(f)), on = $$("[data-s]").filter(c => c.checked).map(c => c.dataset.s);
  const vis = SERIES.map((s, i) => ({ s, i })).filter(o => on.includes(o.s.name));
  const n = B.fechas.length;
  $("#eq").setAttribute("aria-label", t("b.eqAria", { n: vis.length, a: fmt.date(B.periodo.inicio), b: fmt.date(B.periodo.fin), list: vis.map(o => `${o.s.name} ${fmt.n(o.s.curva[n - 1], 1)}`).join(", ") }));
  const mk = (key) => vis.map(({ s, i }) => ({ type: "line", name: s.name, data: s[key], showSymbol: false, lineStyle: lineStyle(s, i, p), itemStyle: { color: lineStyle(s, i, p).color },
    endLabel: { show: key === "curva", formatter: d => `${s.name} ${fmt.n(d.value, 1)}`, color: p.fg, fontSize: 11 }, labelLayout: { moveOverlap: "shiftY" }, emphasis: { focus: "series" } }));
  const base = { tooltip: Object.assign({ trigger: "axis", valueFormatter: v => fmt.n(v, 2) }, tip()), legend: { type: "scroll", top: 0, textStyle: { color: p.fg } },
    xAxis: axis({ type: "category", data: x, boundaryGap: false }), dataZoom: [{ type: "inside" }] };
  makeChart($("#eq"), Object.assign({}, base, { grid: { left: 50, right: 150, top: 34, bottom: 30 }, yAxis: axis({ scale: true, name: "Base 100" }),
    series: mk("curva").concat([{ type: "line", data: [], markLine: { symbol: "none", silent: true, label: { show: false }, lineStyle: { color: p.mut, type: "dashed" }, data: [{ yAxis: 100 }] } }]) }));
  const worst = vis.reduce((a, o) => Math.min(...o.s.dd) < a.v ? { v: Math.min(...o.s.dd), c: o.s.name } : a, { v: 0, c: "" });
  $("#dd").setAttribute("aria-label", t("b.ddAria", { w: fmt.pct(worst.v), c: worst.c }));
  makeChart($("#dd"), Object.assign({}, base, { grid: { left: 50, right: 20, top: 34, bottom: 30 }, yAxis: axis({ name: "%", max: 0 }), series: mk("dd") }));
}
function interpret() {
  const spy = SERIES.find(s => s.name === "SPY"), carts = SERIES.filter(s => s.kind === "c"), k = carts.filter(s => s.m.retorno_total_pct > spy.m.retorno_total_pct).length;
  const acc = C.modelos.map(m => m.exactitud * 100), bs = Math.max(...carts.map(s => s.m.sharpe)), to = carts.reduce((a, s) => a + s.to, 0) / carts.length;
  const cap = Math.max(...carts.flatMap(s => s.reb.map(r => Math.max(...Object.values(r.pesos)))));
  const list = carts.map(s => t("b.iRow", { c: `<strong>${s.name}</strong>`, r: chg(s.m.retorno_total_pct), d: fmt.pct(s.m.retorno_total_pct - spy.m.retorno_total_pct).replace(" %", " pp"), s: fmt.n(s.m.sharpe, 2) })).join("; ");
  let html = `<p>${t("b.i1", { k, spy: chg(spy.m.retorno_total_pct), list })}</p>`;
  html += `<p>${bs < spy.m.sharpe ? t("b.i2", { bs: fmt.n(bs, 2), ss: fmt.n(spy.m.sharpe, 2), dd: fmt.pct(Math.min(...carts.map(s => s.m.max_drawdown_pct))), sdd: fmt.pct(spy.m.max_drawdown_pct) }) : t("b.i2b", { bs: fmt.n(bs, 2), ss: fmt.n(spy.m.sharpe, 2) })}</p>`;
  // Parámetros del método leídos del texto «metodo» del JSON (no se escriben a mano)
  const mom = (B.metodo.match(/momentum a (\d+)/i) || [])[1] || "?", pb = +((B.metodo.match(/comision (\d+(?:[.,]\d+)?) pb/i) || [])[1] || 0);
  html += `<p>${t("b.i3", { amin: fmt.pctU(Math.min(...acc)), amax: fmt.pctU(Math.max(...acc)), mom, pb: fmt.n(pb, 0), to: fmt.pctU(to * 100, 0), cost: fmt.pctU(to * 12 * pb / 100, 2), cap: fmt.pctU(cap * 100, 0) })}</p>`;
  html += `<p><strong>${t("b.i4")}</strong></p>`;
  carts.forEach(s => { const mx = Math.max(...s.reb.map(r => Math.max(...Object.values(r.pesos)))); if (mx > O.tope_peso_por_activo + 1e-9) html += `<p class="aviso small">${t("b.obsCap", { c: s.name, w: fmt.pctU(mx * 100, 0), tope: fmt.pctU(O.tope_peso_por_activo * 100, 0) })}</p>`; });
  $("#interp").innerHTML = html;
  // Verificación pedida en la guía: curva final/100 − 1 ≈ retorno_total_pct (±0,05 pp)
  const d = Math.max(...SERIES.map(s => Math.abs((s.curva[s.curva.length - 1] / 100 - 1) * 100 - s.m.retorno_total_pct)));
  $("#verif").textContent = t("b.verif", { d: fmt.n(d, 3) }) + (d <= 0.05 ? " ✔" : " ✘");
}
function metrics(rows) {
  $("#met tbody").innerHTML = rows.map(s => `<tr${s.kindL === t("b.kCart") ? ' style="font-weight:600"' : ""}><th scope="row" class="l">${s.name}</th><td class="l">${s.kindL}</td>
    <td>${chg(s.retorno_total_pct)}</td><td>${fmt.pct(s.cagr_pct)}</td><td>${fmt.pctU(s.volatilidad_anual_pct, 2)}</td><td>${fmt.n(s.sharpe, 3)}</td>
    <td>${fmt.pct(s.max_drawdown_pct)}</td><td>${fmt.n(s.calmar, 3)}</td><td>${fmt.pctU(s.meses_positivos_pct)}</td><td>${s.name === "SPY" ? "—" : chg(s.vsSPY).replace(" %", " pp")}</td></tr>`).join("");
}
function reb() {
  const c = $("#cart").value, s = SERIES.find(x => x.name === c), p = palette();
  const tks = [...new Set(s.reb.flatMap(r => Object.keys(r.pesos)))];
  $("#turn").textContent = t("b.turn", { to: fmt.pctU(s.to * 100, 1), n: s.reb.length });
  $("#rebChart").setAttribute("aria-label", t("b.rebAria", { c, n: s.reb.length }));
  makeChart($("#rebChart"), {
    tooltip: Object.assign({ trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: v => v ? fmt.pctU(v, 1) : "—" }, tip()),
    legend: { type: "scroll", top: 0, textStyle: { color: p.fg } }, grid: { left: 46, right: 16, top: 36, bottom: 30 },
    xAxis: axis({ type: "category", data: s.reb.map(r => fmt.dshort(r.fecha)) }), yAxis: axis({ max: 100, axisLabel: { color: p.mut, formatter: "{value} %" } }),
    color: [...p.series, "#7a5c3a", "#3a6b7a", "#7a3a5c", "#5c7a3a", "#3a3a7a", "#9c6b00"],
    series: tks.map(tk => ({ type: "bar", stack: "w", name: tk, data: s.reb.map(r => r.pesos[tk] ? +(r.pesos[tk] * 100).toFixed(1) : 0) }))
  });
  $("#tl").innerHTML = s.reb.map(r => `<li><strong>${fmt.date(r.fecha)}</strong> · ${Object.entries(r.pesos).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<span class="tag">${star(k, WL)}${k} ${fmt.pctU(v * 100)}</span>`).join(" ")}</li>`).join("");
}
function altTable() {
  const idx = B.fechas.map((_, i) => i).filter(i => i === 0 || i % 21 === 0 || i === B.fechas.length - 1);
  $("#altT thead").innerHTML = `<tr><th scope="col">${t("b.date")}</th>${SERIES.map(s => `<th scope="col">${s.name}</th>`).join("")}</tr>`;
  $("#altT tbody").innerHTML = idx.map(i => `<tr><th scope="row">${B.fechas[i] === "inicio" ? fmt.date(B.periodo.inicio) : fmt.date(B.fechas[i])}</th>${SERIES.map(s => `<td>${fmt.n(s.curva[i], 1)}</td>`).join("")}</tr>`).join("");
}
