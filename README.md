# Ernesto Investing AI — Sistema web integrado (S13 · Equipo A)

**Interacción Hombre-Computador (202W0606) · FISI-UNMSM · 2026-II · Trabajo grupal de la Semana 13**

Sistema bursátil **educativo** que integra en **un solo sitio** los 9 módulos de Ernesto Investing AI: Dashboard, Watchlist y alertas, Trading simulado, Leaderboard, **Clasificación binaria**, **Regresión a 30 sesiones**, **Optimizador (Markowitz, NSGA-II, NSGA-III)**, **Portafolios en 3 niveles de riesgo** y **Backtesting**. Está hecho en HTML, CSS y JavaScript puro, sin compilación ni frameworks, y lee todos sus números de los 13 archivos JSON de `data/`.

> ⚠ **Datos sintéticos · resultados simulados.** Los precios son sintéticos, anclados al cierre del 11-nov-2026. Ningún modelo fue entrenado y NSGA-II/III no se ejecutaron: sus salidas vienen simuladas en los JSON. **No es asesoría de inversión.**

| Enlace | URL |
|---|---|
| Sitio publicado (GitHub Pages) | https://rony-grijalva.github.io/S13_EquipoA_ernesto-investing-ai/ |
| Repositorio | https://github.com/Rony-Grijalva/S13_EquipoA_ernesto-investing-ai |
| Archivo de Figma Make (solo lectura) | https://www.figma.com/make/NkGIziCFcZKELNtjeFlquk/S13_EquipoA_Figma_Ernesto_Investing_AI |

## Cómo ejecutarlo

Los navegadores bloquean `fetch()` en archivos abiertos con doble clic. Use un servidor local:

```bash
python -m http.server 8000      # desde la raíz del repositorio
# abrir http://127.0.0.1:8000
```

## Estructura

```
├── index.html            Dashboard (26 activos, velas de 120 sesiones, consenso y proyección por activo)
├── watchlist.html        Watchlist y alertas (persisten; las disparadas llevan ícono y texto)
├── trading.html          Trading simulado (validación por campo; recibe el portafolio elegido)
├── leaderboard.html      Liga (su retorno sale de su portafolio de Trading)
├── clasificacion.html    18 clasificadores, mapa de calor 26 × 18, consenso, métricas, matriz de confusión
├── regresion.html        18 regresores, mediana, banda p10–p90, cono de volatilidad, métricas
├── optimizador.html      Curva de Markowitz + frentes NSGA-II y NSGA-III, composición al seleccionar
├── portafolios.html      Conservador / Moderado / Agresivo, razones por activo, «Llevar a Trading»
├── backtesting.html      Curvas base 100, drawdown, métricas, rebalanceos e interpretación generada
├── css/styles.css        Hoja de estilos ÚNICA (tema claro/oscuro, contraste ≥ 4,5:1)
├── js/common.js          Núcleo ÚNICO: navegación, tema, idioma ES-PE/EN-US (Intl), estado compartido
├── js/<módulo>.js        Lógica de cada página (comentada en español)
├── data/                 13 JSON sintéticos del curso (sin modificar)
├── figma-src/            Código fuente descargado de Figma Make, sin editar
├── tests/                verificar_sitio.mjs (Playwright), verificar_en_navegador.html, vista_movil.html
├── docs/capturas/        Capturas de cada módulo (claro, oscuro, móvil, inglés)
├── PROMPTS_USADOS.md     Prompts literales usados con Claude y Figma Make
└── LICENSE               CC BY 4.0 (material base del curso)
```

## Integración (requisitos transversales)

| Requisito | Cómo se cumple |
|---|---|
| Un solo sitio | Una barra con los 9 módulos generada por `js/common.js`; un solo `css/styles.css` |
| Estado compartido (`localStorage`) | `eia_watch` (watchlist, ★ en todos los módulos), `eia_port` (Trading → Leaderboard), `eia_elegido` (Portafolios → Trading y Leaderboard), `eia_ticker` (activo seleccionado), `eia_theme`, `eia_lang` |
| Coherencia de datos | El precio de cada activo vive en `10_dashboard_mercado.json` (y coincide con 02 y 06); la fecha de cierre se lee de `13_patrones_y_parametros.json` y se muestra en la cabecera de todas las páginas |
| Navegación entre módulos | Clasificación → Regresión → Optimizador mediante `?t=TICKER`; Portafolios → Trading → Leaderboard |
| Tema claro/oscuro | Botón en la cabecera; los gráficos ECharts se redibujan con la paleta del tema |
| Vista móvil | Sin desplazamiento horizontal a 390 px (verificado en las 9 páginas) |
| Aviso de simulación | Visible en cada módulo de predicción, optimización y backtesting |
| Bonificación i18n | Selector ES-PE / EN-US; números, monedas y fechas con `Intl.NumberFormat` e `Intl.DateTimeFormat`; cadenas con variables nombradas, sin concatenar |

## Verificación

- `tests/verificar_en_navegador.html`: abrir con el servidor local en marcha. Comprueba las 9 páginas a 1280 px y a 390 px (errores, desborde, navegación, aviso, tercera clase, `scope`) y los criterios de datos de la guía.
- `tests/verificar_sitio.mjs`: la misma prueba con Playwright (`npm i -D playwright && npx playwright install chromium`, luego `node tests/verificar_sitio.mjs`).
- `tests/vista_movil.html?p=portafolios,clasificacion,backtesting`: vista de 3 teléfonos de 390 px para revisión manual.

## Publicar en GitHub Pages

1. Cree el repositorio **propio del equipo** (no haga fork) y suba el contenido de esta carpeta.
2. *Settings → Pages → Deploy from a branch*, rama `main`, carpeta `/ (root)`.
3. Espere unos minutos, abra `https://<usuario>.github.io/<repositorio>/` y pruebe desde el celular.

## Integrantes (Equipo A)

Por alias, como pide la guía (prompt P02): **EqA-01 a EqA-10**. Los nombres completos y códigos figuran en la carátula del informe entregado en el Aula Virtual.

## Uso de IA y licencia

El código se generó con asistencia de IA (Claude, de Anthropic) a partir de los prompts ESLBHP del Anexo A de la guía; el equipo lo ejecutó, verificó y declara (ver `PROMPTS_USADOS.md`). Datos y sistema base: © 2026 Ernesto D. Cancho-Rodríguez, CC BY 4.0. No se publican credenciales ni claves en este repositorio.
