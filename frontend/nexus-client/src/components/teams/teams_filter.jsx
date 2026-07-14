const groupCls = "sm:flex-1 sm:min-w-[180px]";

function TeamsFilter({ filters, onFilterChange, games }) {
    const regions = ['EU', 'NA', 'APAC', 'LATAM', 'ME', 'CIS', 'OCE'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({
            ...filters,
            [name]: value || null,
            pageNumber: 1
        });
    };

    const handleClear = () => {
        onFilterChange({ pageNumber: 1, pageSize: 10 });
    };

    const hasActiveFilters = filters.searchQuery || filters.region || filters.gameId;

    return (
        <div className="glass-card fade-in-up p-5 mb-8">
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:items-center">
                {/* Search */}
                <div className="relative sm:flex-[2] sm:min-w-[250px]">
                    <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-base pointer-events-none z-[2]"></i>
                    <input
                        type="text"
                        name="searchQuery"
                        className="form-control !pl-11"
                        placeholder="Search by name or tag..."
                        value={filters.searchQuery || ''}
                        onChange={handleChange}
                    />
                </div>

                {/* Region */}
                <div className={groupCls}>
                    <select
                        name="region"
                        className="form-select"
                        value={filters.region || ''}
                        onChange={handleChange}
                    >
                        <option value="">All Regions</option>
                        {regions.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                {/* Game */}
                <div className={groupCls}>
                    <select
                        name="gameId"
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

export default TeamsFilter;
