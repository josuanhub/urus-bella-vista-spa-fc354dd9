import React from 'react';

const LoadingSkeleton = ({ rows = 5, cols = 3, type = 'table' }) => {
  const baseSkeletonClass = "bg-[#1A1A2E] rounded animate-pulse";
  const shimmerClass = "bg-gradient-to-r from-[#1A1A2E] via-[#2A2A4E] to-[#1A1A2E] bg-[length:200%_100%] animate-pulse rounded";

  // ─── TABLE SKELETON ───────────────────────────────────────────────────────
  if (type === 'table') {
    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-full">
          {/* Header Row */}
          <div className="flex gap-3 px-4 py-3 border-b border-[#6C63FF]/20 mb-2">
            {Array.from({ length: cols }).map((_, colIdx) => (
              <div
                key={`head-${colIdx}`}
                className={`h-4 ${shimmerClass} ${colIdx === 0 ? 'flex-[2]' : 'flex-1'}`}
              />
            ))}
          </div>

          {/* Data Rows */}
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div
              key={`row-${rowIdx}`}
              className={`flex gap-3 px-4 py-3 border-b border-[#1A1A2E] transition-all
                ${rowIdx % 2 === 0 ? 'bg-[#0A0A0F]' : 'bg-[#0D0D18]'}`}
            >
              {Array.from({ length: cols }).map((_, colIdx) => (
                <div
                  key={`cell-${rowIdx}-${colIdx}`}
                  className={`flex items-center gap-2 ${colIdx === 0 ? 'flex-[2]' : 'flex-1'}`}
                >
                  {colIdx === 0 && (
                    <div className={`w-8 h-8 rounded-full shrink-0 ${shimmerClass}`} />
                  )}
                  <div className="flex flex-col gap-1.5 w-full">
                    <div
                      className={`h-3.5 ${shimmerClass}`}
                      style={{ width: `${60 + Math.random() * 30}%` }}
                    />
                    {colIdx === 0 && (
                      <div className={`h-2.5 ${shimmerClass} w-2/5`} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Footer / Pagination Placeholder */}
          <div className="flex items-center justify-between px-4 py-4 mt-2">
            <div className={`h-3 w-32 ${shimmerClass}`} />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`w-8 h-8 rounded ${shimmerClass}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── CARDS SKELETON ───────────────────────────────────────────────────────
  if (type === 'cards') {
    const gridCols =
      cols === 1
        ? 'grid-cols-1'
        : cols === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : cols === 3
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : cols === 4
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

    return (
      <div className={`grid ${gridCols} gap-4 w-full`}>
        {Array.from({ length: rows }).map((_, cardIdx) => (
          <div
            key={`card-${cardIdx}`}
            className="bg-[#1A1A2E] border border-[#6C63FF]/10 rounded-2xl overflow-hidden"
          >
            {/* Card Image / Banner */}
            <div className={`w-full h-44 ${shimmerClass} rounded-none`} />

            <div className="p-4 flex flex-col gap-3">
              {/* Badge */}
              <div className={`h-5 w-20 rounded-full ${shimmerClass}`} />

              {/* Title */}
              <div className={`h-5 w-3/4 ${shimmerClass}`} />

              {/* Subtitle lines */}
              <div className="flex flex-col gap-2">
                <div className={`h-3 w-full ${shimmerClass}`} />
                <div className={`h-3 w-5/6 ${shimmerClass}`} />
                <div className={`h-3 w-2/3 ${shimmerClass}`} />
              </div>

              {/* Divider */}
              <div className="border-t border-[#6C63FF]/10 my-1" />

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full ${shimmerClass}`} />
                  <div className={`h-3 w-20 ${shimmerClass}`} />
                </div>
                <div className={`h-8 w-24 rounded-lg ${shimmerClass}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ─── LIST SKELETON ────────────────────────────────────────────────────────
  if (type === 'list') {
    return (
      <div className="w-full flex flex-col gap-0">
        {Array.from({ length: rows }).map((_, itemIdx) => (
          <div
            key={`list-${itemIdx}`}
            className={`flex items-center gap-4 px-4 py-4 border-b border-[#1A1A2E]
              ${itemIdx % 2 === 0 ? 'bg-[#0A0A0F]' : 'bg-[#0D0D18]'}
              transition-all`}
          >
            {/* Avatar / Icon */}
            <div className={`w-11 h-11 rounded-xl shrink-0 ${shimmerClass}`} />

            {/* Content */}
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              <div className="flex items-center gap-2">
                <div className={`h-4 rounded ${shimmerClass}`} style={{ width: `${40 + (itemIdx * 13) % 35}%` }} />
                <div className={`h-4 w-14 rounded-full ${shimmerClass}`} />
              </div>
              <div className={`h-3 w-3/4 ${shimmerClass}`} />
              {cols >= 3 && (
                <div className={`h-3 w-1/2 ${shimmerClass}`} />
              )}
            </div>

            {/* Meta / Actions */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className={`h-3 w-16 ${shimmerClass}`} />
              {cols >= 2 && (
                <div className={`h-6 w-20 rounded-lg ${shimmerClass}`} />
              )}
            </div>
          </div>
        ))}

        {/* Bottom summary bar */}
        <div className="flex items-center justify-between px-4 py-4 bg-[#0A0A0F]">
          <div className={`h-3 w-40 ${shimmerClass}`} />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`w-8 h-8 rounded-lg ${shimmerClass}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── FALLBACK ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col gap-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`h-10 w-full ${shimmerClass}`} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;