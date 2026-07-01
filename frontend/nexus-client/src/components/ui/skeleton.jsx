export function SkeletonCard({ height = 280 }) {
    return (
        <div className="skeleton-card" style={{ height: `${height}px` }}>
            <div className="skeleton-shimmer"></div>
        </div>
    );
}

export function SkeletonGrid({ count = 8, height = 280 }) {
    return (
        <div className="skeleton-grid">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} height={height} />
            ))}
        </div>
    );
}

export function SkeletonLine({ width = "100%", height = 16 }) {
    return (
        <div
            className="skeleton-card"
            style={{ width, height: `${height}px`, borderRadius: '4px' }}
        >
            <div className="skeleton-shimmer"></div>
        </div>
    );
}