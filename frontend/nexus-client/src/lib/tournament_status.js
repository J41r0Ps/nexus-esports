// Single source of truth for tournament status styling (badge class, icon,
// display label, and the card top-stripe gradient). Status colors are
// semantic — green = live, yellow = upcoming, violet = completed, pink =
// cancelled — and must stay consistent everywhere a status is shown.

export const TOURNAMENT_STATUS = {
    Upcoming: {
        badge: 'badge-yellow',
        icon: 'bi-hourglass-split',
        label: 'Upcoming',
        stripe: 'bg-gradient-to-r from-neon-yellow to-neon-cyan',
    },
    Ongoing: {
        badge: 'badge-green',
        icon: 'bi-broadcast',
        label: 'Live now',
        stripe: 'bg-gradient-to-r from-neon-green to-neon-cyan',
    },
    Completed: {
        badge: 'badge-violet',
        icon: 'bi-check-circle-fill',
        label: 'Completed',
        stripe: 'bg-gradient-to-r from-neon-violet to-neon-pink',
    },
    Cancelled: {
        badge: 'badge-pink',
        icon: 'bi-x-circle-fill',
        label: 'Cancelled',
        stripe: 'bg-gradient-to-r from-neon-pink to-[#808080]',
    },
};

/** Config for a status string, falling back to Upcoming for unknown values. */
export const statusOf = (status) => TOURNAMENT_STATUS[status] || TOURNAMENT_STATUS.Upcoming;
