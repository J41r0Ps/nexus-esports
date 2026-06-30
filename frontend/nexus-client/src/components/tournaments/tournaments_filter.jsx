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
        onFilterChange({ pageNumber: 1, pageSize: 9 });
    };

    const hasActiveFilters = filters.searchQuery || filters.status || filters.format || filters.gameId;

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
                        placeholder="Search by tournament name..."
                        value={filters.searchQuery || ''}
                        onChange={handleChange}
                    />
                </div>

                {/* Status */}
                <div className="filter-group">
                    <select
                        name="status"
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
                <div className="filter-group">
                    <select
                        name="format"
                        className="form-select"
                        value={filters.format || ''}
                        onChange={handleChange}
                    >
                        <option value="">All Formats</option>
                        {formats.map(f => (
                            <option key={f} value={f}>{f.replace(/([A-Z])/g, ' $1').trim()}</option>
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

export default TournamentsFilter;