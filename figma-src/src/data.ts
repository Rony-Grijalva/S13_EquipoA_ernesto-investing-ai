export type Page =
  | "Clasificación"
  | "Regresión 30 días"
  | "Optimizador"
  | "Portafolios"
  | "Backtesting";
export type Asset = { symbol: string; name: string; group: string };
export const assets: Asset[] = [
  { symbol: "AAPL", name: "Apple", group: "7 Magníficas" },
  { symbol: "MSFT", name: "Microsoft", group: "7 Magníficas" },
  { symbol: "AMZN", name: "Amazon", group: "7 Magníficas" },
  { symbol: "GOOGL", name: "Alphabet", group: "7 Magníficas" },
  { symbol: "META", name: "Meta Platforms", group: "7 Magníficas" },
  { symbol: "NVDA", name: "NVIDIA", group: "7 Magníficas" },
  { symbol: "TSLA", name: "Tesla", group: "7 Magníficas" },
  { symbol: "SCCO", name: "Southern Copper", group: "Minería Perú" },
  { symbol: "BVN", name: "Buenaventura", group: "Minería Perú" },
  { symbol: "FCX", name: "Freeport-McMoRan", group: "Minería Perú" },
  { symbol: "NEM", name: "Newmont", group: "Minería Perú" },
  { symbol: "BHP", name: "BHP Group", group: "Minería Perú" },
  ...[
    ["XLC", "Comunicación"],
    ["XLY", "Consumo discrecional"],
    ["XLP", "Consumo básico"],
    ["XLE", "Energía"],
    ["XLF", "Finanzas"],
    ["XLV", "Salud"],
    ["XLI", "Industriales"],
    ["XLB", "Materiales"],
    ["XLRE", "Inmobiliario"],
    ["XLK", "Tecnología"],
    ["XLU", "Servicios públicos"],
  ].map(([symbol, name]) => ({ symbol, name, group: "ETF sectoriales" })),
  { symbol: "SPY", name: "S&P 500 ETF", group: "Índices" },
  { symbol: "QQQ", name: "Nasdaq-100 ETF", group: "Índices" },
  { symbol: "EPU", name: "MSCI Peru ETF", group: "Índices" },
];
export const models = [
  "LogReg",
  "SVM",
  "KNN",
  "D. Tree",
  "R. Forest",
  "Extra T.",
  "AdaBoost",
  "G. Boost",
  "XGBoost",
  "LightGBM",
  "CatBoost",
  "MLP",
  "LSTM",
  "GRU",
  "BiLSTM",
  "CNN",
  "CNN-LSTM",
  "Transform.",
];
export function probability(asset: number, model: number) {
  return Math.max(
    15,
    Math.min(
      96,
      Math.round(58 + Math.sin(asset * 1.6 + model * 0.71) * 23 + Math.cos(asset * 0.7) * 13),
    ),
  );
}
export const colors = ["#1558b0", "#60a5ed", "#70c2c1", "#8c78d6", "#e8ad60", "#b8c5d9"];
export type Profile = {
  name: string;
  key: string;
  description: string;
  icon: "shield" | "layers" | "zap";
  color: string;
  pale: string;
  risk: string;
  return: number;
  volatility: number;
  sharpe: number;
  drawdown: number;
  cvar: number;
  weights: number[];
  holdings: string[];
  tagline: string;
};
export const profiles: Profile[] = [
  {
    name: "Conservador",
    key: "conservador",
    description: "Estabilidad para avanzar con confianza.",
    icon: "shield",
    color: "#175ba9",
    pale: "#eaf2fd",
    risk: "Riesgo bajo",
    return: 8.42,
    volatility: 7.15,
    sharpe: 1.18,
    drawdown: -6.84,
    cvar: -2.13,
    weights: [35, 20, 15, 15, 10, 5],
    holdings: ["SPY", "XLV", "XLP", "XLU", "MSFT", "EPU"],
    tagline: "Prioriza preservar tu capital.",
  },
  {
    name: "Moderado",
    key: "moderado",
    description: "El equilibrio entre crecer y proteger.",
    icon: "layers",
    color: "#7156b8",
    pale: "#f1edfa",
    risk: "Riesgo medio",
    return: 14.76,
    volatility: 12.38,
    sharpe: 1.19,
    drawdown: -12.56,
    cvar: -3.45,
    weights: [30, 25, 15, 15, 10, 5],
    holdings: ["SPY", "QQQ", "XLK", "MSFT", "SCCO", "EPU"],
    tagline: "Diversificación con visión de futuro.",
  },
  {
    name: "Agresivo",
    key: "agresivo",
    description: "Más potencial. Una visión de largo plazo.",
    icon: "zap",
    color: "#af6a21",
    pale: "#fcf3e5",
    risk: "Riesgo alto",
    return: 22.35,
    volatility: 21.64,
    sharpe: 1.03,
    drawdown: -23.18,
    cvar: -5.82,
    weights: [25, 20, 20, 15, 10, 10],
    holdings: ["NVDA", "QQQ", "AMZN", "META", "TSLA", "SCCO"],
    tagline: "Busca oportunidades de crecimiento.",
  },
];
export function fmt(value: number, digits = 2) {
  return value.toLocaleString("es-PE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
export function exportCSV(filename: string, rows: (string | number)[][]) {
  const blob = new Blob(
    [
      "\uFEFF" +
        rows
          .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
          .join("\n"),
    ],
    { type: "text/csv;charset=utf-8;" },
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
export const simulated = "Datos sintéticos · resultados simulados";
