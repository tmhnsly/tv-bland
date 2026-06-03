import { WorthIt } from "@/utils/worthIt";

const W = 760;
const H = 220;
const PAD = { l: 26, r: 14, t: 16, b: 24 };

interface SeasonTrendChartProps {
  worthIt: WorthIt;
}

const SeasonTrendChart: React.FC<SeasonTrendChartProps> = ({ worthIt }) => {
  const seasons = worthIt.seasons;
  if (seasons.length < 2) return null;

  const avgs = seasons.map((s) => s.average);
  const minA = Math.max(0, Math.floor(Math.min(...avgs) - 0.5));
  const maxA = Math.min(10, Math.ceil(Math.max(...avgs) + 0.5));
  const span = Math.max(1, maxA - minA);
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const n = seasons.length;

  const x = (i: number) => PAD.l + (i / (n - 1)) * innerW;
  const y = (v: number) => PAD.t + (1 - (v - minA) / span) * innerH;

  const pts = seasons.map((s, i) => [x(i), y(s.average)] as const);
  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(" ");
  const baseline = (PAD.t + innerH).toFixed(1);
  const area = `${line} L ${x(n - 1).toFixed(1)} ${baseline} L ${x(0).toFixed(1)} ${baseline} Z`;

  const ticks: number[] = [];
  for (let v = Math.ceil(minA); v <= maxA; v++) ticks.push(v);

  const peakIdx = seasons.findIndex((s) => s.season === worthIt.peakSeason?.season);
  const lastIdx = n - 1;
  const watchIdx =
    worthIt.watchThrough != null
      ? seasons.findIndex((s) => s.season === worthIt.watchThrough)
      : -1;
  const labelIdx = [...new Set([0, peakIdx, lastIdx].filter((i) => i >= 0))];

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold md:text-2xl">Season-by-season</h2>
      <div className="glass rounded-2xl p-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label="Average rating by season"
        >
          {ticks.map((v) => (
            <g key={v}>
              <line
                x1={PAD.l}
                x2={W - PAD.r}
                y1={y(v)}
                y2={y(v)}
                className="stroke-fg/10"
              />
              <text x={2} y={y(v) + 3} className="fill-muted text-[9px]">
                {v}
              </text>
            </g>
          ))}

          <path d={area} className="fill-accent/15" />
          <path
            d={line}
            className="fill-none stroke-accent"
            strokeWidth={2}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {watchIdx >= 0 && (
            <line
              x1={x(watchIdx)}
              x2={x(watchIdx)}
              y1={PAD.t}
              y2={PAD.t + innerH}
              className="stroke-fg/30"
              strokeDasharray="3 3"
            />
          )}

          {pts.map((p, i) => (
            <circle
              key={i}
              cx={p[0]}
              cy={p[1]}
              r={i === peakIdx ? 4 : 2.5}
              className={i === peakIdx ? "fill-accent" : "fill-accent/70"}
            />
          ))}

          {labelIdx.map((i) => (
            <text
              key={i}
              x={x(i)}
              y={H - 7}
              textAnchor="middle"
              className="fill-muted text-[9px]"
            >
              S{seasons[i].season}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default SeasonTrendChart;
