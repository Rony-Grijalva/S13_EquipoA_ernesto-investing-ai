/* Regresión a 30 sesiones · lee 06_regresores_precio_30d.json (18 regresores), 02_precios_sinteticos_504d.json (historia),
   05_clasificadores_binarios.json (consenso, para el criterio de elegibilidad) y 01_universo_tickers.json.
   La banda de incertidumbre está ACTIVADA por defecto: una línea sin banda comunica una certeza que no existe. */
addI18n({
  es: { "r.title": "Regresión de precios a 30 sesiones", "r.lead": "18 regresores proyectan 30 cierres diarios futuros. La línea gruesa es la mediana del ensamble; la banda muestra el rango p10–p90 entre modelos y el cono, la incertidumbre propia del mercado.",
    "r.controls": "Controles", "r.family": "Modelos mostrados", "r.unc": "Incertidumbre", "r.band": "Banda p10–p90 entre modelos", "r.cone": "Cono de volatilidad",
    "r.pick": "Activar o desactivar modelos individuales", "r.summary": "Proyección a 30 sesiones", "r.chartT": "Historia (120 sesiones) y pronóstico (30 sesiones)",
    "r.alt": "Ver los 30 precios de la mediana y su banda en una tabla", "r.p10": "p10", "r.med": "Mediana", "r.p90": "p90", "r.coneL": "Cono inf.", "r.coneH": "Cono sup.",
    "r.metrics": "Métricas por modelo (error histórico a 30 sesiones)", "r.metHint": "MAPE, MAE y RMSE: menor es mejor. «Mejora vs. persistencia» compara con el modelo ingenuo que repite el último precio.",
    "r.metCap": "Error de los 18 regresores frente al modelo ingenuo", "r.mae": "MAE rel.", "r.rmse": "RMSE rel.", "r.r2": "retornos", "r.imp": "Mejora vs. persistencia", "r.final": "Precio a 30 s",
    "r.hist": "Historia sintética", "r.median": "Mediana del ensamble", "r.bandS": "Banda p10–p90", "r.coneS": "Cono de volatilidad",
    "r.last": "Último precio ({f})", "r.proj": "Retorno proyectado (mediana)", "r.target": "Mediana al {f}", "r.range": "Rango p10–p90 al final", "r.coneR": "Cono de volatilidad al final",
    "r.read": "Lectura: la mediana de los modelos apunta a {dir}, pero el cono de volatilidad va de {lo} a {hi}. El movimiento esperado ({r}) es pequeño frente a esa incertidumbre.",
    "r.dirU": "una subida", "r.dirD": "una bajada", "r.cls": "Consenso de los clasificadores: {s} ({v}/18)",
    "r.elig": "Elegible para el Optimizador: {e}", "r.noUnc": "Ha ocultado la banda y el cono: recuerde que el pronóstico es incierto; la línea sola sugiere una precisión que no existe.",
    "r.chartAria": "Gráfico de {t}: 120 sesiones de historia y 30 proyectadas por {n} modelos; mediana final {m} ({r}); banda p10–p90 de {a} a {b}.",
    "r.altCap": "Pronóstico de la mediana del ensamble para {t} (30 sesiones)", "r.noModels": "No hay modelos seleccionados: solo se muestran la mediana y la incertidumbre." },
  en: { "r.title": "30-session price regression", "r.lead": "18 regressors project 30 future daily closes. The thick line is the ensemble median; the band shows the p10–p90 range across models and the cone, the market's own uncertainty.",
    "r.controls": "Controls", "r.family": "Models shown", "r.unc": "Uncertainty", "r.band": "p10–p90 band across models", "r.cone": "Volatility cone",
    "r.pick": "Turn individual models on or off", "r.summary": "30-session projection", "r.chartT": "History (120 sessions) and forecast (30 sessions)",
    "r.alt": "View the 30 median prices and their band as a table", "r.p10": "p10", "r.med": "Median", "r.p90": "p90", "r.coneL": "Cone low", "r.coneH": "Cone high",
    "r.metrics": "Metrics per model (30-session historical error)", "r.metHint": "MAPE, MAE and RMSE: lower is better. “Improvement vs. persistence” compares with the naive model that repeats the last price.",
    "r.metCap": "Error of the 18 regressors versus the naive model", "r.mae": "Rel. MAE", "r.rmse": "Rel. RMSE", "r.r2": "returns", "r.imp": "Improvement vs. persistence", "r.final": "Price at 30 s",
    "r.hist": "Synthetic history", "r.median": "Ensemble median", "r.bandS": "p10–p90 band", "r.coneS": "Volatility cone",
    "r.last": "Last price ({f})", "r.proj": "Projected return (median)", "r.target": "Median on {f}", "r.range": "p10–p90 range at the end", "r.coneR": "Volatility cone at the end",
    "r.read": "Reading: the models' median points to {dir}, but the volatility cone goes from {lo} to {hi}. The expected move ({r}) is small compared with that uncertainty.",
    "r.dirU": "a rise", "r.dirD": "a fall", "r.cls": "Classifiers' consensus: {s} ({v}/18)",
    "r.elig": "Eligible for the Optimizer: {e}", "r.noUnc": "You hid the band and the cone: remember the forecast is uncertain; the line alone suggests a precision that does not exist.",
    "r.chartAria": "Chart of {t}: 120 sessions of history and 30 projected by {n} models; final median {m} ({r}); p10–p90 band from {a} to {b}.",
    "r.altCap": "Ensemble median forecast for {t} (30 sessions)", "r.noModels": "No models selected: only the median and the uncertainty are shown." }
});

const OFF_KEY = "eia_reg_ocultos";
let R, P, C, U, ROWS;
window.init = async () => {
  [R, P, C, U] = await Promise.all([loadJSON("06_regresores_precio_30d.json"), loadJSON("02_precios_sinteticos_504d.json"),
    loadJSON("05_clasificadores_binarios.json"), loadJSON("01_universo_tickers.json")]);
  WDEF = await watchDefault(); fillSel();
  const tk = State.ticker("NVDA"); $("#sel").value = R.predicciones[tk] ? tk : "NVDA";
  $("#models").innerHTML = R.modelos.map(m => `<label class="chk"><input type="checkbox" data-m="${m.modelo}"> ${modelLabel(m.modelo)} (${m.familia})</label>`).join("");
  $("#sel").addEventListener("change", () => { State.setTicker($("#sel").value); draw(); });
  $$('input[name="fam"]').forEach(r => r.addEventListener("change", draw));
  ["#band", "#cone"].forEach(s => $(s).addEventListener("change", draw));
  $$("[data-m]").forEach(cb => cb.addEventListener("change", () => { const off = (store(OFF_KEY) || []).filter(x => x !== cb.dataset.m); if (!cb.checked) off.push(cb.dataset.m); store(OFF_KEY, off); draw(); }));
  sortable($("#met"), () => ROWS, metrics);
  draw(); window.onTheme = draw;
};
const fam = () => $$('input[name="fam"]').find(r => r.checked).value;
let WDEF = [];
/* Selector de activos con ★ para los de la watchlist (estado compartido) */
function fillSel() { const w = State.watch(WDEF), v = $("#sel").value; $("#sel").innerHTML = U.map(u => `<option value="${u.ticker}">${star(u.ticker, w)}${u.ticker} · ${u.nombre}</option>`).join(""); if (v) $("#sel").value = v; }
function draw() {
  const tk = $("#sel").value, pr = R.predicciones[tk], f = fam(), off = store(OFF_KEY) || [], p = palette();
  $$("[data-m]").forEach(cb => { const m = R.modelos.find(x => x.modelo === cb.dataset.m); cb.checked = !off.includes(m.modelo); cb.disabled = !!f && m.familia !== f; });
  const shown = pr.modelos.filter(m => (!f || m.familia === f) && !off.includes(m.modelo));
  const H = 120, hd = P.fechas.slice(-H), hc = P.cierres[tk].slice(-H), fd = R.fechas_pronostico, nF = fd.length;
  const x = [...hd, ...fd].map(fmt.dshort), pad = Array(H - 1).fill(null);
  const fc = arr => [...pad, pr.precio_ultimo, ...arr];       // el pronóstico parte del último precio real del ancla
  const band = $("#band").checked, cone = $("#cone").checked;
  const series = [{ type: "line", name: t("r.hist"), data: [...hc, ...Array(nF).fill(null)], showSymbol: false, lineStyle: { color: p.fg, width: 1.6 }, itemStyle: { color: p.fg } }];
  // Bandas como área apilada: base inferior invisible + diferencia sombreada
  const area = (lo, hi, name, color, op) => [
    { type: "line", name, stack: name, data: fc(lo), showSymbol: false, lineStyle: { opacity: 0 }, itemStyle: { color }, tooltip: { show: false } },
    { type: "line", name, stack: name, data: fc(hi.map((v, i) => +(v - lo[i]).toFixed(2))).map((v, i) => i === H - 1 ? 0 : v), showSymbol: false, lineStyle: { opacity: 0 }, areaStyle: { color, opacity: op }, itemStyle: { color }, tooltip: { show: false } }];
  if (cone) series.push(...area(pr.cono_volatilidad_inf, pr.cono_volatilidad_sup, t("r.coneS"), p.warn, .16));
  if (band) series.push(...area(pr.banda_p10, pr.banda_p90, t("r.bandS"), p.ac, .38));
  shown.forEach(m => series.push({ type: "line", name: modelLabel(m.modelo), data: fc(m.precios), showSymbol: false, lineStyle: { width: 1, opacity: .45, color: m.familia === "ML" ? p.series[5] : p.series[4] }, itemStyle: { color: m.familia === "ML" ? p.series[5] : p.series[4] }, emphasis: { focus: "series" } }));
  series.push({ type: "line", name: t("r.median"), data: fc(pr.ensamble_mediana), showSymbol: false, lineStyle: { width: 3.2, color: p.ac }, itemStyle: { color: p.ac }, z: 10 });
  const r = pr.retorno_proyectado_30d_pct, last = pr.ensamble_mediana[nF - 1];
  $("#chart").setAttribute("aria-label", t("r.chartAria", { t: tk, n: shown.length, m: fmt.usd(last), r: fmt.pct(r), a: fmt.usd(pr.banda_p10[nF - 1]), b: fmt.usd(pr.banda_p90[nF - 1]) }));
  makeChart($("#chart"), {
    tooltip: Object.assign({ trigger: "axis", valueFormatter: v => v == null ? "—" : fmt.usd(v) }, tip()),
    legend: { type: "scroll", top: 0, textStyle: { color: p.fg }, data: [t("r.hist"), t("r.median"), ...(band ? [t("r.bandS")] : []), ...(cone ? [t("r.coneS")] : [])] },
    grid: { left: 62, right: 18, top: 36, bottom: 56 },
    xAxis: axis({ type: "category", data: x, boundaryGap: false }), yAxis: axis({ scale: true, name: "US$" }),
    dataZoom: [{ type: "inside" }, { type: "slider", height: 16, bottom: 6, start: 40, end: 100 }],
    series: series.concat([{ type: "line", data: [], markLine: { symbol: "none", silent: true, label: { color: p.mut, formatter: t("r.last", { f: fmt.dshort(hd[H - 1]) }) }, lineStyle: { color: p.mut, type: "dashed" }, data: [{ xAxis: H - 1 }] } }])
  });
  $("#uncNote").hidden = band || cone; $("#uncNote").textContent = t("r.noUnc");
  summary(tk, pr, shown.length);
  $("#altCap").textContent = t("r.altCap", { t: tk });
  $("#alt tbody").innerHTML = fd.map((d, i) => `<tr><td>${i + 1}</td><th scope="row">${fmt.date(d)}</th><td>${fmt.n(pr.banda_p10[i])}</td><td><strong>${fmt.n(pr.ensamble_mediana[i])}</strong></td><td>${fmt.n(pr.banda_p90[i])}</td><td>${fmt.n(pr.cono_volatilidad_inf[i])}</td><td>${fmt.n(pr.cono_volatilidad_sup[i])}</td></tr>`).join("");
  ROWS = R.modelos.map(m => ({ ...m, label: modelLabel(m.modelo), fin: pr.modelos.find(x => x.modelo === m.modelo).precios[nF - 1] }));
  metrics(ROWS);
}
function summary(tk, pr, n) {
  const nF = R.fechas_pronostico.length, r = pr.retorno_proyectado_30d_pct, cp = C.predicciones[tk], elig = cp.consenso === "SUBE" && r > 0;
  $("#sum").innerHTML = `<p class="mut" style="margin:0">${t("r.proj")} · ${tk}</p>
    <p style="font-size:2rem;font-weight:800;margin:.1rem 0">${chg(r)}</p>
    <div class="metrics"><div><b>${fmt.usd(pr.precio_ultimo)}</b><span>${t("r.last", { f: fmt.date(P.fechas[P.fechas.length - 1]) })}</span></div>
    <div><b>${fmt.usd(pr.ensamble_mediana[nF - 1])}</b><span>${t("r.target", { f: fmt.date(R.fechas_pronostico[nF - 1]) })}</span></div>
    <div><b>${fmt.n(pr.banda_p10[nF - 1])} – ${fmt.n(pr.banda_p90[nF - 1])}</b><span>${t("r.range")}</span></div>
    <div><b>${fmt.n(pr.cono_volatilidad_inf[nF - 1])} – ${fmt.n(pr.cono_volatilidad_sup[nF - 1])}</b><span>${t("r.coneR")}</span></div></div>
    <p class="small">${t("r.read", { dir: r >= 0 ? t("r.dirU") : t("r.dirD"), lo: fmt.usd(pr.cono_volatilidad_inf[nF - 1]), hi: fmt.usd(pr.cono_volatilidad_sup[nF - 1]), r: fmt.pct(r) })}</p>
    <p class="small">${t("r.cls", { s: sig(cp.consenso), v: cp.votos_sube })} · ${t("r.elig", { e: `<strong>${elig ? "✔ " + t("yes") : "✘ " + t("no")}</strong>` })}</p>
    <div class="crumbs"><a class="btn" href="clasificacion.html?t=${tk}">${t("goto.cls", { t: tk })}</a><a class="btn primary" href="optimizador.html?t=${tk}">${t("goto.opt")}</a>
    <button type="button" class="btn" id="wbtn" aria-pressed="${State.watch(WDEF).includes(tk)}">${State.watch(WDEF).includes(tk) ? "★ " + t("watch.del", { t: tk }) : "☆ " + t("watch.add", { t: tk })}</button></div>`;
  $("#wbtn").onclick = () => { State.toggleWatch(tk, WDEF); fillSel(); summary(tk, pr, n); $("#wbtn").focus(); };
}
function metrics(rows) {
  $("#mtb").innerHTML = rows.map(m => `<tr><th scope="row" class="l">${m.label}</th><td>${m.familia}</td><td>${fmt.pctU(m.mape_30d_pct, 2)}</td>
    <td>${fmt.pctU(m.mae_relativo_pct, 2)}</td><td>${fmt.pctU(m.rmse_relativo_pct, 2)}</td><td>${fmt.n(m.r2_retornos_30d, 3)}</td>
    <td>${chg(m.mejora_vs_persistencia_pct, 1)}</td><td>${fmt.n(m.fin)}</td></tr>`).join("");
}
