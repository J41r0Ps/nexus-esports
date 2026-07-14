// Shimmering placeholders shown while list/detail data is loading.

const cardClass = "relative overflow-hidden rounded-md border border-border-default bg-bg-secondary";
const shimmerClass = "absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,transparent_0%,var(--bg-tertiary)_20%,rgba(0,240,255,0.05)_50%,var(--bg-tertiary)_80%,transparent_100%)]";

export function SkeletonCard({ height = 280 }) {
    return (
        <div className={cardClass} style={{ height: `${height}px` }}>
            <div className={shimmerClass}></div>
        </div>
    );
}

/**
 * A grid of skeleton cards. Pass the same `className` grid the real list uses
 * (columns + gap) so the loading state matches the loaded layout.
 */
export function SkeletonGrid({ count = 8, height = 280, className = "grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 mb-12" }) {
    return (
        <div className={className}>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} height={height} />
            ))}
        </div>
    );
}

export function SkeletonLine({ width = "100%", height = 16 }) {
    return (
        <div
            className={cardClass}
            style={{ width, height: `${height}px`, borderRadius: '4px' }}
        >
            <div className={shimmerClass}></div>
        </div>
    );
}
