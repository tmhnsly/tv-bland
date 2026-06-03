import { IoStar } from "react-icons/io5";
import { Verdict, WorthIt } from "@/utils/worthIt";

const STYLES: Record<Verdict, { text: string; ring: string; chip: string }> = {
  "must-watch": {
    text: "text-emerald-400",
    ring: "ring-emerald-400/40",
    chip: "bg-emerald-400/15 text-emerald-300",
  },
  "worth-it": {
    text: "text-lime-400",
    ring: "ring-lime-400/40",
    chip: "bg-lime-400/15 text-lime-300",
  },
  mixed: {
    text: "text-amber-400",
    ring: "ring-amber-400/40",
    chip: "bg-amber-400/15 text-amber-300",
  },
  skip: {
    text: "text-rose-400",
    ring: "ring-rose-400/40",
    chip: "bg-rose-400/15 text-rose-300",
  },
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

interface WorthItVerdictProps {
  worthIt: WorthIt;
}

const WorthItVerdict: React.FC<WorthItVerdictProps> = ({ worthIt }) => {
  if (!worthIt.hasData) {
    return (
      <section className="glass rounded-2xl p-6 text-muted">
        Not enough episode ratings to give this one a Worth It score yet.
      </section>
    );
  }

  const s = STYLES[worthIt.verdict];

  return (
    <section className="glass rounded-2xl p-6 md:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div
          className={`grid h-28 w-28 shrink-0 place-items-center rounded-full ring-4 ${s.ring}`}
        >
          <div className="text-center">
            <div
              className={`font-display text-5xl font-semibold leading-none ${s.text}`}
            >
              {worthIt.score}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted">
              Worth it
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${s.chip}`}>
              {worthIt.verdictLabel}
            </span>
            <span className="rounded-full glass px-3 py-1 text-sm text-muted">
              {worthIt.trajectoryLabel}
            </span>
            {worthIt.watchThrough && (
              <span className="rounded-full bg-accent/15 px-3 py-1 text-sm font-medium text-accent">
                Best through Season {worthIt.watchThrough}
              </span>
            )}
          </div>
          <p className="mt-4 text-lg leading-relaxed">{worthIt.advisory}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t hairline pt-6 sm:grid-cols-4">
        <Stat label="Avg rating" value={`${worthIt.mean} / 10`} />
        <Stat label="Trajectory" value={worthIt.trajectoryLabel} />
        {worthIt.peakSeason && (
          <Stat
            label="Peak season"
            value={`S${worthIt.peakSeason.season} · ${worthIt.peakSeason.average}`}
          />
        )}
        <Stat
          label="Episodes rated"
          value={`${worthIt.ratedCount}/${worthIt.totalCount}`}
        />
      </div>

      {(worthIt.best || worthIt.worst) && (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {worthIt.best && (
            <div className="flex items-center gap-3 rounded-xl bg-emerald-400/10 px-4 py-3">
              <span className="flex items-center gap-1 text-sm font-semibold text-emerald-300">
                <IoStar size={13} />
                {worthIt.best.rating}
              </span>
              <span className="min-w-0">
                <span className="block text-xs uppercase tracking-wider text-muted">
                  Best episode
                </span>
                <span className="block truncate text-sm">
                  S{worthIt.best.season}E{worthIt.best.number} · {worthIt.best.name}
                </span>
              </span>
            </div>
          )}
          {worthIt.worst && (
            <div className="flex items-center gap-3 rounded-xl bg-rose-400/10 px-4 py-3">
              <span className="flex items-center gap-1 text-sm font-semibold text-rose-300">
                <IoStar size={13} />
                {worthIt.worst.rating}
              </span>
              <span className="min-w-0">
                <span className="block text-xs uppercase tracking-wider text-muted">
                  Weakest episode
                </span>
                <span className="block truncate text-sm">
                  S{worthIt.worst.season}E{worthIt.worst.number} · {worthIt.worst.name}
                </span>
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default WorthItVerdict;
