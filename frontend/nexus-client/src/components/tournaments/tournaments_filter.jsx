import { humanize } from '@/lib/format';

const groupCls = "sm:flex-1 sm:min-w-[180px]";

function TournamentsFilter({ filters, onFilterChange, games }) {
    const statuses = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'];
    const formats = ['SingleElimination', 'DoubleElimination', 'RoundRobin', 'Swiss', 'GSL'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({
            ...filters,
            [name]: value || null,
            pageNumber: 1
        });
    };

    const handleClear = () => {
        onFilterChange({ pageNumber: 1, pageSize: 8 });
    };

    const hasActiveFilters = filters.searchQuery || filters.status || filters.format || filters.gameId;

    return (
        <div className="glass-card fade-in-up p-5 mb-8">
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:items-center">
                {/* Search */}
                <div className="relative sm:flex-[2] sm:min-w-[250px]">
                    <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-base pointer-events-none z-[2]"></i>
                    <input
                        type="text"
                        name="searchQuery"
                        aria-label="Search tournaments"
                        className="form-control !pl-11"
                        placeholder="Search by tournament name..."
                        value={filters.searchQuery || ''}
                        onChange={handleChange}
                    />
                </div>

                {/* Status */}
                <div className={groupCls}>
                    <select
                        name="status"
                        aria-label="Filter by status"
                        className="form-select"
                        value={filters.status || ''}
                        onChange={handleChange}
                    >
                        <option value="">All Statuses</option>
                        {statuses.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {/* Format */}
                <div className={groupCls}>
                    <select
                        name="format"
                        aria-label="Filter by format"
                        className="form-select"
                        value={filters.format || ''}
                        onChange={handleChange}
                    >
                        <option value="">All Formats</option>
                        {formats.map(f => (
                            <option key={f} value={f}>{humanize(f)}</option>
                        ))}
                    </select>
                </div>

                {/* Game */}
                <div className={groupCls}>
                    <select
                        name="gameId"
                        aria-label="Filter by game"
                        className="form-select"
                        value={filters.gameId || ''}
                        onChange={handleChange}
                    >
                        <option value="">All Games</option>
                        {games.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                </div>

                {/* Clear */}
                {hasActiveFilters && (
                    <button className="btn-clear" onClick={handleClear}>
                        <i className="bi bi-x-circle"></i> Clear
                    </button>
                )}
            </div>
        </div>
    );
}

export default TournamentsFilter;
