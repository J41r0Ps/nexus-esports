import {
    LineChart, Line, BarChart, Bar, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { EmptyState } from '@/components/ui/states';

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
            <div className="bg-bg-secondary border border-border-glow rounded-sm py-3 px-4 shadow-[var(--shadow-card)]">
                <p className="font-heading font-semibold text-text-primary text-[0.85rem] mb-2 pb-2 border-b border-border-default">{label}</p>
                {payload.map((entry, i) => (
                    <p key={i} style={{ color: entry.color }} className="text-[0.85rem] my-1">
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
            <EmptyState icon="bi-bar-chart-line" title="No stats available" description="Match statistics will appear here once the player competes." />
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
        <section className="mb-12">
            <h2 className="flex items-center gap-3 text-2xl font-semibold mb-6 tracking-[-0.02em]">
                <i className="bi bi-graph-up text-neon-cyan"></i>
                Performance Analytics
            </h2>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6">
                {/* Line Chart — Performance over time */}
                <div className="glass-card p-7">
                    <div className="mb-5">
                        <h3 className="text-[1.1rem] font-semibold text-text-primary mb-1">Performance Over Matches</h3>
                        <span className="text-[0.85rem] text-text-muted">K/D/A trend by match</span>
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
                <div className="glass-card p-7">
                    <div className="mb-5">
                        <h3 className="text-[1.1rem] font-semibold text-text-primary mb-1">Match Score</h3>
                        <span className="text-[0.85rem] text-text-muted">Score per match</span>
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
                <div className="glass-card p-7 col-[1/-1]">
                    <div className="mb-5">
                        <h3 className="text-[1.1rem] font-semibold text-text-primary mb-1">Player Profile</h3>
                        <span className="text-[0.85rem] text-text-muted">Average performance across stats</span>
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