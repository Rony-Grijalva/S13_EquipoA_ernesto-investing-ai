/* Leaderboard · lee 12_leaderboard_liga.json, 10_dashboard_mercado.json y 11_watchlist_alertas_portafolio_demo.json.
   El retorno del usuario sale de su portafolio de Trading (eia_port); también muestra el portafolio elegido (eia_elegido). */
addI18n({
  es: { "lb.title": "Leaderboard de la liga", "lb.lead": "Ranking de traders ficticios. Su fila se calcula con el portafolio del módulo Trading (efectivo + posiciones al último precio) frente al valor inicial de la demo.",
    "lb.rank": "Ranking", "lb.cap": "Liga de traders ficticios (12_leaderboard_liga.json) y su posición", "lb.alias": "Alias", "lb.team": "Equipo", "lb.ret": "Retorno",
    "lb.ops": "Operaciones", "lb.sharpe": "Sharpe", "lb.you": "◆ Usted (su portafolio de Trading)", "lb.pos": "Su posición", "lb.of": "{p}.º de {n}",
    "lb.nav": "Valor de su portafolio", "lb.chosen": "Portafolio elegido", "lb.none": "Aún no eligió un nivel de riesgo.", "lb.choose": "Elegir en Portafolios →",
    "lb.chInfo": "{n} · retorno esperado {r} · volatilidad {v}" },
  en: { "lb.title": "League leaderboard", "lb.lead": "Ranking of fictitious traders. Your row is computed from the Trading portfolio (cash + positions at the last price) versus the demo's initial value.",
    "lb.rank": "Ranking", "lb.cap": "League of fictitious traders (12_leaderboard_liga.json) and your rank", "lb.alias": "Alias", "lb.team": "Team", "lb.ret": "Return",
    "lb.ops": "Trades", "lb.sharpe": "Sharpe", "lb.you": "◆ You (your Trading portfolio)", "lb.pos": "Your rank", "lb.of": "#{p} of {n}",
    "lb.nav": "Your portfolio value", "lb.chosen": "Chosen portfolio", "lb.none": "You have not chosen a risk level yet.", "lb.choose": "Choose in Portfolios →",
    "lb.chInfo": "{n} · expected return {r} · volatility {v}" }
});
window.init = async () => {
  const [L, D, w, PF] = await Promise.all([loadJSON("12_leaderboard_liga.json"), loadJSON("10_dashboard_mercado.json"),
    loadJSON("11_watchlist_alertas_portafolio_demo.json"), loadJSON("08_portafolios_3_niveles_riesgo.json")]);
  const S = State.port() || w.portafolio_demo, px = tk => D.find(d => d.ticker === tk).ultimo;
  const base = w.portafolio_demo.efectivo + w.portafolio_demo.posiciones.reduce((a, p) => a + p.cantidad * p.costo, 0);
  const nav = S.efectivo + S.posiciones.reduce((a, p) => a + p.cantidad * px(p.ticker), 0);
  const yo = { alias: t("lb.you"), equipo: "—", retorno_liga_pct: (nav / base - 1) * 100, operaciones: "—", sharpe: "—", yo: 1 };
  const all = [...L, yo].sort((a, b) => b.retorno_liga_pct - a.retorno_liga_pct), pos = all.indexOf(yo) + 1;
  const ch = State.chosen(), lvl = ch && PF.niveles.find(n => n.nivel === ch.nivel);
  $("#me").innerHTML = `<div class="card kpi"><div class="mut">${t("lb.pos")}</div><div class="v">${t("lb.of", { p: pos, n: all.length })}</div><div>${chg(yo.retorno_liga_pct)}</div></div>
    <div class="card kpi"><div class="mut">${t("lb.nav")}</div><div class="v">${fmt.usd(nav)}</div><a href="trading.html">${t("goto.trading")}</a></div>
    <div class="card"><div class="mut">${t("lb.chosen")}</div><p>${lvl ? t("lb.chInfo", { n: `<strong>${lvl.nivel}</strong>`, r: fmt.pctU(lvl.retorno_esperado_anual_pct), v: fmt.pctU(lvl.volatilidad_anual_pct) }) : t("lb.none")}</p><a href="portafolios.html">${t("lb.choose")}</a></div>`;
  $("#tb").innerHTML = all.map((x, i) => `<tr${x.yo ? ' class="sel" style="background:var(--hl);font-weight:700"' : ""}><td>${i + 1}</td>
    <${x.yo ? 'th scope="row" class="l"' : 'td class="l"'}>${x.alias}</${x.yo ? "th" : "td"}><td>${x.equipo}</td><td>${chg(x.retorno_liga_pct)}</td>
    <td>${x.operaciones}</td><td>${typeof x.sharpe === "number" ? fmt.n(x.sharpe) : x.sharpe}</td></tr>`).join("");
};
