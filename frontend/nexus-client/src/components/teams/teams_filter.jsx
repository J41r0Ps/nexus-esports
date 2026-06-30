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
        onFilterChange({ pageNumber: 1, pageSize: 12 });
    };

    const hasActiveFilters = filters.searchQuery || filters.region || filters.gameId;

    return (
        <div className="filter-panel glass-card fade-in-up">
            <div className="filter-row">
                {/* Search */}
                <div className="filter-group filter-search">
                    <i className="bi bi-search filter-icon"></i>
                    <input
                        type="text"
                        name="searchQuery"
                        className="form-control"
                        placeholder="Search by name or tag..."
                        value={filters.searchQuery || ''}
                        onChange={handleChange}
                    />
                </div>

                {/* Region */}
                <div className="filter-group">
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
                <div className="filter-group">
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