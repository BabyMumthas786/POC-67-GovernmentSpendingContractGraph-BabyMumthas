"use client";

interface TimelineProps {
  year: number | undefined;
  onChange: (year: number | undefined) => void;
}

const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

export default function Timeline({ year, onChange }: TimelineProps) {
  return (
    <div className="timeline-container" id="timeline-control">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}>
          Timeline
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: "var(--accent-blue)" }}>
            {year || "All Years"}
          </span>
          {year && (
            <button
              onClick={() => onChange(undefined)}
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: "var(--bg-tertiary)", color: "var(--text-muted)" }}
            >
              Clear
            </button>
          )}
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={YEARS.length}
        step={1}
        value={year ? YEARS.indexOf(year) + 1 : 0}
        onChange={(e) => {
          const idx = parseInt(e.target.value);
          onChange(idx === 0 ? undefined : YEARS[idx - 1]);
        }}
        className="timeline-slider"
      />
      <div className="flex justify-between mt-2">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>All</span>
        {YEARS.map((y) => (
          <span key={y} className="text-xs" style={{
            color: y === year ? "var(--accent-blue)" : "var(--text-muted)",
            fontWeight: y === year ? 600 : 400,
          }}>
            {y}
          </span>
        ))}
      </div>
    </div>
  );
}
