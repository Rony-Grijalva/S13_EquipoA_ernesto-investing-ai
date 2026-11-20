/* =====================================================================
   Ernesto Investing AI · Sistema web integrado · S13 · Equipo A
   js/common.js — núcleo ÚNICO compartido por los 9 módulos:
   navegación, tema claro/oscuro, idioma ES-PE / EN-US (Intl), estado
   compartido en localStorage, lectura de JSON, ayudas de gráficos
   (ECharts 5.5.1) y tablas ordenables con teclado.
   Material educativo: todos los datos son SINTÉTICOS (ver data/13_*).
   ===================================================================== */
"use strict";
/* Registro de errores para la verificación automática (tests/verificar_en_navegador.html) */
window.__EIA_ERRORS = [];
window.addEventListener("error", e => window.__EIA_ERRORS.push(String(e.message || e)));
window.addEventListener("unhandledrejection", e => window.__EIA_ERRORS.push(String(e.reason)));

/* ---------- 1. Módulos del sistema (una sola barra de navegación) ---------- */
const PAGES = [
  ["index.html", "nav.dashboard", "dashboard"],
  ["watchlist.html", "nav.watchlist", "watchlist"],
  ["trading.html", "nav.trading", "trading"],
  ["leaderboard.html", "nav.leaderboard", "leaderboard"],
  ["clasificacion.html", "nav.clasificacion", "clasificacion"],
  ["regresion.html", "nav.regresion", "regresion"],
  ["optimizador.html", "nav.optimizador", "optimizador"],
  ["portafolios.html", "nav.portafolios", "portafolios"],
  ["backtesting.html", "nav.backtesting", "backtesting"]
];

/* ---------- 2. Internacionalización (bonificación S13) ---------- */
const I18N = {
  es: {
    "skip": "Saltar al contenido", "brand.sub": "Investing AI", "nav.label": "Módulos del sistema", "menu": "Menú",
    "nav.dashboard": "Dashboard", "nav.watchlist": "Watchlist y alertas", "nav.trading": "Trading simulado",
    "nav.leaderboard": "Leaderboard", "nav.clasificacion": "Clasificación", "nav.regresion": "Regresión 30 días",
    "nav.optimizador": "Optimizador", "nav.portafolios": "Portafolios", "nav.backtesting": "Backtesting",
    "theme.toDark": "Tema oscuro", "theme.toLight": "Tema claro", "theme.title": "Cambiar entre tema claro y oscuro",
    "lang.label": "Idioma",
    "datebar": "Cierre de datos: {fecha} · Generados el {gen} · Semilla {seed} · 26 activos",
    "datebar.syn": "Datos sintéticos",
    "footer": "Material educativo del curso Interacción Hombre-Computador (FISI-UNMSM, 2026-II) · Equipo A. Datos sintéticos con patrones realistas, anclados al cierre del {fecha}. No son precios reales ni asesoría de inversión. Clasificaciones, pronósticos, NSGA-II/III y backtesting están simulados.",
    "err.fetch": "{msg}. Abra el sitio desde un servidor (GitHub Pages o python -m http.server), no con doble clic.",
    "err.echarts": "No se pudo cargar la librería de gráficos (se requiere conexión). Use la tabla alternativa de abajo.",
    "alt.table": "Ver los datos del gráfico en una tabla",
    "sim.pred": "Datos sintéticos · resultados simulados. Ningún modelo fue entrenado: las salidas vienen de {file}. No es asesoría de inversión.",
    "sim.opt": "NSGA-II y NSGA-III simulados: no se ejecutó ningún algoritmo evolutivo (los frentes vienen de {file}). Datos sintéticos; no es asesoría de inversión.",
    "sim.bt": "Backtesting sobre historia SINTÉTICA ({file}). El desempeño pasado no garantiza resultados futuros. No es asesoría de inversión.",
    "sim.base": "Datos sintéticos anclados al cierre del {fecha}; no son precios reales.",
    "up": "SUBE", "dn": "BAJA", "yes": "Sí", "no": "No",
    "g.Magnificas 7": "Magníficas 7", "g.Mineras con operaciones en Peru": "Mineras con operaciones en Perú",
    "g.ETF sectoriales": "ETF sectoriales", "g.ETF globales y Peru": "ETF globales y Perú",
    "all": "Todos", "only.watch": "Solo mi watchlist", "watch.add": "Agregar {t} a la watchlist", "watch.del": "Quitar {t} de la watchlist",
    "conf.alta": "alta", "conf.media": "media", "conf.baja": "baja",
    "fam.ML": "Machine Learning", "fam.DL": "Deep Learning",
    "goto.reg": "Ver regresión de {t} →", "goto.cls": "← Ver clasificación de {t}", "goto.opt": "Ver en el Optimizador →",
    "goto.trading": "Ir a Trading →", "goto.port": "Ver Portafolios →", "goto.bt": "Ver Backtesting →",
    "sorthint": "Pulse un encabezado (o Enter sobre él) para ordenar.",
    "d.ticker": "Ticker", "d.last": "Último (US$)", "d.v1d": "1 d", "d.sig": "Consenso 30 s", "d.group": "Grupo", "d.asset": "Activo", "d.date": "Fecha",
    "c.model": "Modelo", "c.family": "Familia de modelos",
    "m.ret": "Retorno esperado anual", "m.vol": "Volatilidad anual", "m.sharpe": "Sharpe", "m.cvar": "CVaR 95 % diario", "m.weight": "Peso"
  },
  en: {
    "skip": "Skip to content", "brand.sub": "Investing AI", "nav.label": "System modules", "menu": "Menu",
    "nav.dashboard": "Dashboard", "nav.watchlist": "Watchlist & alerts", "nav.trading": "Paper trading",
    "nav.leaderboard": "Leaderboard", "nav.clasificacion": "Classification", "nav.regresion": "30-day regression",
    "nav.optimizador": "Optimizer", "nav.portafolios": "Portfolios", "nav.backtesting": "Backtesting",
    "theme.toDark": "Dark theme", "theme.toLight": "Light theme", "theme.title": "Switch between light and dark theme",
    "lang.label": "Language",
    "datebar": "Data close: {fecha} · Generated on {gen} · Seed {seed} · 26 assets",
    "datebar.syn": "Synthetic data",
    "footer": "Educational material for the Human-Computer Interaction course (FISI-UNMSM, 2026-II) · Team A. Synthetic data with realistic patterns, anchored to the {fecha} close. Not real prices and not investment advice. Classifications, forecasts, NSGA-II/III and backtesting are simulated.",
    "err.fetch": "{msg}. Open the site from a server (GitHub Pages or python -m http.server), not by double-clicking.",
    "err.echarts": "The chart library could not be loaded (internet required). Use the alternative table below.",
    "alt.table": "View the chart data as a table",
    "sim.pred": "Synthetic data · simulated results. No model was trained: outputs come from {file}. Not investment advice.",
    "sim.opt": "NSGA-II and NSGA-III are simulated: no evolutionary algorithm was run (fronts come from {file}). Synthetic data; not investment advice.",
    "sim.bt": "Backtest on SYNTHETIC history ({file}). Past performance does not guarantee future results. Not investment advice.",
    "sim.base": "Synthetic data anchored to the {fecha} close; not real prices.",
    "up": "UP", "dn": "DOWN", "yes": "Yes", "no": "No",
    "g.Magnificas 7": "Magnificent 7", "g.Mineras con operaciones en Peru": "Miners operating in Peru",
    "g.ETF sectoriales": "Sector ETFs", "g.ETF globales y Peru": "Broad & Peru ETFs",
    "all": "All", "only.watch": "Only my watchlist", "watch.add": "Add {t} to the watchlist", "watch.del": "Remove {t} from the watchlist",
    "conf.alta": "high", "conf.media": "medium", "conf.baja": "low",
    "fam.ML": "Machine Learning", "fam.DL": "Deep Learning",
    "goto.reg": "See {t} regression →", "goto.cls": "← See {t} classification", "goto.opt": "See in the Optimizer →",
    "goto.trading": "Go to Trading →", "goto.port": "See Portfolios →", "goto.bt": "See Backtesting →",
    "sorthint": "Press a header (or Enter on it) to sort.",
    "d.ticker": "Ticker", "d.last": "Last (US$)", "d.v1d": "1 d", "d.sig": "30-s consensus", "d.group": "Group", "d.asset": "Asset", "d.date": "Date",
    "c.model": "Model", "c.family": "Model family",
    "m.ret": "Expected annual return", "m.vol": "Annual volatility", "m.sharpe": "Sharpe", "m.cvar": "Daily CVaR 95 %", "m.weight": "Weight"
  }
};
/* Cada módulo agrega sus propias cadenas con addI18n({es:{…}, en:{…}}). */
function addI18n(d) { for (const l in d) Object.assign(I18N[l], d[l]); }

const QS = new URLSearchParams(location.search);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Persistencia segura (modo privado o almacenamiento bloqueado no rompe la página) */
function store(k, v) {
  try {
    if (v === undefined) { const s = localStorage.getItem(k); return s ? JSON.parse(s) : null; }
    if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v));
  } catch (e) { return null; }
}
if (QS.get("lang") === "en" || QS.get("lang") === "es") store("eia_lang", QS.get("lang"));
const LANG = store("eia_lang") === "en" ? "en" : "es";
const LOCALE = LANG === "en" ? "en-US" : "es-PE";

/* t("clave", {var}) — sin concatenar cadenas: las variables van con nombre */
function t(k, vars) {
  let s = (I18N[LANG] && I18N[LANG][k]) ?? I18N.es[k] ?? k;
  if (vars) for (const v in vars) s = s.split("{" + v + "}").join(vars[v]);
  return s;
}
function applyI18n(root = document) {
  $$("[data-i18n]", root).forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$("[data-i18n-html]", root).forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  $$("[data-i18n-aria]", root).forEach(el => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
}

/* ---------- 3. Formatos con Intl según el idioma activo ---------- */
const NF = {};
function nf(d) { return NF[d] || (NF[d] = new Intl.NumberFormat(LOCALE, { minimumFractionDigits: d, maximumFractionDigits: d })); }
const USD = new Intl.NumberFormat(LOCALE, { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const DF = new Intl.DateTimeFormat(LOCALE, { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
const DFS = new Intl.DateTimeFormat(LOCALE, { day: "2-digit", month: "short", timeZone: "UTC" });
const fmt = {
  n: (x, d = 2) => nf(d).format(x),
  pct: (x, d = 2) => (x > 0 ? "+" : "") + nf(d).format(x) + " %",
  pctU: (x, d = 1) => nf(d).format(x) + " %",
  usd: x => USD.format(x),
  date: s => /^\d{4}-\d{2}-\d{2}$/.test(s) ? DF.format(new Date(s + "T00:00:00Z")) : s,
  dshort: s => /^\d{4}-\d{2}-\d{2}$/.test(s) ? DFS.format(new Date(s + "T00:00:00Z")) : s,
  cls: x => x > 0 ? "up" : (x < 0 ? "dn" : "mut")
};
/* Variación con color + signo + flecha: el color nunca es el único canal */
function chg(x, d = 2) { const a = x > 0 ? "▲" : (x < 0 ? "▼" : "■"); return `<span class="${fmt.cls(x)}">${a} ${fmt.pct(x, d)}</span>`; }
function sig(s) { return s === "SUBE" ? `<span class="sig up">▲ ${t("up")}</span>` : `<span class="sig dn">▼ ${t("dn")}</span>`; }
function groupLabel(g) { return t("g." + g); }
/* Nombres de modelo: el JSON no tiene tildes; solo se corrige la presentación */
const MODEL_ES = { "Regresion logistica": "Regresión logística", "Arbol de decision": "Árbol de decisión", "Regresion lineal": "Regresión lineal" };
const MODEL_EN = { "Regresion logistica": "Logistic regression", "Arbol de decision": "Decision tree", "Regresion lineal": "Linear regression",
  "k-vecinos (kNN)": "k-nearest neighbors (kNN)", "Naive Bayes gaussiano": "Gaussian Naive Bayes", "MLP (red densa)": "MLP (dense network)", "RNN simple": "Simple RNN" };
function modelLabel(m) { return (LANG === "en" ? MODEL_EN[m] : MODEL_ES[m]) || m; }

/* ---------- 4. Datos: lectura única desde data/ ---------- */
const cache = {};
async function loadJSON(name) {
  if (cache[name]) return cache[name];
  const r = await fetch("data/" + name);
  if (!r.ok) throw new Error("No se pudo leer data/" + name + " (" + r.status + ")");
  return (cache[name] = await r.json());
}

/* ---------- 5. Estado compartido entre módulos (localStorage) ---------- */
const KEYS = { watch: "eia_watch", port: "eia_port", chosen: "eia_elegido", ticker: "eia_ticker", theme: "eia_theme", alerts: "eia_alertas" };
const State = {
  watch(def) { return store(KEYS.watch) || (def ? [...def] : []); },
  setWatch(arr) { store(KEYS.watch, arr); },
  toggleWatch(tk, def) { const w = State.watch(def); const i = w.indexOf(tk); if (i >= 0) w.splice(i, 1); else w.push(tk); State.setWatch(w); return w; },
  ticker(def) { const q = (QS.get("t") || "").toUpperCase(); return q || store(KEYS.ticker) || def; },
  setTicker(tk) { store(KEYS.ticker, tk); },
  chosen() { return store(KEYS.chosen); },
  setChosen(o) { store(KEYS.chosen, o); },
  port() { return store(KEYS.port); },
  setPort(p) { store(KEYS.port, p); }
};
/* La watchlist inicial viene del JSON 11; se lee una sola vez */
async function watchDefault() { return (await loadJSON("11_watchlist_alertas_portafolio_demo.json")).watchlist_inicial; }
/* Watchlist vigente (la del usuario o la inicial) y marca ★ usada en todos los módulos */
async function watchNow() { return State.watch(await watchDefault()); }
function star(tk, w) { return w.includes(tk) ? "★ " : ""; }

/* ---------- 6. Tema claro / oscuro (los gráficos también cambian) ---------- */
function isDark() {
  const a = document.documentElement.getAttribute("data-theme");
  return a ? a === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
}
function applyTheme(th) { if (th) document.documentElement.setAttribute("data-theme", th); }
function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
function palette() {
  return { fg: cssVar("--fg"), mut: cssVar("--mut"), bd: cssVar("--bd"), panel: cssVar("--panel"), ac: cssVar("--ac"),
    up: cssVar("--up"), dn: cssVar("--dn"), warn: cssVar("--warn"),
    series: ["--c1", "--c2", "--c3", "--c4", "--c5", "--c6", "--c7"].map(cssVar) };
}

/* ---------- 7. Gráficos ECharts con respaldo accesible ---------- */
const CHARTS = new Set();
function makeChart(el, option) {
  if (!window.echarts) { el.innerHTML = `<p class="err" role="alert">${t("err.echarts")}</p>`; el.style.height = "auto"; return null; }
  const old = echarts.getInstanceByDom(el); if (old) { old.dispose(); CHARTS.delete(old); }
  const ch = echarts.init(el, null, { renderer: "canvas" });
  const p = palette();
  ch.setOption(Object.assign({ animation: false, backgroundColor: "transparent", textStyle: { color: p.fg, fontFamily: "system-ui,Segoe UI,Roboto,Arial,sans-serif" },
    aria: { enabled: true }, color: p.series }, option));
  CHARTS.add(ch);
  return ch;
}
/* Ejes con el color del tema activo */
function axis(extra = {}) {
  const p = palette();
  return Object.assign({ axisLabel: { color: p.mut }, axisLine: { lineStyle: { color: p.bd } }, splitLine: { lineStyle: { color: p.bd, opacity: .6 } },
    nameTextStyle: { color: p.mut } }, extra);
}
function tip() { const p = palette(); return { backgroundColor: p.panel, borderColor: p.bd, textStyle: { color: p.fg } }; }
window.addEventListener("resize", () => CHARTS.forEach(c => c.resize()));

/* ---------- 8. Tabla ordenable (botones en encabezados = operable con teclado) ---------- */
function sortable(table, getRows, render) {
  let key = null, dir = 1;
  $$("th[data-k]", table).forEach(th => {
    const label = th.innerHTML; th.setAttribute("aria-sort", "none");
    th.innerHTML = `<button type="button" class="sort">${label}</button>`;
    th.querySelector("button").addEventListener("click", () => {
      const k = th.dataset.k; dir = key === k ? -dir : (th.dataset.dir === "asc" ? 1 : -1); key = k;
      $$("th[data-k]", table).forEach(o => o.setAttribute("aria-sort", "none"));
      th.setAttribute("aria-sort", dir > 0 ? "ascending" : "descending");
      const rows = [...getRows()].sort((a, b) => {
        const x = a[k], y = b[k];
        return (typeof x === "number" ? x - y : String(x).localeCompare(String(y), LOCALE)) * dir;
      });
      render(rows);
    });
  });
}

/* ---------- 9. Aviso de simulación por módulo ---------- */
function simNotice(el) {
  const kind = el.dataset.sim, file = el.dataset.file || "";
  el.className = "aviso sim"; el.setAttribute("role", "note");
  el.innerHTML = `<span class="ico" aria-hidden="true">⚠</span><span><strong>${t("datebar.syn")}.</strong> ${t("sim." + kind, { file: `<code>data/${file}</code>`, fecha: window.__FECHA || "" })}</span>`;
}

/* ---------- 10. Armazón común: encabezado, navegación, pie ---------- */
async function buildShell() {
  applyTheme(QS.get("theme") || store(KEYS.theme));
  if (QS.get("theme")) store(KEYS.theme, QS.get("theme"));
  document.documentElement.lang = LANG === "en" ? "en" : "es";
  const page = document.body.dataset.page;
  const nav = PAGES.map(p => `<li><a href="${p[0]}"${p[2] === page ? ' aria-current="page"' : ""}>${t(p[1])}</a></li>`).join("");
  document.body.insertAdjacentHTML("afterbegin", `<a class="skip" href="#contenido">${t("skip")}</a>
  <header class="top"><div class="bar">
    <a class="brand" href="index.html">Ernesto <span>${t("brand.sub")}</span></a>
    <button id="menuBtn" type="button" aria-expanded="false" aria-controls="mods">☰ ${t("menu")}</button>
    <nav class="mods" id="mods" aria-label="${t("nav.label")}"><ul>${nav}</ul></nav>
    <span class="sp"></span>
    <div class="tools">
      <label class="vh" for="lang">${t("lang.label")}</label>
      <select id="lang"><option value="es">ES-PE</option><option value="en">EN-US</option></select>
      <button id="tema" type="button" aria-pressed="false" title="${t("theme.title")}"></button>
    </div></div>
    <div class="datebar" id="datebar" aria-live="polite"></div></header>`);
  const tb = $("#tema");
  const paintTheme = () => { const d = isDark(); tb.textContent = d ? "☀ " + t("theme.toLight") : "☾ " + t("theme.toDark"); tb.setAttribute("aria-pressed", String(d)); };
  paintTheme();
  tb.addEventListener("click", () => {
    const n = isDark() ? "light" : "dark"; applyTheme(n); store(KEYS.theme, n); paintTheme();
    if (window.onTheme) window.onTheme(n);
  });
  $("#lang").value = LANG;
  $("#lang").addEventListener("change", e => { store("eia_lang", e.target.value); const u = new URL(location.href); u.searchParams.delete("lang"); location.href = u.toString(); });
  $("#menuBtn").addEventListener("click", e => { const o = $("#mods").classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded", String(o)); });
  const m = $("main"); if (m) { m.id = "contenido"; m.tabIndex = -1; }
  document.title = t(document.body.dataset.title || "nav." + page) + " · Ernesto Investing AI";
  applyI18n();
  // Fecha de cierre única para todas las pantallas (coherencia de datos)
  try {
    const P = await loadJSON("13_patrones_y_parametros.json");
    window.__FECHA = fmt.date(P.fecha_ancla_precios);
    $("#datebar").innerHTML = `<span class="tag">⚠ ${t("datebar.syn")}</span><span>${t("datebar", { fecha: fmt.date(P.fecha_ancla_precios), gen: fmt.date(P.fecha_generacion), seed: P.semilla })}</span>`;
    document.body.insertAdjacentHTML("beforeend", `<footer class="site"><p>${t("footer", { fecha: fmt.date(P.fecha_ancla_precios) })}</p></footer>`);
  } catch (e) { /* el error se muestra en init */ }
  $$("[data-sim]").forEach(simNotice);
}
function showError(e) {
  console.error(e); window.__EIA_ERRORS.push(String(e && e.message || e));
  const m = $("main"); m.insertAdjacentHTML("afterbegin", `<p class="err" role="alert">${t("err.fetch", { msg: e.message })}</p>`);
}
document.addEventListener("DOMContentLoaded", async () => {
  await buildShell();
  if (window.init) { try { await window.init(); } catch (e) { showError(e); } }
});
