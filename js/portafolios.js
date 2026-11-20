/* Portafolios en 3 niveles · lee 08_portafolios_3_niveles_riesgo.json y 01_universo_tickers.json.
   Comparte el nivel elegido con Trading y Leaderboard mediante eia_elegido. El usuario puede excluir activos (pauta G10). */
addI18n({
  es: { "p.title": "Portafolios en 3 niveles de riesgo", "p.lead": "Tres carteras tomadas del frente NSGA-II: Conservador (baja volatilidad), Moderado (máximo Sharpe) y Agresivo (mayor retorno proyectado). Compárelas, revise por qué entra cada activo y, si quiere, lleve una al Trading simulado.",
    "p.compare": "Comparación lado a lado", "p.cmpCap": "Métricas esperadas por nivel (simuladas)", "p.why": "¿Por qué entró cada activo?", "p.level": "Nivel de riesgo",
    "p.whyHint": "La razón viene del campo «razon» del JSON: votos de los 18 clasificadores y proyección mediana de los 18 regresores. Puede excluir un activo antes de llevar la cartera a Trading; los demás pesos se reescalan.",
    "p.include": "Incluir", "p.wOrig": "Peso del JSON", "p.wAdj": "Peso ajustado", "p.reason": "Razón (clasificadores y regresión)", "p.toBt": "¿Cómo le habría ido? Ver Backtesting →",
    "p.origin": "Origen", "p.restr": "Restricciones", "p.nAssets": "{n} activos", "p.donut": "Composición del portafolio {n}: {list}",
    "p.choose": "Elegir {n}", "p.chosenTag": "✔ Elegido", "p.take": "Llevar «{n}» a Trading", "p.metric": "Métrica",
    "p.whyCap": "Activos del portafolio {n} y la razón de su inclusión", "p.small": "Activos con peso menor a 1 % sin razón detallada en el JSON: {list} (sí se incluyen al llevar la cartera a Trading).",
    "p.chosenNow": "Nivel elegido actualmente: {n} (se ve en Trading y Leaderboard).", "p.noneChosen": "Aún no ha elegido un nivel de riesgo.",
    "p.errNone": "Debe incluir al menos un activo.", "p.taken": "Portafolio {n} guardado. Abriendo Trading…",
    "p.obs": "Observación honesta sobre los datos: el nivel {a} tiene un retorno esperado ({ra}) menor que el {m} ({rm}), aunque el JSON lo describe como el de mayor retorno. Se muestra tal como viene en 08_portafolios_3_niveles_riesgo.json, sin corregirlo.",
    "p.best": "mejor" },
  en: { "p.title": "Portfolios at 3 risk levels", "p.lead": "Three portfolios taken from the NSGA-II front: Conservative (low volatility), Moderate (max Sharpe) and Aggressive (highest projected return). Compare them, check why each asset is in and, if you wish, take one to Paper trading.",
    "p.compare": "Side-by-side comparison", "p.cmpCap": "Expected metrics per level (simulated)", "p.why": "Why is each asset included?", "p.level": "Risk level",
    "p.whyHint": "The reason comes from the JSON “razon” field: votes of the 18 classifiers and the median projection of the 18 regressors. You can exclude an asset before taking the portfolio to Trading; the other weights are rescaled.",
    "p.include": "Include", "p.wOrig": "JSON weight", "p.wAdj": "Adjusted weight", "p.reason": "Reason (classifiers and regression)", "p.toBt": "How would it have done? See Backtesting →",
    "p.origin": "Origin", "p.restr": "Constraints", "p.nAssets": "{n} assets", "p.donut": "Composition of the {n} portfolio: {list}",
    "p.choose": "Choose {n}", "p.chosenTag": "✔ Chosen", "p.take": "Take “{n}” to Trading", "p.metric": "Metric",
    "p.whyCap": "Assets of the {n} portfolio and why they were included", "p.small": "Assets with weight below 1 % without a detailed reason in the JSON: {list} (they are included when taking the portfolio to Trading).",
    "p.chosenNow": "Currently chosen level: {n} (shown in Trading and Leaderboard).", "p.noneChosen": "You have not chosen a risk level yet.",
    "p.errNone": "You must include at least one asset.", "p.taken": "{n} portfolio saved. Opening Trading…",
    "p.obs": "Honest note on the data: the {a} level has a lower expected return ({ra}) than the {m} level ({rm}), although the JSON describes it as the highest-return one. It is shown exactly as in 08_portafolios_3_niveles_riesgo.json, without correcting it.",
    "p.best": "best" }
});

let PF, U, lvl, excl = {}, WL = [];
window.init = async () => {
  [PF, U, WL] = await Promise.all([loadJSON("08_portafolios_3_niveles_riesgo.json"), loadJSON("01_universo_tickers.json"), watchNow()]);
  const ch = State.chosen(); lvl = (ch && PF.niveles.some(n => n.nivel === ch.nivel)) ? ch.nivel : "Moderado";
  if (ch && ch.nivel === lvl && ch.excluidos) excl[lvl] = ch.excluidos;
  $("#lvRadios").innerHTML = PF.niveles.map(n => `<label class="chk"><input type="radio" name="lv" value="${n.nivel}" ${n.nivel === lvl ? "checked" : ""}> ${n.nivel}</label>`).join("");
  $$('input[name="lv"]').forEach(r => r.addEventListener("change", () => { lvl = r.value; reasons(); cards(); }));
  $("#take").addEventListener("click", take);
  cards(); compare(); reasons(); observation();
  window.onTheme = cards;
};
function cards() {
  const ch = State.chosen(), p = palette();
  $("#chosenNow").textContent = ch ? t("p.chosenNow", { n: ch.nivel }) : t("p.noneChosen");
  $("#cards").innerHTML = PF.niveles.map((n, i) => `<article class="card pcard ${n.nivel}${ch && ch.nivel === n.nivel ? " chosen" : ""}" aria-labelledby="pc${i}">
    <h2 id="pc${i}" style="margin:0">${n.nivel} ${ch && ch.nivel === n.nivel ? `<span class="tag">${t("p.chosenTag")}</span>` : ""}</h2>
    <p class="small" style="margin:0">${n.descripcion}</p>
    <div class="metrics"><div><b>${fmt.pctU(n.retorno_esperado_anual_pct, 2)}</b><span>${t("m.ret")}</span></div><div><b>${fmt.pctU(n.volatilidad_anual_pct, 2)}</b><span>${t("m.vol")}</span></div>
    <div><b>${fmt.n(n.sharpe, 3)}</b><span>${t("m.sharpe")}</span></div><div><b>${fmt.pctU(n.cvar95_diario_pct, 2)}</b><span>${t("m.cvar")}</span></div></div>
    <div id="dn${i}" class="chart sm" role="img" aria-label="${t("p.donut", { n: n.nivel, list: Object.entries(n.pesos).map(([k, v]) => k + " " + fmt.pctU(v * 100)).join(", ") })}"></div>
    <p class="small mut" style="margin:0">${t("p.origin")}: ${n.origen} · ${t("p.restr")}: ${n.restricciones} · ${t("p.nAssets", { n: Object.keys(n.pesos).length })}</p>
    <button type="button" data-lv="${n.nivel}" ${n.nivel === lvl ? 'class="primary"' : ""} aria-pressed="${n.nivel === lvl}">${t("p.choose", { n: n.nivel })}</button></article>`).join("");
  PF.niveles.forEach((n, i) => makeChart($("#dn" + i), {
    tooltip: Object.assign({ trigger: "item", formatter: d => `${d.name}: ${fmt.pctU(d.value, 1)}` }, tip()),
    series: [{ type: "pie", radius: ["42%", "72%"], avoidLabelOverlap: true, itemStyle: { borderColor: p.panel, borderWidth: 2 },
      minShowLabelAngle: 16, label: { color: p.fg, formatter: d => `${d.name}\n${fmt.pctU(d.value, 1)}`, fontSize: 11 }, labelLine: { lineStyle: { color: p.mut } },
      data: Object.entries(n.pesos).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ name: k, value: +(v * 100).toFixed(2) })) }]
  }));
  $$("[data-lv]").forEach(b => b.onclick = () => { lvl = b.dataset.lv; $$('input[name="lv"]').forEach(r => r.checked = r.value === lvl); cards(); reasons(); $("#h-why").scrollIntoView({ behavior: "smooth" }); });
}
function compare() {
  const L = PF.niveles, rows = [["m.ret", "retorno_esperado_anual_pct", 1, x => fmt.pctU(x, 2)], ["m.vol", "volatilidad_anual_pct", -1, x => fmt.pctU(x, 2)],
    ["m.sharpe", "sharpe", 1, x => fmt.n(x, 3)], ["m.cvar", "cvar95_diario_pct", -1, x => fmt.pctU(x, 2)]];
  $("#cmp thead").innerHTML = `<tr><th scope="col" class="l">${t("p.metric")}</th>${L.map(n => `<th scope="col">${n.nivel}</th>`).join("")}</tr>`;
  $("#cmp tbody").innerHTML = rows.map(([k, f, dir, show]) => {
    const vals = L.map(n => n[f]), best = dir > 0 ? Math.max(...vals) : Math.min(...vals);
    return `<tr><th scope="row" class="l">${t(k)}</th>${L.map(n => `<td>${n[f] === best ? `<strong>${show(n[f])} ★</strong> <span class="vh">(${t("p.best")})</span>` : show(n[f])}</td>`).join("")}</tr>`;
  }).join("") + `<tr><th scope="row" class="l">${t("p.origin")}</th>${L.map(n => `<td>${n.origen}</td>`).join("")}</tr>`;
}
function adjusted(n) {
  const ex = excl[n.nivel] || [], keep = Object.entries(n.pesos).filter(([k]) => !ex.includes(k)), s = keep.reduce((a, x) => a + x[1], 0);
  return Object.fromEntries(keep.map(([k, v]) => [k, s ? v / s : 0]));
}
function reasons() {
  const n = PF.niveles.find(x => x.nivel === lvl), adj = adjusted(n), ex = excl[lvl] || [];
  $("#whyCap").textContent = t("p.whyCap", { n: n.nivel });
  $("#why tbody").innerHTML = n.detalle_activos.map(a => `<tr><td><input type="checkbox" data-x="${a.ticker}" ${ex.includes(a.ticker) ? "" : "checked"} aria-label="${t("p.include")} ${a.ticker}"></td>
    <th scope="row"><a href="regresion.html?t=${a.ticker}">${star(a.ticker, WL)}${a.ticker}</a></th><td class="l">${groupLabel(a.grupo)}</td><td>${fmt.pctU(a.peso_pct)}</td>
    <td>${adj[a.ticker] != null ? fmt.pctU(adj[a.ticker] * 100) : "—"}</td><td class="l">${a.razon}</td></tr>`).join("");
  const det = n.detalle_activos.map(a => a.ticker), rest = Object.keys(n.pesos).filter(k => !det.includes(k));
  $("#small1").textContent = rest.length ? t("p.small", { list: rest.map(k => `${k} (${fmt.pctU(n.pesos[k] * 100, 2)})`).join(", ") }) : "";
  $$("[data-x]").forEach(cb => cb.onchange = () => { const e = new Set(excl[lvl] || []); cb.checked ? e.delete(cb.dataset.x) : e.add(cb.dataset.x); excl[lvl] = [...e]; reasons(); $(`[data-x="${cb.dataset.x}"]`).focus(); });
  $("#take").textContent = t("p.take", { n: n.nivel });
}
function take() {
  const n = PF.niveles.find(x => x.nivel === lvl), adj = adjusted(n);
  if (!Object.keys(adj).length) { $("#takeMsg").className = "fieldmsg err"; $("#takeMsg").textContent = t("p.errNone"); return; }
  State.setChosen({ nivel: n.nivel, pesos: adj, excluidos: excl[lvl] || [], fecha: PF.fecha });
  $("#takeMsg").className = "fieldmsg ok"; $("#takeMsg").textContent = t("p.taken", { n: n.nivel });
  setTimeout(() => location.href = "trading.html", 700);
}
/* Observación generada desde los números: no se escriben conclusiones fijas */
function observation() {
  const a = PF.niveles.find(n => n.nivel === "Agresivo"), m = PF.niveles.find(n => n.nivel === "Moderado");
  if (a && m && a.retorno_esperado_anual_pct < m.retorno_esperado_anual_pct) {
    $("#obs").hidden = false;
    $("#obs").textContent = t("p.obs", { a: a.nivel, ra: fmt.pctU(a.retorno_esperado_anual_pct, 2), m: m.nivel, rm: fmt.pctU(m.retorno_esperado_anual_pct, 2) });
  }
}
