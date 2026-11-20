/* Trading simulado · lee 10_dashboard_mercado.json y 11_watchlist_alertas_portafolio_demo.json.
   Estado compartido: eia_port (efectivo y posiciones) y eia_elegido (portafolio llevado desde Portafolios). */
addI18n({
  es: { "tr.title": "Trading simulado", "tr.lead": "Órdenes a mercado al último precio sintético. El efectivo y las posiciones se guardan en este navegador y alimentan el Leaderboard.",
    "tr.capital": "Monto a invertir (US$)", "tr.gen": "Generar órdenes propuestas", "tr.dismiss": "Descartar recomendación", "tr.propCap": "Órdenes de compra propuestas (desmarque las que quiera ignorar)",
    "tr.include": "Incluir", "tr.price": "Precio", "tr.qty": "Cantidad", "tr.amount": "Importe", "tr.exec": "Ejecutar órdenes seleccionadas", "tr.order": "Orden",
    "tr.side": "Lado", "tr.buy": "Comprar", "tr.sell": "Vender", "tr.send": "Enviar orden", "tr.reset": "Reiniciar demo", "tr.values": "Valores", "tr.cash": "Efectivo",
    "tr.nav": "Valor del portafolio", "tr.toLb": "Ver mi posición en el Leaderboard →", "tr.positions": "Posiciones", "tr.posCap": "Posiciones abiertas valorizadas al último precio sintético",
    "tr.avg": "Costo prom.", "tr.value": "Valor", "tr.pl": "Ganancia / pérdida",
    "tr.chosen": "Portafolio elegido: {n}", "tr.chDesc": "Llevado desde el módulo Portafolios el {f}. Pesos: {w}. Usted decide: puede ignorar cualquier orden o descartar toda la recomendación.",
    "tr.errQ": "Ingrese una cantidad entera mayor o igual a 1.", "tr.errCash": "Efectivo insuficiente: la orden cuesta {c} y tiene {e}. Máximo comprable: {m} unidades.",
    "tr.errSell": "No tiene esa cantidad para vender: posee {h} unidades de {t}.", "tr.ok": "Orden ejecutada: {lado} de {q} {t} a {p}.",
    "tr.okBuy": "compra", "tr.okSell": "venta", "tr.resetOk": "Demo reiniciada.", "tr.hintQ": "Precio de {t}: {p} · Máximo comprable con su efectivo: {m}",
    "tr.hold": "Posee {h} unidades de {t}.", "tr.errCap": "Ingrese un monto mayor que 0 y no mayor que su efectivo ({e}).",
    "tr.execOk": "Se ejecutaron {n} órdenes por {c}.", "tr.execNone": "No hay órdenes seleccionadas con cantidad mayor que 0.",
    "tr.retTxt": "Retorno frente al valor inicial de la demo: {r}", "tr.dismissed": "Recomendación descartada. Puede elegir otra en Portafolios.", "tr.empty": "Sin posiciones." },
  en: { "tr.title": "Paper trading", "tr.lead": "Market orders at the last synthetic price. Cash and positions are stored in this browser and feed the Leaderboard.",
    "tr.capital": "Amount to invest (US$)", "tr.gen": "Generate proposed orders", "tr.dismiss": "Dismiss recommendation", "tr.propCap": "Proposed buy orders (untick the ones you want to ignore)",
    "tr.include": "Include", "tr.price": "Price", "tr.qty": "Quantity", "tr.amount": "Amount", "tr.exec": "Execute selected orders", "tr.order": "Order",
    "tr.side": "Side", "tr.buy": "Buy", "tr.sell": "Sell", "tr.send": "Send order", "tr.reset": "Reset demo", "tr.values": "Values", "tr.cash": "Cash",
    "tr.nav": "Portfolio value", "tr.toLb": "See my rank in the Leaderboard →", "tr.positions": "Positions", "tr.posCap": "Open positions valued at the last synthetic price",
    "tr.avg": "Avg. cost", "tr.value": "Value", "tr.pl": "Profit / loss",
    "tr.chosen": "Chosen portfolio: {n}", "tr.chDesc": "Brought from the Portfolios module on {f}. Weights: {w}. You decide: ignore any order or dismiss the whole recommendation.",
    "tr.errQ": "Enter a whole quantity of at least 1.", "tr.errCash": "Insufficient cash: the order costs {c} and you have {e}. Maximum you can buy: {m} units.",
    "tr.errSell": "You do not hold that quantity: you have {h} units of {t}.", "tr.ok": "Order executed: {lado} of {q} {t} at {p}.",
    "tr.okBuy": "buy", "tr.okSell": "sell", "tr.resetOk": "Demo reset.", "tr.hintQ": "Price of {t}: {p} · Max you can buy with your cash: {m}",
    "tr.hold": "You hold {h} units of {t}.", "tr.errCap": "Enter an amount greater than 0 and not above your cash ({e}).",
    "tr.execOk": "{n} orders executed for {c}.", "tr.execNone": "No selected orders with quantity above 0.",
    "tr.retTxt": "Return versus the demo's initial value: {r}", "tr.dismissed": "Recommendation dismissed. You can pick another one in Portfolios.", "tr.empty": "No positions." }
});

let D, DEMO, S, PROPS = [];
window.init = async () => {
  D = await loadJSON("10_dashboard_mercado.json");
  DEMO = (await loadJSON("11_watchlist_alertas_portafolio_demo.json")).portafolio_demo;
  S = State.port() || JSON.parse(JSON.stringify(DEMO));
  const W = await watchNow();
  $("#t").innerHTML = D.map(d => `<option value="${d.ticker}">${star(d.ticker, W)}${d.ticker} · ${d.nombre}</option>`).join("");
  const tk = State.ticker("SPY"); if (D.some(d => d.ticker === tk)) $("#t").value = tk;
  $("#f").addEventListener("submit", e => { e.preventDefault(); order(); });
  $("#t").addEventListener("change", () => { State.setTicker($("#t").value); hints(); });
  $("#q").addEventListener("input", () => { $("#q").removeAttribute("aria-invalid"); $("#qMsg").textContent = ""; });
  $("#rs").addEventListener("click", () => { S = JSON.parse(JSON.stringify(DEMO)); State.setPort(S); render(t("tr.resetOk")); });
  chosen(); render();
};
const px = tk => D.find(d => d.ticker === tk).ultimo;
const side = () => $$('input[name="s"]').find(r => r.checked).value;
function baseValue() { return DEMO.efectivo + DEMO.posiciones.reduce((a, p) => a + p.cantidad * p.costo, 0); }
function hints() {
  const tk = $("#t").value, p = px(tk), pos = S.posiciones.find(x => x.ticker === tk);
  $("#qHint").textContent = t("tr.hintQ", { t: tk, p: fmt.usd(p), m: Math.floor(S.efectivo / p) });
  $("#tMsg").textContent = pos ? t("tr.hold", { h: pos.cantidad, t: tk }) : "";
}
function fieldError(msg) { $("#q").setAttribute("aria-invalid", "true"); $("#qMsg").className = "fieldmsg err"; $("#qMsg").textContent = msg; $("#q").focus(); }
function buy(tk, q) {
  const p = px(tk), pos = S.posiciones.find(x => x.ticker === tk);
  S.efectivo = +(S.efectivo - q * p).toFixed(2);
  if (pos) { pos.costo = +((pos.costo * pos.cantidad + q * p) / (pos.cantidad + q)).toFixed(4); pos.cantidad += q; }
  else S.posiciones.push({ ticker: tk, cantidad: q, costo: p });
}
function order() {
  const tk = $("#t").value, raw = $("#q").value, q = Number(raw), p = px(tk), pos = S.posiciones.find(x => x.ticker === tk);
  if (!Number.isInteger(q) || q < 1) return fieldError(t("tr.errQ"));
  if (side() === "C") {
    if (q * p > S.efectivo) return fieldError(t("tr.errCash", { c: fmt.usd(q * p), e: fmt.usd(S.efectivo), m: Math.floor(S.efectivo / p) }));
    buy(tk, q);
  } else {
    if (!pos || pos.cantidad < q) return fieldError(t("tr.errSell", { h: pos ? pos.cantidad : 0, t: tk }));
    pos.cantidad -= q; S.efectivo = +(S.efectivo + q * p).toFixed(2); S.posiciones = S.posiciones.filter(x => x.cantidad > 0);
  }
  $("#q").removeAttribute("aria-invalid"); $("#qMsg").textContent = "";
  State.setPort(S); render(t("tr.ok", { lado: side() === "C" ? t("tr.okBuy") : t("tr.okSell"), q, t: tk, p: fmt.usd(p) }));
}
/* Portafolio llevado desde el módulo Portafolios (estado compartido) */
function chosen() {
  const ch = State.chosen(); const box = $("#chosenBox");
  if (!ch) { box.hidden = true; return; }
  box.hidden = false;
  $("#h-ch").textContent = t("tr.chosen", { n: ch.nivel });
  $("#chDesc").textContent = t("tr.chDesc", { f: fmt.date(ch.fecha), w: Object.entries(ch.pesos).map(([k, v]) => `${k} ${fmt.pctU(v * 100)}`).join(", ") });
  $("#cap").value = Math.floor(S.efectivo);
  $("#gen").onclick = () => {
    const c = Number($("#cap").value);
    if (!(c > 0) || c > S.efectivo) { $("#cap").setAttribute("aria-invalid", "true"); $("#capMsg").className = "fieldmsg err"; $("#capMsg").textContent = t("tr.errCap", { e: fmt.usd(S.efectivo) }); $("#cap").focus(); return; }
    $("#cap").removeAttribute("aria-invalid"); $("#capMsg").textContent = "";
    PROPS = Object.entries(ch.pesos).map(([tk, w]) => { const p = px(tk), q = Math.floor(c * w / p); return { tk, w, p, q, on: q > 0 }; });
    $("#prop").innerHTML = PROPS.map((o, i) => `<tr><td><input type="checkbox" data-i="${i}" ${o.on ? "checked" : ""} aria-label="${t("tr.include")} ${o.tk}"></td>
      <th scope="row">${o.tk}</th><td>${fmt.pctU(o.w * 100)}</td><td>${fmt.usd(o.p)}</td><td>${o.q}</td><td>${fmt.usd(o.q * o.p)}</td></tr>`).join("");
    $$("#prop input").forEach(cb => cb.onchange = () => PROPS[+cb.dataset.i].on = cb.checked);
    $("#propBox").hidden = false; $("#prop input")?.focus();
  };
  $("#exec").onclick = () => {
    const sel = PROPS.filter(o => o.on && o.q > 0); const cost = sel.reduce((a, o) => a + o.q * o.p, 0);
    if (!sel.length) { $("#msg").className = "fieldmsg err"; $("#msg").textContent = t("tr.execNone"); return; }
    if (cost > S.efectivo) { $("#msg").className = "fieldmsg err"; $("#msg").textContent = t("tr.errCap", { e: fmt.usd(S.efectivo) }); return; }
    sel.forEach(o => buy(o.tk, o.q)); State.setPort(S); $("#propBox").hidden = true;
    render(t("tr.execOk", { n: sel.length, c: fmt.usd(cost) }));
  };
  $("#dismiss").onclick = () => { State.setChosen(null); box.hidden = true; render(t("tr.dismissed")); };
}
function render(msg) {
  $("#msg").className = "fieldmsg ok"; $("#msg").textContent = msg || "";
  let nav = S.efectivo;
  $("#tb").innerHTML = S.posiciones.length ? S.posiciones.map(x => {
    const p = px(x.ticker), pl = (p - x.costo) * x.cantidad; nav += p * x.cantidad;
    return `<tr><th scope="row">${x.ticker}</th><td>${x.cantidad}</td><td>${fmt.n(x.costo)}</td><td>${fmt.n(p)}</td><td>${fmt.usd(p * x.cantidad)}</td>
      <td class="${fmt.cls(pl)}">${pl > 0 ? "▲" : (pl < 0 ? "▼" : "■")} ${fmt.usd(pl)}</td></tr>`;
  }).join("") : `<tr><td colspan="6" class="l">${t("tr.empty")}</td></tr>`;
  $("#cash").textContent = fmt.usd(S.efectivo); $("#nav").textContent = fmt.usd(nav);
  $("#ret").innerHTML = t("tr.retTxt", { r: chg((nav / baseValue() - 1) * 100) });
  hints();
}
