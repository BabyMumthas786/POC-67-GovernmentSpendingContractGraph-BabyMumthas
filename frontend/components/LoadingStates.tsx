"use client";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-800 ${className}`}
      style={{ opacity: 0.5 }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="w-64 p-4 space-y-4 bg-slate-900 border-r border-slate-800 h-full">
      <Skeleton className="h-6 w-1/2" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  );
}

export function GraphSkeleton() {
  return (
    <div className="graph-container w-full h-[500px] flex flex-col items-center justify-center bg-slate-950/50 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
      <p className="text-xs text-slate-500 z-10 mt-20">Analyzing spending network structure...</p>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex-1 p-6 space-y-6 bg-slate-950 min-h-screen">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="metric-card space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Middle Column (Graph & Charts) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-4 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/3" />
            </div>
            <GraphSkeleton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Right Column (Insights & Narratives) */}
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}
