// Shared display formatters (previously duplicated across cards and detail screens).

/** $1.5M / $250K / $900 — used for prize pools and salaries. */
export const formatMoney = (amount) => {
    if (amount == null) return '—';
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
    return `$${amount}`;
};

/** "SingleElimination" → "Single Elimination" (API enums are PascalCase). */
export const humanize = (value) => value?.replace(/([A-Z])/g, ' $1').trim() ?? '';
