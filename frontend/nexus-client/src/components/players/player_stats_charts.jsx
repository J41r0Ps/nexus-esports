import {
    LineChart, Line, BarChart, Bar, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = {
    cyan: '#00f0ff',
    violet: '#b026ff',
    pink: '#ff2e88',
    green: '#00ff94',
    grid: 'rgba(148, 163, 184, 0.1)',
    text: '#94a3b8'
};

function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (
            <div className="chart-tooltip">
                <p className="chart-tooltip-label">{label}</p>
                {payload.map((entry, i) => (
                    <p key={i} style={{ color: entry.color }} className="chart-tooltip-item">
                        {entry.name}: <strong>{entry.value}</strong>
                    </p>
                ))}
            </div>
        );
    }
    return null;
}

function PlayerStatsCharts({ stats }) {
    if (!stats || stats.length === 0) {
        return (
            <div className="empty-state glass-card">
                <i className="bi bi-bar-chart-line empty-icon"></i>
                <h3>No stats available</h3>
                <p>Match statistics will appear here once the player competes.</p>
            </div>
        );
    }

    // Per-match data
    const matchData = stats.map((s, i) => ({
        match: `M${i + 1}`,
        Kills: s.kills,
        Deaths: s.deaths,
        Assists: s.assists,
        Score: parseFloat(s.score)
    }));

    // Radar — averages
    const avg = (k) => stats.reduce((sum, s) => sum + s[k], 0) / stats.length;
    const maxVal = Math.max(...stats.flatMap(s => [s.kills, s.deaths, s.assists, parseFloat(s.score) / 10]));

    const radarData = [
        { stat: 'Kills', value: avg('kills'), fullMark: maxVal },
        { stat: 'Deaths', value: avg('deaths'), fullMark: maxVal },
        { stat: 'Assists', value: avg('assists'), fullMark: maxVal },
        { stat: 'Score', value: avg('score') / 10, fullMark: maxVal },
    ];

    return (
        <section className="charts-section">
            <h2 className="section-title">
                <i className="bi bi-graph-up" style={{ color: 'var(--neon-cyan)' }}></i>
                Performance Analytics
            </h2>

            <div className="charts-grid">
                {/* Line Chart — Performance over time */}
                <div className="chart-card glass-card">
                    <div className="chart-header">
                        <h3>Performance Over Matches</h3>
                        <span className="chart-subtitle">K/D/A trend by match</span>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={matchData}>
                            <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                            <XAxis dataKey="match" stroke={COLORS.text} fontSize={11} />
                            <YAxis stroke={COLORS.text} fontSize={11} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Line type="monotone" dataKey="Kills" stroke={COLORS.pink} strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="Deaths" stroke="#64748b" strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="Assists" stroke={COLORS.cyan} strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart — Score per match */}
                <div className="chart-card glass-card">
                    <div className="chart-header">
                        <h3>Match Score</h3>
                        <span className="chart-subtitle">Score per match</span>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={matchData}>
                            <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                            <XAxis dataKey="match" stroke={COLORS.text} fontSize={11} />
                            <YAxis stroke={COLORS.text} fontSize={11} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="Score" fill="url(#scoreGradient)" radius={[6, 6, 0, 0]} />
                            <defs>
                                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={COLORS.violet} stopOpacity={1} />
                                    <stop offset="100%" stopColor={COLORS.cyan} stopOpacity={0.3} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Radar Chart — Average profile */}
                <div className="chart-card glass-card chart-card-wide">
                    <div className="chart-header">
                        <h3>Player Profile</h3>
                        <span className="chart-subtitle">Average performance across stats</span>
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke={COLORS.grid} />
                            <PolarAngleAxis dataKey="stat" stroke={COLORS.text} fontSize={12} />
                            <PolarRadiusAxis stroke={COLORS.text} fontSize={10} />
                            <Radar
                                dataKey="value"
                                stroke={COLORS.cyan}
                                fill={COLORS.cyan}
                                fillOpacity={0.3}
                                strokeWidth={2}
                            />
                            <Tooltip content={<CustomTooltip />} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
}

export default PlayerStatsCharts;