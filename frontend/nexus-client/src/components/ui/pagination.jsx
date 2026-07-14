/**
 * Numbered pager with prev/next arrows and a sliding window of up to 5 pages
 * (plus first/last shortcuts and ellipses). `onPageChange` receives the 1-based
 * target page.
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    const btn = "min-w-10 h-10 px-3 flex items-center justify-center rounded-sm border border-border-default bg-bg-secondary text-text-secondary font-heading font-medium cursor-pointer transition-all duration-150 hover:enabled:border-border-glow hover:enabled:text-neon-cyan disabled:opacity-40 disabled:cursor-not-allowed";
    const activeBtn = "bg-gradient-to-br from-neon-cyan to-neon-violet !text-bg-primary !border-transparent shadow-glow-cyan";
    const dots = "text-text-muted px-2";

    return (
        <nav className="flex justify-center items-center gap-2 my-8">
            <button
                className={btn}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <i className="bi bi-chevron-left"></i>
            </button>

            {start > 1 && (
                <>
                    <button className={btn} onClick={() => onPageChange(1)}>1</button>
                    {start > 2 && <span className={dots}>…</span>}
                </>
            )}

            {pages.map(page => (
                <button
                    key={page}
                    className={`${btn} ${page === currentPage ? activeBtn : ''}`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            {end < totalPages && (
                <>
                    {end < totalPages - 1 && <span className={dots}>…</span>}
                    <button className={btn} onClick={() => onPageChange(totalPages)}>
                        {totalPages}
                    </button>
                </>
            )}

            <button
                className={btn}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <i className="bi bi-chevron-right"></i>
            </button>
        </nav>
    );
}

export default Pagination;
