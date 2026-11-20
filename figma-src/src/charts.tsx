import { useId, useState } from "react";
import { colors, fmt, type Profile } from "./data";

export function Donut({ profile, large = false }: { profile: Profile; large?: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);
  let offset = 0;
  return (
    <div className={`donut ${large ? "donut-large" : ""}`}>
      <svg
        viewBox="0 0 210 210"
        role="img"
        aria-label={`Composición de ${profile.name}: ${profile.holdings.map((h, i) => `${h} ${profile.weights[i]}%`).join(", ")}`}
      >
        {profile.weights.map((weight, i) => {
          const start = offset;
          offset += weight;
          return (
            <circle
              key={i}
              cx="105"
              cy="105"
              r="78"
              fill="none"
              stroke={colors[i]}
              strokeWidth={hovered === i ? 25 : 21}
              strokeDasharray={`${weight * 4.9 - 3} ${490 - weight * 4.9 + 3}`}
              strokeDashoffset={-start * 4.9}
              transform="rotate(-90 105 105)"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="donut-segment"
            >
              <title>
                {profile.holdings[i]}: {weight}%
              </title>
            </circle>
          );
        })}
      </svg>
      <div className="donut-label">
        <span>{hovered === null ? "Retorno anual" : profile.holdings[hovered]}</span>
        <strong>
          {hovered === null ? `+${fmt(profile.return)}%` : `${profile.weights[hovered]}%`}
        </strong>
        <small>{hovered === null ? "proyectado" : "del portafolio"}</small>
      </div>
    </div>
  );
}

export function Sparkline({ index = 0, color = "#0a7d3c" }: { index?: number; color?: string }) {
  const points = Array.from(
    { length: 35 },
    (_, i) => `${i * 3},${31 - i * 0.65 + Math.sin(i * 1.7 + index) * 4 + Math.cos(i * 0.6) * 3}`,
  ).join(" ");
  return (
    <svg viewBox="0 0 102 38" width="94" height="35" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function gridLines(yLabels: string[], width: number, height: number) {
  return yLabels.map((label, i) => {
    const y = 28 + (i * (height - 78)) / (yLabels.length - 1);
    return (
      <g key={label}>
        <line x1="58" x2={width - 20} y1={y} y2={y} className="chart-grid" />
        <text x="43" y={y + 4} textAnchor="end" className="chart-label">
          {label}
        </text>
      </g>
    );
  });
}
function pathFor(
  values: number[],
  xStart: number,
  xEnd: number,
  min: number,
  max: number,
  h = 330,
) {
  return values
    .map(
      (value, i) =>
        `${i === 0 ? "M" : "L"}${xStart + (i / (values.length - 1)) * (xEnd - xStart)},${28 + ((max - value) / (max - min)) * (h - 78)}`,
    )
    .join(" ");
}

export function RegressionChart({ assetIndex, family }: { assetIndex: number; family: string }) {
  const id = useId().replace(/:/g, "");
  const familyFactor = family === "ML" ? 0.8 : family === "DL" ? 1.25 : 1;
  const historical = Array.from(
    { length: 91 },
    (_, i) => 94 + i * 0.18 + Math.sin(i * 0.42 + assetIndex) * 2 + Math.cos(i * 1.6) * 0.8,
  );
  const last = historical.at(-1)!;
  const projectedReturn = (6.4 + assetIndex * 0.14) * familyFactor;
  const projected = Array.from(
    { length: 31 },
    (_, i) => last * (1 + ((i / 30) * projectedReturn) / 100),
  );
  const upper = projected.map((v, i) => v + ((last * i) / 30) * 0.092);
  const lower = projected.map((v, i) => v - ((last * i) / 30) * 0.081);
  const y = (v: number) => 28 + ((135 - v) / 50) * 252;
  const band = `${pathFor(upper, 660, 940, 85, 135)} ${lower.map((v, i) => `L${940 - (i / 30) * 280},${y(lower[30 - i])}`).join(" ")} Z`;
  return (
    <svg
      className="wide-chart"
      viewBox="0 0 960 330"
      role="img"
      aria-label="Índice sintético base 100: 90 sesiones históricas y 30 sesiones proyectadas con mediana y banda de incertidumbre p10 a p90"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4e8fdc" stopOpacity=".2" />
          <stop offset="100%" stopColor="#4e8fdc" stopOpacity=".04" />
        </linearGradient>
      </defs>
      {gridLines(["135", "122,5", "110", "97,5", "85"], 960, 330)}
      <rect x="660" y="28" width="280" height="252" fill={`url(#${id})`} />
      <path d={band} fill="#4e8fdc" opacity=".18" />
      <line x1="660" x2="660" y1="28" y2="280" stroke="#8b9bb0" strokeDasharray="4 4" />
      <path
        d={pathFor(historical, 58, 660, 85, 135)}
        fill="none"
        stroke="#1558b0"
        strokeWidth="2.7"
      />
      <path
        d={pathFor(projected, 660, 940, 85, 135)}
        fill="none"
        stroke="#5488d2"
        strokeWidth="2.7"
        strokeDasharray="6 4"
      />
      <circle
        cx="660"
        cy={y(last)}
        r="4.5"
        fill="#1558b0"
        stroke="var(--surface)"
        strokeWidth="2"
      />
      <text x="677" y="48" className="chart-label blue-label">
        30 sesiones proyectadas
      </text>
      {["Jun 2025", "Jul 2025", "Ago 2025", "Sep 2025", "24 oct", "Nov 2025", "Dic 2025"].map(
        (v, i) => (
          <text
            key={v}
            x={58 + i * 147}
            y="310"
            textAnchor={i === 0 ? "start" : "middle"}
            className="chart-label"
          >
            {v}
          </text>
        ),
      )}
    </svg>
  );
}

export type FrontierPoint = {
  x: number;
  y: number;
  algorithm: string;
  index: number;
  cvar: number;
};
export const frontierPoints: FrontierPoint[] = Array.from({ length: 42 }, (_, i) => {
  const algorithm = i < 21 ? "NSGA-II" : "NSGA-III";
  const n = i % 21;
  return {
    x: 7 + n * 0.78 + (i < 21 ? 0 : 0.26),
    y: 6.2 + Math.sqrt(n / 20) * 16 + (i < 21 ? Math.sin(n * 1.5) * 0.55 : 0.55),
    algorithm,
    index: i,
    cvar: 1.5 + n * 0.2,
  };
});
export function OptimizerChart({
  selected,
  onSelect,
  algorithm,
}: {
  selected: number;
  onSelect: (index: number) => void;
  algorithm: string;
}) {
  const x = (v: number) => 60 + ((v - 4) / 24) * 790;
  const y = (v: number) => 320 - (v / 28) * 280;
  const markowitz = Array.from(
    { length: 41 },
    (_, i) => `${i ? "L" : "M"}${x(6.5 + i * 0.43)},${y(5 + Math.sqrt(i / 40) * 15.8)}`,
  ).join(" ");
  return (
    <svg
      viewBox="0 0 890 390"
      className="wide-chart frontier-chart"
      role="group"
      aria-label="Fronteras eficientes. Cada punto se puede seleccionar con el teclado para consultar su composición."
    >
      {[0, 5, 10, 15, 20, 25].map((v) => (
        <g key={v}>
          <line x1="60" x2="850" y1={y(v)} y2={y(v)} className="chart-grid" />
          <text x="44" y={y(v) + 4} textAnchor="end" className="chart-label">
            {v}%
          </text>
        </g>
      ))}
      {[5, 10, 15, 20, 25].map((v) => (
        <text x={x(v)} y="345" key={v} className="chart-label" textAnchor="middle">
          {v}%
        </text>
      ))}
      <text x="455" y="378" textAnchor="middle" className="chart-label">
        Riesgo · volatilidad anualizada
      </text>
      <text
        x="16"
        y="190"
        transform="rotate(-90 16 190)"
        textAnchor="middle"
        className="chart-label"
      >
        Retorno anualizado
      </text>
      {(algorithm === "Todos" || algorithm === "Markowitz") && (
        <path d={markowitz} fill="none" stroke="#8798ae" strokeDasharray="6 4" strokeWidth="2.2" />
      )}
      {frontierPoints
        .filter((p) => algorithm === "Todos" || p.algorithm === algorithm)
        .map((p) => (
          <g
            key={p.index}
            role="button"
            tabIndex={0}
            aria-label={`${p.algorithm}, retorno ${fmt(p.y)}%, riesgo ${fmt(p.x)}%, CVaR ${fmt(p.cvar)}%. Seleccionar composición`}
            onClick={() => onSelect(p.index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(p.index);
              }
            }}
            className="frontier-point"
          >
            {selected === p.index && (
              <circle cx={x(p.x)} cy={y(p.y)} r="12" fill="var(--blue-soft)" stroke="#1558b0" />
            )}
            {p.algorithm === "NSGA-II" ? (
              <circle
                cx={x(p.x)}
                cy={y(p.y)}
                r={selected === p.index ? 5.5 : 4.8}
                fill={p.cvar < 3 ? "#238a90" : p.cvar < 4.3 ? "#427bc2" : "#8b6bc0"}
                stroke="var(--surface)"
                strokeWidth="1.2"
              />
            ) : (
              <rect
                x={x(p.x) - 4.7}
                y={y(p.y) - 4.7}
                width="9.4"
                height="9.4"
                rx="1.2"
                fill={p.cvar < 3 ? "#238a90" : p.cvar < 4.3 ? "#427bc2" : "#8b6bc0"}
                stroke="var(--surface)"
                strokeWidth="1.2"
                transform={`rotate(45 ${x(p.x)} ${y(p.y)})`}
              />
            )}
          </g>
        ))}
      <text x="488" y="73" className="chart-label blue-label">
        Mayor eficiencia, más posibilidades.
      </text>
    </svg>
  );
}

export function CapitalChart({
  years,
  visible,
  drawdown = false,
  rates = [8.42, 14.76, 22.35],
}: {
  years: number;
  visible: boolean[];
  drawdown?: boolean;
  rates?: number[];
}) {
  const count = years * 52;
  const series = profilesForChart(years, count, rates);
  const max = Math.ceil((Math.pow(1 + Math.max(...rates, 11.3) / 100, years) * 100) / 20) * 20;
  const chartColors = ["#2467bf", "#8b70cd", "#d4974b", "#8b99ad"];
  return (
    <svg
      viewBox={`0 0 1100 ${drawdown ? 170 : 320}`}
      className="wide-chart"
      role="img"
      aria-label={
        drawdown
          ? "Drawdown simulado de cada estrategia"
          : `Evolución simulada del capital base 100 durante ${years} años`
      }
    >
      {gridLines(
        drawdown
          ? ["0%", "−15%", "−30%"]
          : Array.from({ length: 5 }, (_, i) => String(Math.round(max - (i * (max - 90)) / 4))),
        1100,
        drawdown ? 170 : 320,
      )}
      {series.map(
        (values, i) =>
          visible[i] && (
            <path
              key={i}
              d={pathFor(
                drawdown
                  ? values.map((v, n) => (v / Math.max(...values.slice(0, n + 1)) - 1) * 100)
                  : values,
                58,
                1080,
                drawdown ? -30 : 90,
                drawdown ? 0 : max,
                drawdown ? 170 : 320,
              )}
              fill="none"
              stroke={chartColors[i]}
              strokeWidth={i === 3 ? "1.8" : "2.5"}
              strokeDasharray={i === 3 ? "5 4" : undefined}
            />
          ),
      )}
      {Array.from({ length: 7 }, (_, i) => (
        <text
          key={i}
          x={58 + i * 170}
          y={drawdown ? 158 : 304}
          className="chart-label"
          textAnchor={i === 0 ? "start" : "middle"}
        >
          {i === 6
            ? "Oct 2025"
            : `${["Oct", "Abr"][i % 2]} ${2025 - years + Math.floor((i * years) / 6)}`}
        </text>
      ))}
    </svg>
  );
}
function profilesForChart(years: number, count: number, rates: number[]) {
  return [...rates, 11.3].map((ret, j) =>
    Array.from({ length: count + 1 }, (_, i) => {
      const t = i / count;
      return (
        100 * Math.pow(1 + ret / 100, years * t) -
        Math.sin(Math.PI * t) * Math.abs(Math.sin(i * 0.17) * (j + 1) * 2.6) -
        Math.sin(Math.PI * t) * Math.exp(-Math.pow((t - 0.56) * 22, 2)) * (j + 1) * 5 +
        Math.sin(Math.PI * t) * Math.sin(i * 1.2) * (j + 1) * 0.35
      );
    }),
  );
}
