/**
 * Edit / delete controls overlaid on a card for admin users.
 *
 * Meant to sit inside a `group` + `relative` card; the controls stay hidden
 * (opacity-0) until the card is hovered (`group-hover:opacity-100`). Each button
 * calls `preventDefault` first so it never triggers the card's own link.
 *
 * @param {{ item: any, onEdit: (item:any)=>void, onDelete: (item:any)=>void }} props
 */
const btn = "w-8 h-8 flex items-center justify-center rounded-sm border border-border-default bg-bg-overlay backdrop-blur-[8px] text-text-secondary cursor-pointer transition-all duration-150";

function CardAdminActions({ item, onEdit, onDelete }) {
    return (
        // pointer-coarse: touch devices have no hover, so keep the controls visible
        <div className="absolute top-3 left-3 flex gap-1.5 z-[3] opacity-0 pointer-coarse:opacity-100 transition-opacity duration-[250ms] group-hover:opacity-100">
            <button
                className={`${btn} hover:text-neon-cyan hover:border-neon-cyan hover:shadow-[0_0_12px_var(--neon-cyan-dim)]`}
                onClick={(e) => { e.preventDefault(); onEdit(item); }}
                aria-label="Edit"
            >
                <i className="bi bi-pencil-fill"></i>
            </button>
            <button
                className={`${btn} hover:text-neon-pink hover:border-neon-pink hover:shadow-[0_0_12px_rgba(255,46,136,0.4)]`}
                onClick={(e) => { e.preventDefault(); onDelete(item); }}
                aria-label="Delete"
            >
                <i className="bi bi-trash-fill"></i>
            </button>
        </div>
    );
}

export default CardAdminActions;
