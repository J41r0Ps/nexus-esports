const groupCls = "sm:flex-1 sm:min-w-[180px]";

function PlayersFilter({ filters, onFilterChange, teams, countries }) {
    const roles = ['Fragger', 'IGL', 'Support', 'Sniper', 'Lurker', 'Coach', 'Analyst', 'Substitute'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value || null, pageNumber: 1 });
    };

    const handleClear = () => onFilterChange({ pageNumber: 1, pageSize: 12 });

    const hasActiveFilters = filters.searchQuery || filters.role || filters.teamId || filters.countryId;

    return (
        <div className="glass-card fade-in-up p-5 mb-8">
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:items-center">
                <div className="relative sm:flex-[2] sm:min-w-[250px]">
                    <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-base pointer-events-none z-[2]"></i>
                    <input
                        type="text"
                        name="searchQuery"
                        aria-label="Search players"
                        className="form-control !pl-11"
                        placeholder="Search by gamertag or real name..."
                        value={filters.searchQuery || ''}
                        onChange={handleChange}
                    />
                </div>

                {/* Only show role filter if we have roles */}
                {roles.length > 0 && (
                    <div className={groupCls}>
                        <select name="role" aria-label="Filter by role" className="form-select"
                            value={filters.role || ''} onChange={handleChange}>
                            <option value="">All Roles</option>
                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                )}

                {teams.length > 0 && (
                    <div className={groupCls}>
                        <select name="teamId" aria-label="Filter by team" className="form-select"
                            value={filters.teamId || ''} onChange={handleChange}>
                            <option value="">All Teams</option>
                            {teams.map(t => (
                                <option key={t.id} value={t.id}>[{t.tag}] {t.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {countries.length > 0 && (
                    <div className={groupCls}>
                        <select name="countryId" aria-label="Filter by country" className="form-select"
                            value={filters.countryId || ''} onChange={handleChange}>
                            <option value="">All Countries</option>
                            {countries.map(c => (
                                <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
                            ))}
                        </select>
                    </div>
                )}

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
