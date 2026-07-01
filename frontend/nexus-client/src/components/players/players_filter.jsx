function PlayersFilter({ filters, onFilterChange, teams, countries }) {
    const roles = ['Fragger', 'IGL', 'Support', 'Sniper', 'Lurker', 'Coach', 'Analyst', 'Substitute'];

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

    const hasActiveFilters = filters.searchQuery || filters.role || filters.teamId || filters.countryId;

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
                        placeholder="Search by gamertag or real name..."
                        value={filters.searchQuery || ''}
                        onChange={handleChange}
                    />
                </div>

                {/* Role */}
                <div className="filter-group">
                    <select
                        name="role"
                        className="form-select"
                        value={filters.role || ''}
                        onChange={handleChange}
                    >
                        <option value="">All Roles</option>
                        {roles.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                {/* Team */}
                <div className="filter-group">
                    <select
                        name="teamId"
                        className="form-select"
                        value={filters.teamId || ''}
                        onChange={handleChange}
                    >
                        <option value="">All Teams</option>
                        {teams.map(t => (
                            <option key={t.id} value={t.id}>[{t.tag}] {t.name}</option>
                        ))}
                    </select>
                </div>

                {/* Country */}
                <div className="filter-group">
                    <select
                        name="countryId"
                        className="form-select"
                        value={filters.countryId || ''}
                        onChange={handleChange}
                    >
                        {countries.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.code} — {c.name}
                            </option>
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

export default PlayersFilter;