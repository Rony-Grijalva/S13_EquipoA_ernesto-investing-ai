/* Watchlist y alertas · lee 10_dashboard_mercado.json, 02_precios_sinteticos_504d.json,
   05_clasificadores_binarios.json y 11_watchlist_alertas_portafolio_demo.json.
   Persistencia: eia_watch (lista) y eia_alertas (alertas del usuario). */
addI18n({
  es: { "w.title": "Watchlist y alertas", "w.lead": "Su lista personal se respeta en todos los módulos (marcada con ★). Las alertas se evalúan contra el último precio sintético de 10_dashboard_mercado.json.",
    "w.add": "Agregar activo", "w.asset": "Activo", "w.addBtn": "Agregar", "w.summary": "Resumen", "w.list": "Mi watchlist",
    "w.cap": "Activos seguidos, tendencia de 60 sesiones, señal del sistema y alertas", "w.spark": "Últimas 60 sesiones", "w.alertCol": "Alertas", "w.remove": "Quitar",
    "w.alerts": "Alertas de precio y de variación", "w.type": "Condición", "w.threshold": "Umbral", "w.create": "Crear alerta",
    "w.alCap": "Alertas configuradas (las disparadas llevan ícono y texto, no solo color)", "w.current": "Valor actual", "w.state": "Estado", "w.actions": "Acciones",
    "w.k.precio_sobre": "Precio mayor o igual a", "w.k.precio_bajo": "Precio menor o igual a", "w.k.var_1d_mayor_a_pct": "Variación diaria mayor o igual a (%)", "w.k.var_1d_menor_a_pct": "Variación diaria menor o igual a (%)",
    "w.fired": "⚠ DISPARADA", "w.waiting": "○ En espera", "w.off": "— Inactiva", "w.activate": "Activar", "w.deactivate": "Desactivar", "w.delete": "Eliminar",
    "w.already": "{t} ya está en su watchlist.", "w.added": "{t} agregado a la watchlist.", "w.removed": "{t} quitado de la watchlist.", "w.undo": "Deshacer",
    "w.sum": "Sigue {n} activos · {f} alerta(s) disparada(s) de {a} activa(s).", "w.empty": "Su watchlist está vacía. Agregue un activo arriba.",
    "w.errU": "Ingrese un umbral numérico. Para precios debe ser mayor que 0.", "w.okU": "Alerta creada para {t}.", "w.hintP": "Precio actual de {t}: {p}", "w.hintV": "Variación de hoy de {t}: {p}",
    "w.sparkA": "Últimas 60 sesiones de {t}: de {a} a {b}", "w.none": "—" },
  en: { "w.title": "Watchlist & alerts", "w.lead": "Your personal list is respected in every module (marked with ★). Alerts are checked against the last synthetic price in 10_dashboard_mercado.json.",
    "w.add": "Add asset", "w.asset": "Asset", "w.addBtn": "Add", "w.summary": "Summary", "w.list": "My watchlist",
    "w.cap": "Followed assets, 60-session trend, system signal and alerts", "w.spark": "Last 60 sessions", "w.alertCol": "Alerts", "w.remove": "Remove",
    "w.alerts": "Price and change alerts", "w.type": "Condition", "w.threshold": "Threshold", "w.create": "Create alert",
    "w.alCap": "Configured alerts (triggered ones carry an icon and text, not only color)", "w.current": "Current value", "w.state": "Status", "w.actions": "Actions",
    "w.k.precio_sobre": "Price at or above", "w.k.precio_bajo": "Price at or below", "w.k.var_1d_mayor_a_pct": "Daily change at or above (%)", "w.k.var_1d_menor_a_pct": "Daily change at or below (%)",
    "w.fired": "⚠ TRIGGERED", "w.waiting": "○ Waiting", "w.off": "— Inactive", "w.activate": "Activate", "w.deactivate": "Deactivate", "w.delete": "Delete",
    "w.already": "{t} is already in your watchlist.", "w.added": "{t} added to the watchlist.", "w.removed": "{t} removed from the watchlist.", "w.undo": "Undo",
    "w.sum": "Following {n} assets · {f} triggered alert(s) out of {a} active.", "w.empty": "Your watchlist is empty. Add an asset above.",
    "w.errU": "Enter a numeric threshold. For prices it must be greater than 0.", "w.okU": "Alert created for {t}.", "w.hintP": "Current price of {t}: {p}", "w.hintV": "Today's change of {t}: {p}",
    "w.sparkA": "Last 60 sessions of {t}: from {a} to {b}", "w.none": "—" }
});

let D, P, C, WDEF, ALERTS, lastRemoved = null;
window.init = async () => {
  let w11; [D, P, C, w11] = await Promise.all([loadJSON("10_dashboard_mercado.json"), loadJSON("02_precios_sinteticos_504d.json"),
    loadJSON("05_clasificadores_binarios.json"), loadJSON("11_watchlist_alertas_portafolio_demo.json")]);
  WDEF = w11.watchlist_inicial;
  ALERTS = store(KEYS.alerts) || w11.alertas.map(a => ({ ...a }));
  const opts = D.map(d => `<option value="${d.ticker}">${d.ticker} · ${d.nombre}</option>`).join("");
  $("#add").innerHTML = opts; $("#aT").innerHTML = opts;
  $("#aT").value = State.ticker(WDEF[0]);
  $("#fAdd").addEventListener("submit", e => { e.preventDefault(); addAsset($("#add").value); });
  $("#fAl").addEventListener("submit", e => { e.preventDefault(); createAlert(); });
  $("#aT").addEventListener("change", hint); $("#aK").addEventListener("change", hint);
  hint(); render();
};
const row = tk => D.find(x => x.ticker === tk);
function addAsset(tk) {
  const w = State.watch(WDEF);
  if (w.includes(tk)) { $("#addMsg").textContent = t("w.already", { t: tk }); return; }
  w.push(tk); State.setWatch(w); $("#addMsg").textContent = t("w.added", { t: tk }); render();
}
function hint() {
  const tk = $("#aT").value, k = $("#aK").value, d = row(tk);
  $("#aUhint").textContent = k.startsWith("precio") ? t("w.hintP", { t: tk, p: fmt.usd(d.ultimo) }) : t("w.hintV", { t: tk, p: fmt.pct(d.var_1d_pct) });
}
function value(a) { const d = row(a.ticker); return a.tipo.startsWith("precio") ? d.ultimo : d.var_1d_pct; }
function fired(a) {
  const v = value(a);
  return { precio_sobre: v >= a.umbral, precio_bajo: v <= a.umbral, var_1d_mayor_a_pct: v >= a.umbral, var_1d_menor_a_pct: v <= a.umbral }[a.tipo];
}
function createAlert() {
  const u = parseFloat($("#aU").value), k = $("#aK").value, inp = $("#aU");
  if (!Number.isFinite(u) || (k.startsWith("precio") && u <= 0)) {
    inp.setAttribute("aria-invalid", "true"); $("#aUmsg").className = "fieldmsg err"; $("#aUmsg").textContent = t("w.errU"); inp.focus(); return;
  }
  inp.removeAttribute("aria-invalid");
  ALERTS.push({ ticker: $("#aT").value, tipo: k, umbral: u, activa: true }); store(KEYS.alerts, ALERTS);
  $("#aUmsg").className = "fieldmsg ok"; $("#aUmsg").textContent = t("w.okU", { t: $("#aT").value }); inp.value = ""; render();
}
function spark(tk) {
  const s = P.cierres[tk].slice(-60), mn = Math.min(...s), mx = Math.max(...s), up = s[59] >= s[0];
  const pts = s.map((v, i) => `${(i * 3).toFixed(1)},${(28 - 26 * (v - mn) / (mx - mn || 1)).toFixed(1)}`).join(" ");
  return `<svg width="180" height="30" viewBox="0 0 180 30" role="img" aria-label="${t("w.sparkA", { t: tk, a: fmt.n(s[0]), b: fmt.n(s[59]) })}" style="max-width:100%"><polyline fill="none" stroke="var(${up ? "--up" : "--dn"})" stroke-width="1.6" points="${pts}"/></svg>`;
}
function stateTxt(a) { return !a.activa ? `<span class="mut">${t("w.off")}</span>` : (fired(a) ? `<strong class="pill" style="color:var(--warn)">${t("w.fired")}</strong>` : `<span>${t("w.waiting")}</span>`); }
function render() {
  const w = State.watch(WDEF);
  $("#tb").innerHTML = w.length ? w.map(tk => {
    const d = row(tk), al = ALERTS.filter(a => a.ticker === tk && a.activa);
    return `<tr><th scope="row"><a href="regresion.html?t=${tk}">★ ${tk}</a></th><td>${fmt.n(d.ultimo)}</td><td>${chg(d.var_1d_pct)}</td><td class="l">${spark(tk)}</td>
      <td><a href="clasificacion.html?t=${tk}">${sig(C.predicciones[tk].consenso)}</a></td>
      <td class="l">${al.length ? al.map(a => `<span class="tag">${t("w.k." + a.tipo)} ${fmt.n(a.umbral)}${fired(a) ? " · " + t("w.fired") : ""}</span>`).join(" ") : t("w.none")}</td>
      <td><button type="button" data-q="${tk}" aria-label="${t("watch.del", { t: tk })}">✕</button></td></tr>`;
  }).join("") : `<tr><td colspan="7" class="l">${t("w.empty")}</td></tr>`;
  $$("[data-q]").forEach(b => b.onclick = () => {
    const tk = b.dataset.q, ww = State.watch(WDEF); lastRemoved = { tk, i: ww.indexOf(tk) };
    State.setWatch(ww.filter(x => x !== tk)); render();
    $("#addMsg").innerHTML = `${t("w.removed", { t: tk })} <button type="button" id="undo">${t("w.undo")}</button>`;
    $("#undo").onclick = () => { const w2 = State.watch(WDEF); w2.splice(lastRemoved.i, 0, lastRemoved.tk); State.setWatch(w2); $("#addMsg").textContent = t("w.added", { t: lastRemoved.tk }); render(); };
    $("#undo").focus();
  });
  $("#al").innerHTML = ALERTS.map((a, i) => `<tr${a.activa && fired(a) ? ' style="border-left:5px solid var(--warn)"' : ""}><th scope="row">${a.ticker}</th><td class="l">${t("w.k." + a.tipo)}</td>
    <td>${a.tipo.startsWith("precio") ? fmt.usd(a.umbral) : fmt.pct(a.umbral)}</td><td>${a.tipo.startsWith("precio") ? fmt.usd(value(a)) : fmt.pct(value(a))}</td>
    <td class="l">${stateTxt(a)}</td><td><button type="button" data-tg="${i}">${a.activa ? t("w.deactivate") : t("w.activate")}</button> <button type="button" data-del="${i}" aria-label="${t("w.delete")} ${a.ticker}">${t("w.delete")}</button></td></tr>`).join("");
  $$("[data-tg]").forEach(b => b.onclick = () => { const a = ALERTS[+b.dataset.tg]; a.activa = !a.activa; store(KEYS.alerts, ALERTS); render(); });
  $$("[data-del]").forEach(b => b.onclick = () => { ALERTS.splice(+b.dataset.del, 1); store(KEYS.alerts, ALERTS); render(); });
  const act = ALERTS.filter(a => a.activa);
  $("#sum").textContent = t("w.sum", { n: w.length, f: act.filter(fired).length, a: act.length });
}
