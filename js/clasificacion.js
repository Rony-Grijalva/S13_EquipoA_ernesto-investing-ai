/* Clasificación binaria · lee 05_clasificadores_binarios.json (18 modelos, 26 activos),
   01_universo_tickers.json (nombres/grupos) y 06_regresores_precio_30d.json (para el criterio de elegibilidad).
   Regla del sistema: SOLO dos clases, SUBE o BAJA. Ninguna cifra está escrita en el código. */
addI18n({
  es: { "c.title": "Clasificación binaria de tendencia", "c.honest": "¿Qué tan bien lo hace? Honestidad del modelo", "c.heat": "Mapa de calor: activo × modelo",
    "c.family": "Familia de modelos", "c.consensus": "Consenso del activo", "c.cm": "Matriz de confusión", "c.metrics": "Métricas por modelo (periodo de prueba)",
    "c.hideHint": "Desmarque «Mostrar» para ocultar un modelo del mapa de calor (el consenso siempre usa los 18).",
    "c.metCap": "Exactitud, precisión, recall, F1 y AUC de los 18 clasificadores", "c.model": "Modelo", "c.acc": "Exactitud", "c.prec": "Precisión", "c.rec": "Recall",
    "c.delta": "vs. «siempre SUBE»", "c.show": "Mostrar", "c.cmCol": "Matriz", "c.see": "Ver",
    "c.def": "Cada uno de los 18 modelos (11 de Machine Learning y 7 de Deep Learning) responde una sola pregunta: ¿el precio dentro de 30 sesiones será mayor que hoy? Solo hay dos respuestas posibles: ▲ SUBE o ▼ BAJA.",
    "c.hon1": "Los 18 modelos aciertan entre <strong>{min}</strong> y <strong>{max}</strong> de las veces en el periodo de prueba ({n} días).",
    "c.hon2": "Una moneda al aire acertaría el <strong>50 %</strong>. Es decir, el mejor modelo acierta un poco más que una moneda: de cada 100 señales, unas {best} son correctas y {wrong} son errores.",
    "c.hon3": "Además, en ese periodo el <strong>{base}</strong> de los días fueron de subida: una regla trivial que siempre diga «SUBE» acertaría {base}. Solo {k} de 18 modelos superan esa regla.",
    "c.hon4": "Conclusión: use estas señales como una pista débil para explorar, nunca como certeza ni como recomendación de compra.",
    "c.accAria": "Gráfico de barras de la exactitud de los 18 modelos, entre {min} y {max}, con líneas de referencia en 50 % (moneda) y {base} (siempre SUBE).",
    "c.coin": "Moneda 50 %", "c.always": "Siempre SUBE {base}",
    "c.legend.u2": "▲ SUBE con prob. ≥ 0,60", "c.legend.u1": "▲ SUBE 0,50–0,59", "c.legend.d1": "▼ BAJA 0,40–0,49", "c.legend.d2": "▼ BAJA < 0,40",
    "c.heatHint": "Cada celda muestra la señal (palabra y símbolo) y la probabilidad de SUBE; el color solo refuerza. Pulse un ticker para ver su consenso.",
    "c.heatCap": "Probabilidad de SUBE por activo (filas) y modelo (columnas): {r} activos × {c} modelos = {n} celdas",
    "c.asset": "Activo", "c.cons": "Consenso", "c.selAsset": "Ver consenso de {t}",
    "c.votes": "{u} de 18 modelos dicen SUBE y {d} dicen BAJA.", "c.pm": "Probabilidad media de SUBE", "c.conf": "Confianza",
    "c.confExp": "La confianza mide qué tan lejos está la probabilidad media de 0,50: alta si la distancia es ≥ 0,08; media si es ≥ 0,04; baja en otro caso.",
    "c.elig": "Elegible para el Optimizador: {e}", "c.eligWhy": "(requiere consenso SUBE y proyección de regresión a 30 sesiones mayor que 0; proyección de {t}: {r})",
    "c.cmTitle": "{m} · {n} días de prueba", "c.vp": "Verdaderos SUBE (dijo SUBE y subió)", "c.fp": "Falsos SUBE (dijo SUBE y bajó)",
    "c.fn": "Falsos BAJA (dijo BAJA y subió)", "c.vn": "Verdaderos BAJA (dijo BAJA y bajó)", "c.real": "Real", "c.pred": "Predicción",
    "c.cmRead": "De {p} veces que dijo SUBE, acertó {vp} ({prec}). De {r} subidas reales, detectó {vp} ({rec}).", "c.hidden": "Modelo oculto por el usuario" },
  en: { "c.title": "Binary trend classification", "c.honest": "How well does it work? Model honesty", "c.heat": "Heat map: asset × model",
    "c.family": "Model family", "c.consensus": "Asset consensus", "c.cm": "Confusion matrix", "c.metrics": "Metrics per model (test period)",
    "c.hideHint": "Untick “Show” to hide a model from the heat map (the consensus always uses all 18).",
    "c.metCap": "Accuracy, precision, recall, F1 and AUC of the 18 classifiers", "c.model": "Model", "c.acc": "Accuracy", "c.prec": "Precision", "c.rec": "Recall",
    "c.delta": "vs. “always UP”", "c.show": "Show", "c.cmCol": "Matrix", "c.see": "View",
    "c.def": "Each of the 18 models (11 Machine Learning and 7 Deep Learning) answers a single question: will the price 30 sessions from now be higher than today? There are only two possible answers: ▲ UP or ▼ DOWN.",
    "c.hon1": "The 18 models are right between <strong>{min}</strong> and <strong>{max}</strong> of the time in the test period ({n} days).",
    "c.hon2": "A coin flip would be right <strong>50 %</strong> of the time. So the best model is only slightly better than a coin: out of 100 signals, about {best} are correct and {wrong} are wrong.",
    "c.hon3": "Moreover, <strong>{base}</strong> of the days in that period went up: a trivial rule that always says “UP” would be right {base}. Only {k} of 18 models beat that rule.",
    "c.hon4": "Bottom line: use these signals as a weak hint for exploration, never as certainty nor as a buy recommendation.",
    "c.accAria": "Bar chart of the accuracy of the 18 models, between {min} and {max}, with reference lines at 50 % (coin) and {base} (always UP).",
    "c.coin": "Coin 50 %", "c.always": "Always UP {base}",
    "c.legend.u2": "▲ UP with prob. ≥ 0.60", "c.legend.u1": "▲ UP 0.50–0.59", "c.legend.d1": "▼ DOWN 0.40–0.49", "c.legend.d2": "▼ DOWN < 0.40",
    "c.heatHint": "Each cell shows the signal (word and symbol) and the probability of UP; color only reinforces it. Press a ticker to see its consensus.",
    "c.heatCap": "Probability of UP per asset (rows) and model (columns): {r} assets × {c} models = {n} cells",
    "c.asset": "Asset", "c.cons": "Consensus", "c.selAsset": "See consensus of {t}",
    "c.votes": "{u} of 18 models say UP and {d} say DOWN.", "c.pm": "Mean probability of UP", "c.conf": "Confidence",
    "c.confExp": "Confidence measures how far the mean probability is from 0.50: high if the distance is ≥ 0.08; medium if ≥ 0.04; low otherwise.",
    "c.elig": "Eligible for the Optimizer: {e}", "c.eligWhy": "(requires UP consensus and a 30-session regression projection above 0; {t} projection: {r})",
    "c.cmTitle": "{m} · {n} test days", "c.vp": "True UP (said UP and it rose)", "c.fp": "False UP (said UP and it fell)",
    "c.fn": "False DOWN (said DOWN and it rose)", "c.vn": "True DOWN (said DOWN and it fell)", "c.real": "Actual", "c.pred": "Prediction",
    "c.cmRead": "Of {p} times it said UP, it was right {vp} ({prec}). Of {r} actual rises, it caught {vp} ({rec}).", "c.hidden": "Model hidden by the user" }
});

const HIDE_KEY = "eia_cls_ocultos";
let C, U, R, WDEF, MODELS, BASE, sel, selModel;
window.init = async () => {
  [C, U, R, WDEF] = await Promise.all([loadJSON("05_clasificadores_binarios.json"), loadJSON("01_universo_tickers.json"),
    loadJSON("06_regresores_precio_30d.json"), watchDefault()]);
  $("#def").textContent = t("c.def");
  // Tasa base de subidas en la prueba = (VP + FN) / n, derivada de la matriz de confusión (campo derivado declarado)
  const cm0 = C.modelos[0].matriz_confusion; BASE = (cm0.VP + cm0.FN) / C.modelos[0].n_prueba;
  MODELS = C.modelos.map(m => ({ ...m, label: modelLabel(m.modelo), delta: +((m.exactitud - BASE) * 100).toFixed(1) }));
  honest();
  $("#grp").innerHTML = `<option value="">${t("all")}</option>` + [...new Set(U.map(u => u.grupo))].map(g => `<option value="${g}">${groupLabel(g)}</option>`).join("");
  $("#fam").innerHTML = `<option value="">${t("all")}</option><option value="ML">${t("fam.ML")}</option><option value="DL">${t("fam.DL")}</option>`;
  ["#grp", "#fam", "#onlyW"].forEach(s => $(s).addEventListener("change", heat));
  $("#legend").innerHTML = ["u2", "u1", "d1", "d2"].map(k => `<span><i style="background:var(--heat-${k.replace("u", "up").replace("d", "dn")})"></i>${t("c.legend." + k)}</span>`).join("");
  $("#heatHint").textContent = t("c.heatHint");
  const tk = State.ticker("AMZN"); sel = C.predicciones[tk] ? tk : "AMZN";
  selModel = MODELS[0].modelo;
  sortable($("#met"), () => MODELS, metrics);
  heat(); metrics(MODELS); consensus(); confusion();
  window.onTheme = honestChart;
};
const hidden = () => store(HIDE_KEY) || [];
function honest() {
  const acc = MODELS.map(m => m.exactitud), mn = Math.min(...acc), mx = Math.max(...acc), n = C.modelos[0].n_prueba;
  const k = MODELS.filter(m => m.exactitud > BASE).length, best = Math.round(mx * 100);
  $("#honest").innerHTML = `<p>${t("c.hon1", { min: fmt.pctU(mn * 100), max: fmt.pctU(mx * 100), n })}</p><p>${t("c.hon2", { best, wrong: 100 - best })}</p>
    <p>${t("c.hon3", { base: fmt.pctU(BASE * 100), k })}</p><p><strong>${t("c.hon4")}</strong></p>`;
  honestChart();
}
function honestChart() {
  const p = palette(), acc = MODELS.map(m => m.exactitud * 100);
  $("#accChart").setAttribute("aria-label", t("c.accAria", { min: fmt.pctU(Math.min(...acc)), max: fmt.pctU(Math.max(...acc)), base: fmt.pctU(BASE * 100) }));
  makeChart($("#accChart"), {
    tooltip: Object.assign({ trigger: "axis", valueFormatter: v => fmt.pctU(v) }, tip()), grid: { left: 150, right: 20, top: 26, bottom: 30 },
    xAxis: axis({ type: "value", min: 45, max: 60, axisLabel: { color: p.mut, formatter: v => v + " %" } }),
    yAxis: axis({ type: "category", data: MODELS.map(m => m.label + " (" + m.familia + ")"), axisLabel: { color: p.mut, fontSize: 10, interval: 0 } }),
    series: [{ type: "bar", data: acc, itemStyle: { color: p.ac }, markLine: { symbol: "none", label: { color: p.fg, formatter: d => d.name }, data: [
      { xAxis: 50, name: t("c.coin"), lineStyle: { color: p.dn, type: "dashed" } },
      { xAxis: +(BASE * 100).toFixed(1), name: t("c.always", { base: fmt.pctU(BASE * 100) }), lineStyle: { color: p.warn, type: "dashed" } }] } }]
  });
}
function bin(p) { return p >= 0.6 ? "u2" : p >= 0.5 ? "u1" : p >= 0.4 ? "d1" : "d2"; }
function heat() {
  const g = $("#grp").value, f = $("#fam").value, w = State.watch(WDEF), only = $("#onlyW").checked, hid = hidden();
  const cols = MODELS.filter(m => (!f || m.familia === f) && !hid.includes(m.modelo));
  const rows = U.filter(u => (!g || u.grupo === g) && (!only || w.includes(u.ticker)));
  $("#heatCap").textContent = t("c.heatCap", { r: rows.length, c: cols.length, n: rows.length * cols.length });
  $("#heat thead").innerHTML = `<tr><th scope="col">${t("c.asset")}</th>${cols.map(m => `<th scope="col" title="${m.label}">${m.label} <span class="mut">(${m.familia})</span></th>`).join("")}<th scope="col" class="cons">${t("c.cons")}</th></tr>`;
  $("#heat tbody").innerHTML = rows.map(u => {
    const pr = C.predicciones[u.ticker], by = Object.fromEntries(pr.modelos.map(m => [m.modelo, m]));
    return `<tr class="${w.includes(u.ticker) ? "wl" : ""}${u.ticker === sel ? " sel" : ""}"><th scope="row"><button type="button" class="link" data-a="${u.ticker}" aria-label="${t("c.selAsset", { t: u.ticker })}">${u.ticker}</button></th>
      ${cols.map(m => { const x = by[m.modelo]; return `<td class="${bin(x.prob_sube)}"><span class="s">${x.senal === "SUBE" ? "▲ " + t("up") : "▼ " + t("dn")}</span><span class="p">${fmt.n(x.prob_sube)}</span></td>`; }).join("")}
      <td>${sig(pr.consenso)}<span class="p">${pr.votos_sube}/18</span></td></tr>`;
  }).join("");
  $$("[data-a]").forEach(b => b.onclick = () => { sel = b.dataset.a; State.setTicker(sel); heat(); consensus(); $("#consBox").focus(); });
}
function consensus() {
  const pr = C.predicciones[sel], u = U.find(x => x.ticker === sel), r = R.predicciones[sel].retorno_proyectado_30d_pct;
  const elig = pr.consenso === "SUBE" && r > 0, w = State.watch(WDEF), on = w.includes(sel);
  $("#cons").innerHTML = `<p style="margin-top:0"><strong style="font-size:1.2rem">${sel}</strong> · ${u.nombre} <span class="tag">${groupLabel(u.grupo)}</span></p>
    <p><span class="pill ${pr.consenso === "SUBE" ? "up" : "dn"}" style="font-size:1.05rem">${pr.consenso === "SUBE" ? "▲ " + t("up") : "▼ " + t("dn")}</span></p>
    <div class="bar-h" role="img" aria-label="${t("c.votes", { u: pr.votos_sube, d: pr.votos_baja })}"><span class="u" style="width:${pr.votos_sube / 18 * 100}%"></span><span class="d" style="width:${pr.votos_baja / 18 * 100}%"></span></div>
    <p>${t("c.votes", { u: pr.votos_sube, d: pr.votos_baja })}</p>
    <div class="metrics"><div><b>${fmt.n(pr.prob_media, 3)}</b><span>${t("c.pm")}</span></div><div><b class="conf-${pr.confianza}">${t("conf." + pr.confianza)}</b><span>${t("c.conf")}</span></div></div>
    <p class="small mut">${t("c.confExp")}</p>
    <p>${t("c.elig", { e: `<strong>${elig ? "✔ " + t("yes") : "✘ " + t("no")}</strong>` })} <span class="small mut">${t("c.eligWhy", { t: sel, r: fmt.pct(r) })}</span></p>
    <div class="crumbs"><a class="btn primary" href="regresion.html?t=${sel}">${t("goto.reg", { t: sel })}</a><a class="btn" href="optimizador.html?t=${sel}">${t("goto.opt")}</a>
    <button type="button" class="btn" id="wbtn" aria-pressed="${on}">${on ? "★ " + t("watch.del", { t: sel }) : "☆ " + t("watch.add", { t: sel })}</button></div>`;
  $("#wbtn").onclick = () => { State.toggleWatch(sel, WDEF); consensus(); heat(); $("#wbtn").focus(); };
}
function metrics(rows) {
  const hid = hidden();
  $("#mtb").innerHTML = rows.map(m => `<tr${m.modelo === selModel ? ' class="sel"' : ""}><th scope="row" class="l">${m.label}</th><td>${m.familia}</td>
    <td>${fmt.pctU(m.exactitud * 100)}</td><td>${fmt.n(m.precision, 3)}</td><td>${fmt.n(m.recall, 3)}</td><td>${fmt.n(m.f1, 3)}</td><td>${fmt.n(m.auc, 3)}</td>
    <td>${chg(m.delta, 1).replace(" %", " pp")}</td>
    <td><input type="checkbox" data-h="${m.modelo}" ${hid.includes(m.modelo) ? "" : "checked"} aria-label="${t("c.show")} ${m.label}"></td>
    <td><button type="button" data-cm="${m.modelo}">${t("c.see")}</button></td></tr>`).join("");
  $$("[data-h]").forEach(cb => cb.onchange = () => { let h = hidden(); h = cb.checked ? h.filter(x => x !== cb.dataset.h) : [...h, cb.dataset.h]; store(HIDE_KEY, h); heat(); });
  $$("[data-cm]").forEach(b => b.onclick = () => { selModel = b.dataset.cm; confusion(); $$("#mtb tr").forEach(tr => tr.classList.toggle("sel", tr.querySelector(`[data-cm="${selModel}"]`) !== null)); });
}
function confusion() {
  const m = MODELS.find(x => x.modelo === selModel), c = m.matriz_confusion, n = m.n_prueba;
  $("#cm").innerHTML = `<p style="margin-top:0"><strong>${t("c.cmTitle", { m: m.label, n })}</strong>${hidden().includes(m.modelo) ? ` <span class="tag">${t("c.hidden")}</span>` : ""}</p>
    <table><caption>${t("c.cm")}: ${m.label}</caption><thead><tr><th scope="col">${t("c.pred")} \\ ${t("c.real")}</th><th scope="col">▲ ${t("up")}</th><th scope="col">▼ ${t("dn")}</th></tr></thead>
    <tbody><tr><th scope="row">▲ ${t("up")}</th><td title="${t("c.vp")}"><strong>${c.VP}</strong><br><span class="small mut">${t("c.vp")}</span></td><td title="${t("c.fp")}"><strong>${c.FP}</strong><br><span class="small mut">${t("c.fp")}</span></td></tr>
    <tr><th scope="row">▼ ${t("dn")}</th><td title="${t("c.fn")}"><strong>${c.FN}</strong><br><span class="small mut">${t("c.fn")}</span></td><td title="${t("c.vn")}"><strong>${c.VN}</strong><br><span class="small mut">${t("c.vn")}</span></td></tr></tbody></table>
    <p class="small">${t("c.cmRead", { p: c.VP + c.FP, vp: c.VP, prec: fmt.pctU(c.VP / (c.VP + c.FP) * 100), r: c.VP + c.FN, rec: fmt.pctU(c.VP / (c.VP + c.FN) * 100) })}</p>`;
}
