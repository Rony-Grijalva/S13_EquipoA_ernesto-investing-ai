// =====================================================================
// tests/verificar_sitio.mjs — Prueba automática del sitio integrado (prompt P07, paso 5)
// Abre las 9 páginas a 1280 px y a 390 px y reporta:
//   - errores de consola y excepciones de página,
//   - desborde horizontal (scrollWidth > ancho de ventana),
//   - elementos clave: navegación única con 9 enlaces, «Saltar al contenido»,
//     aviso de datos sintéticos/simulados y ausencia de mensajes de error.
// Requisitos:  npm i -D playwright   y   npx playwright install chromium
// Uso:         python -m http.server 8000   (en otra terminal, desde la raíz)
//              node tests/verificar_sitio.mjs [http://127.0.0.1:8000]
// =====================================================================
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://127.0.0.1:8000";
const PAGES = ["index", "watchlist", "trading", "leaderboard", "clasificacion", "regresion", "optimizador", "portafolios", "backtesting"];
const PRED = new Set(["clasificacion", "regresion", "optimizador", "portafolios", "backtesting"]);
const SIZES = [{ w: 1280, h: 900 }, { w: 390, h: 844 }];

const browser = await chromium.launch();
const rows = [];
let fails = 0;
for (const size of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: size.w, height: size.h } });
  for (const p of PAGES) {
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    page.on("pageerror", e => errors.push(String(e)));
    await page.goto(`${BASE}/${p}.html`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const r = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      navLinks: document.querySelectorAll("nav.mods a").length,
      skip: !!document.querySelector("a.skip[href='#contenido']"),
      aviso: !!document.querySelector("[data-sim]") && document.querySelector("[data-sim]").textContent.length > 20,
      alerts: [...document.querySelectorAll(".err[role=alert]")].map(e => e.textContent),
      tercera: /NEUTRO|MANTENER|HOLD/.test(document.body.innerText)
    }));
    const ok = !errors.length && !r.overflow && r.navLinks === 9 && r.skip && r.aviso && !r.alerts.length && !(PRED.has(p) && r.tercera);
    if (!ok) fails++;
    rows.push({ pagina: p, ancho: size.w, consola: errors.length, desborde: r.overflow, enlaces_nav: r.navLinks, saltar: r.skip, aviso: r.aviso, tercera_clase: r.tercera, ok });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.table(rows);
console.log(fails ? `✘ ${fails} verificaciones fallaron` : "✔ 18/18 verificaciones superadas (9 páginas × 2 anchos)");
process.exit(fails ? 1 : 0);
