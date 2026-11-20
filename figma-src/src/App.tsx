import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./icons";
import {
  assets,
  colors,
  exportCSV,
  fmt,
  models,
  probability,
  profiles,
  simulated,
  type Page,
  type Profile,
} from "./data";
import {
  CapitalChart,
  Donut,
  frontierPoints,
  OptimizerChart,
  RegressionChart,
  Sparkline,
} from "./charts";

const navigation: { name: Page; icon: IconName }[] = [
  { name: "Clasificación", icon: "grid" },
  { name: "Regresión 30 días", icon: "chart" },
  { name: "Optimizador", icon: "sparkles" },
  { name: "Portafolios", icon: "wallet" },
  { name: "Backtesting", icon: "history" },
];
const descriptions: Record<Page, string> = {
  Portafolios: "Diferentes perfiles. Una misma visión: invertir con inteligencia.",
  Clasificación: "18 modelos, 26 activos. Una perspectiva más amplia para cada decisión.",
  "Regresión 30 días": "Explora escenarios futuros, sin perder de vista la incertidumbre.",
  Optimizador: "Encuentra el punto de equilibrio entre el riesgo y tus objetivos.",
  Backtesting: "Mira hacia atrás para entender mejor el camino hacia adelante.",
};

function Button({
  children,
  onClick,
  primary = false,
  className = "",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  primary?: boolean;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      className={`button ${primary ? "button-primary" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`badge ${className}`}>{children}</span>;
}
function Segment({
  values,
  value,
  onChange,
  label,
}: {
  values: string[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {values.map((v) => (
        <button
          key={v}
          aria-pressed={value === v}
          className={value === v ? "selected" : ""}
          onClick={() => onChange(v)}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
function PanelHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="panel-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    ref.current?.showModal();
    return () => {
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? "modal-wide" : ""}`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="modal-heading">
        <h2>{title}</h2>
        <button className="icon-button" onClick={onClose} aria-label="Cerrar diálogo">
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    const current = decodeURIComponent(window.location.hash.slice(1));
    return navigation.some((n) => n.name === current) ? (current as Page) : "Portafolios";
  });
  const [dark, setDark] = useState(false);
  const [help, setHelp] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [detail, setDetail] = useState<Profile | null>(null);
  const [backtestProfile, setBacktestProfile] = useState<Profile | null>(null);
  function navigate(next: Page) {
    setPage(next);
    window.location.hash = encodeURIComponent(next);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  useEffect(() => {
    const onHash = () => {
      const next = decodeURIComponent(window.location.hash.slice(1));
      if (navigation.some((n) => n.name === next)) setPage(next as Page);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  const runBacktest = (profile: Profile) => {
    setDetail(null);
    setBacktestProfile(profile);
    navigate("Backtesting");
  };

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <header className="site-header">
        <a
          className="brand"
          href="#Portafolios"
          onClick={(e) => {
            e.preventDefault();
            navigate("Portafolios");
          }}
          aria-label="Ernesto Investing AI, ir a Portafolios"
        >
          <span className="brand-mark">
            <svg viewBox="0 0 30 30" fill="none" aria-hidden="true">
              <path d="M6 21V12h5v9H6Zm7 0V8h5v13h-5Zm7 0V4h5v17h-5Z" fill="currentColor" />
              <path d="M5 25h20" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
          <span className="brand-type">
            ernesto<span className="brand-dot">.</span>
            <small>INVESTING AI</small>
          </span>
        </a>
        <nav
          aria-label="Navegación principal"
          className={`main-nav ${mobileMenu ? "nav-open" : ""}`}
        >
          {navigation.map((n) => (
            <a
              key={n.name}
              href={`#${encodeURIComponent(n.name)}`}
              aria-current={page === n.name ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigate(n.name);
              }}
              className={page === n.name ? "active" : ""}
            >
              <Icon name={n.icon} size={17} />
              <span>{n.name}</span>
              {n.name === "Optimizador" && <span className="nav-new">AI</span>}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button help-button"
            onClick={() => setHelp(true)}
            aria-label="Abrir guía de la plataforma"
          >
            <Icon name="help" size={19} />
          </button>
          <button
            className="icon-button theme-button"
            aria-label={`Activar tema ${dark ? "claro" : "oscuro"}`}
            onClick={() => setDark(!dark)}
          >
            <Icon name={dark ? "sun" : "moon"} size={19} />
          </button>
          <span className="header-divider" />
          <button
            className="avatar"
            aria-label="Información del espacio educativo"
            onClick={() => setHelp(true)}
          >
            EA
          </button>
          <button
            className="icon-button mobile-menu"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-expanded={mobileMenu}
            aria-label="Abrir menú de navegación"
          >
            <Icon name={mobileMenu ? "close" : "menu"} />
          </button>
        </div>
      </header>
      <div className="workspace-bar">
        <div className="workspace-breadcrumb">
          <Icon name="globe" size={14} />
          <span>Workspace</span>
          <Icon name="chevron" size={11} />
          <strong>Laboratorio de inversión</strong>
        </div>
        <div className="workspace-right">
          <span className="status-dot" /> Entorno educativo{" "}
          <span className="workspace-separator">|</span> <span>Mercado de EE. UU. y Perú</span>
        </div>
      </div>
      <main id="main-content" tabIndex={-1}>
        <div className="page-heading">
          <div>
            <div className="heading-eyebrow">
              <span /> INTELIGENCIA QUE TE ACOMPAÑA
            </div>
            <h1>
              {page}
              {page === "Portafolios" && <span className="title-dot">.</span>}
            </h1>
            <p>{descriptions[page]}</p>
          </div>
          <div className="page-actions">
            <Button
              onClick={() =>
                exportCSV(`ernesto-perfiles-de-referencia.csv`, [
                  ["Ernesto Investing AI", simulated],
                  ["Perfil", "Retorno anual simulado (%)", "Volatilidad (%)", "Sharpe", "CVaR (%)"],
                  ...profiles.map((p) => [p.name, p.return, p.volatility, p.sharpe, p.cvar]),
                ])
              }
            >
              <Icon name="download" size={16} />
              <span>Exportar perfiles</span>
            </Button>
            {page === "Portafolios" && (
              <Button
                primary
                onClick={() => {
                  setBacktestProfile(null);
                  navigate("Backtesting");
                }}
              >
                <Icon name="history" size={16} />
                Ver backtesting
                <Icon name="arrow" size={16} />
              </Button>
            )}
          </div>
        </div>
        <div className="simulation-notice">
          <span>
            <Icon name="info" size={15} />
            <strong>{simulated}</strong>
            <span className="notice-extra">
              Explora, aprende y compara. No es asesoría de inversión.
            </span>
          </span>
          <span className="notice-date">
            <Icon name="clock" size={13} /> Corte: 24 oct 2025
          </span>
        </div>
        {page === "Portafolios" && (
          <Portfolios
            onDetail={setDetail}
            onOptimize={() => navigate("Optimizador")}
            onBacktest={runBacktest}
          />
        )}
        {page === "Clasificación" && <Classification />}
        {page === "Regresión 30 días" && <Regression />}
        {page === "Optimizador" && <Optimizer onBacktest={runBacktest} />}
        {page === "Backtesting" && <Backtesting initialProfile={backtestProfile} />}
        <footer>
          <div className="footer-brand">
            <span className="tiny-mark">e.</span>
            <span>Decisiones informadas. Futuros posibles.</span>
          </div>
          <span>
            Ernesto Investing AI <span className="footer-divider">/</span> Laboratorio educativo ·
            2025
          </span>
          <button onClick={() => setHelp(true)}>
            Metodología y alcance
            <Icon name="external" size={12} />
          </button>
        </footer>
      </main>
      {detail && (
        <Modal
          title={`Portafolio ${detail.name.toLowerCase()}`}
          onClose={() => setDetail(null)}
          wide
        >
          <div className="detail-layout">
            <div>
              <Donut profile={detail} large />
              <p className="text-center muted">{detail.tagline}</p>
            </div>
            <div>
              <p className="modal-intro">
                Una distribución diseñada para un perfil de {detail.risk.toLowerCase()}. Pesos
                sintéticos, sin operaciones reales.
              </p>
              <div className="holdings-list">
                {detail.holdings.map((symbol, i) => (
                  <div className="holding-row" key={symbol}>
                    <span className="color-dot" style={{ background: colors[i] }} />
                    <div>
                      <strong>{symbol}</strong>
                      <small>{assets.find((a) => a.symbol === symbol)?.name}</small>
                    </div>
                    <strong>{detail.weights[i]}%</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-note">
            <Icon name="info" size={16} />
            {simulated}. Retornos proyectados no garantizados.
          </div>
          <div className="modal-actions">
            <Button
              onClick={() =>
                exportCSV(`portafolio-${detail.key}.csv`, [
                  ["Activo", "Peso (%)"],
                  ...detail.holdings.map((a, i) => [a, detail.weights[i]]),
                ])
              }
            >
              <Icon name="download" size={16} />
              Exportar composición
            </Button>
            <Button primary onClick={() => runBacktest(detail)}>
              Evaluar en backtesting
              <Icon name="arrow" size={16} />
            </Button>
          </div>
        </Modal>
      )}
      {help && (
        <Modal title="Un laboratorio para aprender" onClose={() => setHelp(false)}>
          <div className="help-hero">
            <Icon name="book" size={28} />
            <h3>Más contexto. Mejores preguntas.</h3>
            <p>
              Ernesto Investing AI es un espacio educativo para explorar estrategias cuantitativas
              con un universo de 26 activos y datos completamente sintéticos.
            </p>
          </div>
          <div className="help-list">
            {[
              {
                icon: "grid" as IconName,
                title: "Clasificación binaria",
                text: "Cada modelo predice SUBE si la probabilidad es ≥ 50%; en caso contrario, BAJA. El consenso cuenta los votos de 18 modelos.",
              },
              {
                icon: "chart" as IconName,
                title: "Proyecciones y riesgo",
                text: "La banda p10–p90 representa escenarios simulados, no una garantía. Retorno y volatilidad están anualizados; CVaR al 95% resume la pérdida media de cola diaria.",
              },
              {
                icon: "history" as IconName,
                title: "Backtesting ilustrativo",
                text: "Capital inicial base 100. Rebalanceo trimestral y costos de 10 puntos básicos por operación, incorporados en las curvas sintéticas. No se ejecutan órdenes.",
              },
            ].map((item) => (
              <div key={item.title}>
                <Icon name={item.icon} />
                <section>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </section>
              </div>
            ))}
          </div>
          <div className="modal-note">
            <Icon name="shield" size={18} />
            No se usan cotizaciones en tiempo real, no se custodia dinero y no constituye asesoría
            financiera.
          </div>
        </Modal>
      )}
    </div>
  );
}

function Portfolios({
  onDetail,
  onOptimize,
  onBacktest,
}: {
  onDetail: (p: Profile) => void;
  onOptimize: () => void;
  onBacktest: (p: Profile) => void;
}) {
  const [view, setView] = useState("Estrategias sugeridas");
  const [horizon, setHorizon] = useState("1 año");
  const years = parseInt(horizon);
  return (
    <>
      <div className="overview-stats">
        <div className="overview-stat">
          <span className="stat-icon blue">
            <Icon name="wallet" size={19} />
          </span>
          <div>
            <span>Estrategias de inversión</span>
            <strong>
              3 <small>perfiles para ti</small>
            </strong>
          </div>
          <span className="stat-mini-bars">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className="overview-stat">
          <span className="stat-icon teal">
            <Icon name="globe" size={19} />
          </span>
          <div>
            <span>Universo de inversión</span>
            <strong>
              26 <small>activos disponibles</small>
            </strong>
          </div>
          <span className="stat-caption">EE. UU. + Perú</span>
        </div>
        <div className="overview-stat">
          <span className="stat-icon purple">
            <Icon name="sparkles" size={19} />
          </span>
          <div>
            <span>Optimización inteligente</span>
            <strong className="stat-text">Multiobjetivo</strong>
          </div>
          <Badge className="quiet-badge">NSGA-II / III</Badge>
        </div>
        <div className="overview-stat">
          <span className="stat-icon amber">
            <Icon name="history" size={19} />
          </span>
          <div>
            <span>Frecuencia de rebalanceo</span>
            <strong className="stat-text">Trimestral</strong>
          </div>
          <span className="stat-caption">Visión a largo plazo</span>
        </div>
      </div>
      <div className="section-toolbar">
        <div className="underline-tabs" aria-label="Vista de portafolios">
          {["Estrategias sugeridas", "Comparativa de métricas"].map((v) => (
            <button key={v} className={view === v ? "active" : ""} onClick={() => setView(v)}>
              {v}
              {v === "Estrategias sugeridas" && <span>3</span>}
            </button>
          ))}
        </div>
        <div className="horizon-control">
          <span>Horizonte de inversión</span>
          <Segment
            values={["1 año", "3 años", "5 años"]}
            value={horizon}
            onChange={setHorizon}
            label="Horizonte de inversión"
          />
        </div>
      </div>
      {view === "Estrategias sugeridas" ? (
        <div className="portfolio-grid">
          {profiles.map((profile, index) => (
            <article className={`portfolio-card portfolio-${index}`} key={profile.name}>
              <div className="portfolio-card-heading">
                <span
                  className="profile-icon"
                  style={{ color: profile.color, background: profile.pale }}
                >
                  <Icon name={profile.icon} size={23} />
                </span>
                <Badge className={`risk-badge risk-${index}`}>
                  <span />
                  {profile.risk}
                </Badge>
              </div>
              <div className="portfolio-title">
                <h2>{profile.name}</h2>
                <p>{profile.description}</p>
              </div>
              <Donut profile={profile} />
              <div className="portfolio-legend">
                {profile.holdings.map((symbol, i) => (
                  <div key={symbol}>
                    <span className="color-dot" style={{ background: colors[i] }} />
                    <span>{symbol}</span>
                    <strong>{profile.weights[i]}%</strong>
                  </div>
                ))}
              </div>
              <div className="portfolio-metrics">
                <div>
                  <span>
                    Volatilidad anual
                    <Icon name="activity" size={12} />
                  </span>
                  <strong>
                    {fmt(profile.volatility)}
                    <small>%</small>
                  </strong>
                </div>
                <div>
                  <span>
                    Ratio de Sharpe
                    <Icon name="info" size={12} />
                  </span>
                  <strong>{fmt(profile.sharpe)}</strong>
                </div>
                <div>
                  <span>Máx. drawdown</span>
                  <strong className="negative">
                    −{fmt(-profile.drawdown)}
                    <small>%</small>
                  </strong>
                </div>
              </div>
              {years > 1 && (
                <div className="horizon-result">
                  Escenario a {years} años{" "}
                  <strong>+{fmt((Math.pow(1 + profile.return / 100, years) - 1) * 100)}%</strong>
                  <small>acumulado simulado · sin garantía</small>
                </div>
              )}
              <button
                className={`portfolio-action ${index === 1 ? "featured-action" : ""}`}
                onClick={() => onDetail(profile)}
              >
                Explorar portafolio
                <Icon name="arrow" size={17} />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <section className="panel comparison-panel">
          <PanelHeading title="Cada estrategia, en perspectiva">
            <Badge>Horizonte: {horizon}</Badge>
          </PanelHeading>
          <div className="table-scroll">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Métrica simulada</th>
                  {profiles.map((p) => (
                    <th key={p.name}>{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Retorno anualizado", ...profiles.map((p) => `+${fmt(p.return)}%`)],
                  [
                    `Retorno acumulado · ${horizon}`,
                    ...profiles.map(
                      (p) => `+${fmt((Math.pow(1 + p.return / 100, years) - 1) * 100)}%`,
                    ),
                  ],
                  ["Volatilidad anualizada", ...profiles.map((p) => `${fmt(p.volatility)}%`)],
                  ["Ratio de Sharpe", ...profiles.map((p) => fmt(p.sharpe))],
                  ["Máximo drawdown", ...profiles.map((p) => `${fmt(p.drawdown)}%`)],
                  ["CVaR diario al 95%", ...profiles.map((p) => `${fmt(p.cvar)}%`)],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((v, i) =>
                      i === 0 ? (
                        <th scope="row" key={i}>
                          {v}
                        </th>
                      ) : (
                        <td key={i}>{v}</td>
                      ),
                    )}
                  </tr>
                ))}
                <tr>
                  <th scope="row">Explora el historial</th>
                  {profiles.map((p) => (
                    <td key={p.name}>
                      <button className="text-button" onClick={() => onBacktest(p)}>
                        Ver backtesting
                        <Icon name="arrow" size={14} />
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
      <div className="portfolio-bottom-grid">
        <section className="panel allocation-panel">
          <PanelHeading title="La diversificación hace la diferencia">
            <span className="subtle-label">Distribución por clase de activo</span>
          </PanelHeading>
          <div className="allocation-chart">
            {profiles.map((p, index) => (
              <div className="allocation-row" key={p.name}>
                <span>{p.name}</span>
                <div
                  className="stacked-bar"
                  aria-label={`${p.name}: ETF ${[90, 75, 20][index]}%, acciones ${[10, 25, 80][index]}%`}
                >
                  <div style={{ width: `${[90, 75, 20][index]}%`, background: "#326fba" }}>
                    {[90, 75, 20][index]}%
                  </div>
                  <div
                    style={{
                      width: `${[10, 25, 80][index]}%`,
                      background: "#b5a1df",
                      color: "#252139",
                    }}
                  >
                    {[10, 25, 80][index]}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span>
              <i style={{ background: "#326fba" }} />
              ETF diversificados
            </span>
            <span>
              <i style={{ background: "#b5a1df" }} />
              Acciones individuales
            </span>
          </div>
        </section>
        <section className="methodology-card">
          <div className="methodology-icon">
            <Icon name="sparkles" size={23} />
          </div>
          <div>
            <span className="eyebrow">DATOS + INTELIGENCIA</span>
            <h2>
              No es magia.
              <br />
              Es metodología.
            </h2>
            <p>
              Exploramos miles de combinaciones para encontrar un balance entre retorno, riesgo y
              diversificación.
            </p>
            <button className="text-button" onClick={onOptimize}>
              Conoce el optimizador
              <Icon name="arrow" size={16} />
            </button>
          </div>
          <svg className="method-decoration" viewBox="0 0 180 180" fill="none" aria-hidden="true">
            <circle cx="150" cy="150" r="100" />
            <circle cx="150" cy="150" r="75" />
            <circle cx="150" cy="150" r="50" />
          </svg>
        </section>
      </div>
      <div className="bottom-note">
        <Icon name="shield" size={15} />
        <p>
          El mejor portafolio no es el que más promete, sino el que mejor se adapta a tu perfil.{" "}
          <strong>Los resultados pasados simulados no garantizan resultados futuros.</strong>
        </p>
      </div>
    </>
  );
}

function Classification() {
  const [group, setGroup] = useState("Todos los activos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(0);
  const up = models.filter((_, i) => probability(selected, i) >= 50).length;
  const average = Math.round(models.reduce((sum, _, i) => sum + probability(selected, i), 0) / 18);
  const consensusUp = up > 9 || (up === 9 && average >= 50);
  const filtered = assets
    .map((a, i) => ({ ...a, original: i }))
    .filter(
      (a) =>
        (group === "Todos los activos" || a.group === group) &&
        `${a.symbol} ${a.name}`.toLowerCase().includes(search.toLowerCase()),
    );
  const positive = assets.filter(
    (_, a) => models.filter((_, m) => probability(a, m) >= 50).length >= 9,
  ).length;
  return (
    <>
      <div className="module-stats">
        <Metric label="Universo analizado" value="26" detail="activos sintéticos" icon="globe" />
        <Metric label="Modelos en consenso" value="18" detail="11 ML · 7 DL" icon="sparkles" />
        <Metric
          label="Consenso SUBE"
          value={`${positive}`}
          detail="activos · mayoría simple"
          icon="chart"
          positive
        />
        <Metric
          label="Horizonte de clasificación"
          value="1 sesión"
          detail="siguiente cierre sintético"
          icon="clock"
        />
      </div>
      <div className="classification-layout">
        <section className="panel heatmap-panel">
          <PanelHeading title="El mercado, modelo por modelo">
            <Badge>Probabilidad de SUBE</Badge>
          </PanelHeading>
          <div className="filter-toolbar">
            <label className="search-field">
              <Icon name="search" size={16} />
              <input
                placeholder="Buscar activo..."
                aria-label="Buscar activo"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <label className="select-label">
              <Icon name="filter" size={15} />
              <select
                aria-label="Filtrar activos por grupo"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              >
                {[
                  "Todos los activos",
                  "7 Magníficas",
                  "Minería Perú",
                  "ETF sectoriales",
                  "Índices",
                ].map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="heatmap-scroll">
            <table className="heatmap">
              <thead>
                <tr>
                  <th className="sticky-asset">Activo</th>
                  {models.map((model, i) => (
                    <th key={model}>
                      <span className="model-type">{i < 11 ? "ML" : "DL"}</span>
                      {model}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.symbol} className={selected === a.original ? "selected-asset" : ""}>
                    <th className="sticky-asset">
                      <button
                        onClick={() => setSelected(a.original)}
                        aria-pressed={selected === a.original}
                      >
                        <strong>{a.symbol}</strong>
                        <small>{a.group}</small>
                      </button>
                    </th>
                    {models.map((m, i) => {
                      const p = probability(a.original, i);
                      return (
                        <td key={m}>
                          <button
                            onClick={() => setSelected(a.original)}
                            className={`heat-cell ${p >= 50 ? "heat-up" : "heat-down"} ${p >= 75 ? "heat-strong" : ""}`}
                            aria-label={`${a.symbol}, ${m}: ${p >= 50 ? "SUBE" : "BAJA"}, probabilidad de SUBE ${p}%`}
                          >
                            <strong>{p >= 50 ? "↗ SUBE" : "↘ BAJA"}</strong>
                            <span>{p}%</span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="empty-state">
                <Icon name="search" size={28} />
                <h3>No encontramos ese activo</h3>
                <p>Prueba otro símbolo o cambia el filtro de grupo.</p>
                <Button
                  onClick={() => {
                    setSearch("");
                    setGroup("Todos los activos");
                  }}
                >
                  Restablecer filtros
                </Button>
              </div>
            )}
          </div>
          <div className="heatmap-key">
            <span>
              <i className="green-key" />↗ SUBE: p ≥ 50%
            </span>
            <span>
              <i className="red-key" />↘ BAJA: p &lt; 50%
            </span>
            <span>
              Selecciona un activo para ver su consenso
              <Icon name="arrow" size={13} />
            </span>
          </div>
        </section>
        <aside className="panel consensus-panel">
          <PanelHeading eyebrow="LA VISIÓN CONJUNTA" title="Consenso del activo" />
          <div className="asset-identity">
            <div className="asset-monogram">{assets[selected].symbol.slice(0, 2)}</div>
            <div>
              <h3>{assets[selected].symbol}</h3>
              <p>{assets[selected].name}</p>
            </div>
            <Sparkline index={selected} />
          </div>
          <div className={`consensus-signal ${consensusUp ? "positive" : "negative"}`}>
            <span>{consensusUp ? "↗" : "↘"}</span>
            <strong>{consensusUp ? "SUBE" : "BAJA"}</strong>
            <small>Consenso mayoritario{up === 9 ? " · desempate por p media" : ""}</small>
          </div>
          <div className="consensus-meter">
            <span style={{ width: `${(up / 18) * 100}%` }} />
          </div>
          <div className="consensus-votes">
            <span>↗ {up} SUBE</span>
            <span>↘ {18 - up} BAJA</span>
          </div>
          <div className="consensus-facts">
            <div>
              <span>Acuerdo entre modelos</span>
              <strong>{Math.round((Math.max(up, 18 - up) / 18) * 100)}%</strong>
            </div>
            <div>
              <span>Probabilidad media de SUBE</span>
              <strong>{average}%</strong>
            </div>
            <div>
              <span>Modelos evaluados</span>
              <strong>18 / 18</strong>
            </div>
          </div>
          <div className="insight-box">
            <Icon name="info" size={17} />
            <p>
              El consenso es una votación, no una certeza. Una mayor coincidencia no elimina el
              riesgo.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

function Metric({
  label,
  value,
  detail,
  icon,
  positive = false,
}: {
  label: string;
  value: string;
  detail: string;
  icon: IconName;
  positive?: boolean;
}) {
  return (
    <div className="metric-card">
      <div>
        <span>{label}</span>
        <Icon name={icon} size={17} />
      </div>
      <strong className={positive ? "positive" : ""}>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function Regression() {
  const [asset, setAsset] = useState("SPY");
  const [family, setFamily] = useState("Todos");
  const index = assets.findIndex((a) => a.symbol === asset);
  const projected = (6.4 + index * 0.14) * (family === "ML" ? 0.8 : family === "DL" ? 1.25 : 1);
  return (
    <>
      <div className="module-stats">
        <Metric
          label="Retorno proyectado · 30 sesiones"
          value={`+${fmt(projected)}%`}
          detail="mediana de escenarios simulados"
          icon="chart"
          positive
        />
        <Metric
          label="Escenario p10"
          value={`${fmt(projected - 8.1)}%`}
          detail="límite inferior de la banda"
          icon="shield"
        />
        <Metric
          label="Escenario p90"
          value={`+${fmt(projected + 9.2)}%`}
          detail="límite superior de la banda"
          icon="target"
        />
        <Metric
          label="Modelos incluidos"
          value={family === "ML" ? "11 modelos" : family === "DL" ? "7 modelos" : "18 modelos"}
          detail={
            family === "Todos"
              ? "Machine Learning + Deep Learning"
              : family === "ML"
                ? "Machine Learning"
                : "Deep Learning"
          }
          icon="layers"
        />
      </div>
      <section className="panel regression-panel">
        <PanelHeading
          eyebrow="HISTORIA Y POSIBILIDADES"
          title="Una mirada a las próximas 30 sesiones"
        >
          <div className="chart-controls">
            <label className="select-label">
              <span>Activo</span>
              <select
                aria-label="Activo de regresión"
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
              >
                {assets.map((a) => (
                  <option key={a.symbol} value={a.symbol}>
                    {a.symbol} · {a.name}
                  </option>
                ))}
              </select>
            </label>
            <Segment
              values={["Todos", "ML", "DL"]}
              value={family}
              onChange={setFamily}
              label="Familia de modelos"
            />
          </div>
        </PanelHeading>
        <div className="chart-asset-heading">
          <div className="asset-monogram">{asset.slice(0, 2)}</div>
          <div>
            <h3>
              {asset}
              <span>{assets[index].name}</span>
            </h3>
            <p>Índice sintético · base 100 · no representa un precio real</p>
          </div>
          <Badge className="positive-badge">↗ +{fmt(projected)}% proyectado</Badge>
        </div>
        <RegressionChart assetIndex={index} family={family} />
        <div className="chart-legend regression-legend">
          <span>
            <i style={{ background: "#1558b0" }} />
            Historia sintética · 90 sesiones
          </span>
          <span>
            <i className="dashed-key" />
            Mediana proyectada
          </span>
          <span>
            <i className="band-key" />
            Banda p10–p90
          </span>
          <span className="legend-right">Corte histórico: 24 oct 2025</span>
        </div>
      </section>
      <div className="three-info-grid">
        <InfoCard number="01" title="No es una predicción exacta">
          La línea central es la mediana de escenarios, no el precio al que el activo va a cotizar.
        </InfoCard>
        <InfoCard number="02" title="La incertidumbre es parte del gráfico">
          La banda reúne el 80% central de los escenarios sintéticos. Su amplitud aumenta con el
          horizonte.
        </InfoCard>
        <InfoCard number="03" title="Compara distintas perspectivas">
          Alterna entre modelos ML, DL o el conjunto completo para ver cómo cambia la proyección.
        </InfoCard>
      </div>
    </>
  );
}
function InfoCard({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="info-card">
      <span>{number}</span>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </section>
  );
}

function Optimizer({ onBacktest }: { onBacktest: (p: Profile) => void }) {
  const [selected, setSelected] = useState(12);
  const [algorithm, setAlgorithm] = useState("Todos");
  const point = frontierPoints[selected];
  const profileIndex = point.x < 12 ? 0 : point.x < 18 ? 1 : 2;
  const base = profiles[profileIndex];
  const composition: Profile = {
    ...base,
    return: point.y,
    volatility: point.x,
    cvar: -point.cvar,
    name: `Optimizado #${selected + 1}`,
    weights: [30 + (selected % 5), 25, 15, 15, 10, 5 - (selected % 5)].filter((_, i) => i < 6),
  };
  return (
    <>
      <div className="module-stats">
        <Metric
          label="Combinaciones exploradas"
          value="10.000"
          detail="escenarios de optimización sintéticos"
          icon="layers"
        />
        <Metric
          label="Soluciones eficientes"
          value="42"
          detail="21 NSGA-II · 21 NSGA-III"
          icon="target"
        />
        <Metric
          label="Objetivos simultáneos"
          value="3"
          detail="retorno · volatilidad · CVaR"
          icon="sliders"
        />
        <Metric
          label="Universo de activos"
          value="26"
          detail="sin posiciones cortas · pesos 100%"
          icon="globe"
        />
      </div>
      <div className="optimizer-layout">
        <section className="panel">
          <PanelHeading eyebrow="EL MAPA DE TUS POSIBILIDADES" title="Fronteras de inversión">
            <Segment
              values={["Todos", "Markowitz", "NSGA-II", "NSGA-III"]}
              value={algorithm}
              onChange={setAlgorithm}
              label="Algoritmo de optimización"
            />
          </PanelHeading>
          <div className="chart-subtitle">
            <span>Selecciona una solución para explorar su composición.</span>
            <span className="cvar-key">
              CVaR 95% <i /> Menor → mayor pérdida
            </span>
          </div>
          <OptimizerChart selected={selected} onSelect={setSelected} algorithm={algorithm} />
          <div className="chart-legend optimizer-legend">
            <span>
              <i className="dashed-key gray-key" />
              Curva de Markowitz
            </span>
            <span>
              <b className="shape-circle" />
              NSGA-II
            </span>
            <span>
              <b className="shape-diamond" />
              NSGA-III
            </span>
          </div>
          <div className="chart-bottom-note">
            <Icon name="info" size={14} />
            El color indica CVaR. El símbolo identifica el algoritmo; el valor numérico aparece al
            seleccionar.
          </div>
        </section>
        <aside className="panel optimizer-detail">
          <PanelHeading eyebrow="SOLUCIÓN SELECCIONADA" title={`Portafolio #${selected + 1}`}>
            <Badge>{point.algorithm}</Badge>
          </PanelHeading>
          <div className="selected-point-metrics">
            <div>
              <span>Retorno anual</span>
              <strong className="positive">+{fmt(point.y)}%</strong>
            </div>
            <div>
              <span>Volatilidad</span>
              <strong>{fmt(point.x)}%</strong>
            </div>
            <div>
              <span>CVaR diario 95%</span>
              <strong className="negative">−{fmt(point.cvar)}%</strong>
            </div>
          </div>
          <Donut profile={composition} />
          <div className="compact-holdings">
            {composition.holdings.map((a, i) => (
              <div key={a}>
                <span>
                  <i style={{ background: colors[i] }} />
                  {a}
                </span>
                <strong>{composition.weights[i]}%</strong>
              </div>
            ))}
          </div>
          <Button primary className="full-width" onClick={() => onBacktest(composition)}>
            Probar en backtesting
            <Icon name="arrow" size={16} />
          </Button>
        </aside>
      </div>
      <div className="three-info-grid">
        <InfoCard number="01" title="Markowitz">
          Equilibra retorno esperado y varianza para dibujar una referencia clásica de eficiencia.
        </InfoCard>
        <InfoCard number="02" title="NSGA-II">
          Explora soluciones no dominadas y mantiene diversidad entre combinaciones de inversión.
        </InfoCard>
        <InfoCard number="03" title="NSGA-III">
          Utiliza puntos de referencia para explorar tres objetivos: retorno, volatilidad y CVaR.
        </InfoCard>
      </div>
    </>
  );
}

function Backtesting({ initialProfile }: { initialProfile: Profile | null }) {
  const backtestProfiles =
    initialProfile && !profiles.some((p) => p.name === initialProfile.name)
      ? [profiles[0], initialProfile, profiles[2]]
      : profiles;
  const [period, setPeriod] = useState("3 años");
  const [visible, setVisible] = useState(() =>
    backtestProfiles.map((p) => !initialProfile || p.name === initialProfile.name).concat(true),
  );
  const [event, setEvent] = useState<number | null>(null);
  const years = parseInt(period);
  return (
    <>
      <div className="module-stats">
        <Metric
          label="Capital inicial"
          value="100"
          detail="índice sintético · misma base"
          icon="wallet"
        />
        <Metric
          label="Ventana de evaluación"
          value={period}
          detail={`24 oct ${2025 - years} — 24 oct 2025`}
          icon="clock"
        />
        <Metric
          label="Rebalanceos simulados"
          value={`${years * 4}`}
          detail="frecuencia trimestral"
          icon="history"
        />
        <Metric
          label="Costos de transacción"
          value="0,10%"
          detail="por operación · incorporados"
          icon="sliders"
        />
      </div>
      <section className="panel backtest-chart-panel">
        <PanelHeading eyebrow="EL RENDIMIENTO, EN CONTEXTO" title="Evolución del capital">
          <Segment
            values={["1 año", "3 años", "5 años"]}
            value={period}
            onChange={setPeriod}
            label="Periodo de backtesting"
          />
        </PanelHeading>
        <div className="backtest-legend">
          {[...backtestProfiles.map((p) => p.name), "SPY · benchmark"].map((name, i) => (
            <button
              aria-pressed={visible[i]}
              key={name}
              className={!visible[i] ? "legend-off" : ""}
              onClick={() => setVisible((prev) => prev.map((v, n) => (n === i ? !v : v)))}
            >
              <i style={{ background: ["#2467bf", "#8b70cd", "#d4974b", "#8b99ad"][i] }}>
                {visible[i] && <Icon name="check" size={10} />}
              </i>
              {name}
            </button>
          ))}
          <span>Base 100 · retorno total simulado</span>
        </div>
        <CapitalChart
          years={years}
          visible={visible}
          rates={backtestProfiles.map((p) => p.return)}
        />
        <div className="drawdown-heading">
          <h3>Drawdown</h3>
          <span>Caída desde el máximo previo</span>
        </div>
        <CapitalChart
          years={years}
          visible={visible}
          rates={backtestProfiles.map((p) => p.return)}
          drawdown
        />
      </section>
      <section className="panel backtest-metrics">
        <PanelHeading title="Los números detrás de cada curva">
          <Badge>Resultados netos simulados</Badge>
        </PanelHeading>
        <div className="table-scroll">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Estrategia</th>
                <th>Retorno acumulado</th>
                <th>Retorno anual</th>
                <th>Volatilidad</th>
                <th>Sharpe</th>
                <th>Máx. drawdown</th>
                <th>CVaR 95%</th>
              </tr>
            </thead>
            <tbody>
              {backtestProfiles
                .filter((_, i) => visible[i])
                .map((p) => (
                  <tr key={p.name}>
                    <th scope="row">
                      <span className="table-profile">
                        <i
                          style={{
                            background: ["#2467bf", "#8b70cd", "#d4974b"][
                              backtestProfiles.indexOf(p)
                            ],
                          }}
                        />
                        {p.name}
                      </span>
                    </th>
                    <td className="positive">
                      +{fmt((Math.pow(1 + p.return / 100, years) - 1) * 100)}%
                    </td>
                    <td>+{fmt(p.return)}%</td>
                    <td>{fmt(p.volatility)}%</td>
                    <td>{fmt(p.sharpe)}</td>
                    <td className="negative">{fmt(p.drawdown)}%</td>
                    <td>{fmt(p.cvar)}%</td>
                  </tr>
                ))}
              {visible[3] && (
                <tr>
                  <th scope="row">
                    <span className="table-profile">
                      <i style={{ background: "#8b99ad" }} />
                      SPY · benchmark
                    </span>
                  </th>
                  <td className="positive">+{fmt((Math.pow(1.113, years) - 1) * 100)}%</td>
                  <td>+11,30%</td>
                  <td>15,42%</td>
                  <td>0,73</td>
                  <td className="negative">−18,62%</td>
                  <td>−4,28%</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-note">
          Métricas ilustrativas de referencia. CVaR diario al 95%. La ventana modifica el retorno
          acumulado; las estadísticas de riesgo son referencias fijas de cada perfil.
        </div>
      </section>
      <section className="panel rebalance-panel">
        <PanelHeading title="Un plan que se mantiene en movimiento">
          <span className="subtle-label">Línea de tiempo de rebalanceos · últimos 12 meses</span>
        </PanelHeading>
        <div className="timeline">
          {["Ene 2025", "Abr 2025", "Jul 2025", "Oct 2025"].map((date, i) => (
            <button
              key={date}
              className={event === i ? "selected-event" : ""}
              onClick={() => setEvent(event === i ? null : i)}
              aria-expanded={event === i}
            >
              <span className="timeline-dot">
                <Icon name="history" size={15} />
              </span>
              <strong>{date}</strong>
              <small>Rebalanceo trimestral</small>
              <span className="timeline-link">
                {event === i ? "Ocultar detalle" : "Ver ajuste"}
                <Icon name="chevron" size={11} />
              </span>
            </button>
          ))}
        </div>
        {event !== null && (
          <div className="rebalance-detail">
            <Icon name="check" size={18} />
            <p>
              <strong>
                Rebalanceo de {["enero", "abril", "julio", "octubre"][event]} de 2025.
              </strong>{" "}
              Se restablecieron los pesos objetivo de los activos de cada perfil. Rotación simulada:{" "}
              {["8,4", "12,1", "6,8", "9,2"][event]}%. Costo: 0,10% del importe negociado, incluido
              en el escenario.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
