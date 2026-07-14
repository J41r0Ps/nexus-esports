/**
 * Form primitives shared by the create/edit modals (team / player / tournament).
 * They only own layout + label/error presentation — inputs and their
 * validation state (`form-control`/`is-invalid`) stay in the parent form.
 */

const labelCls = "font-heading text-xs tracking-[0.1em] uppercase text-text-secondary mb-2";

/**
 * A single labeled field: label on top, the input(s) as children, an optional
 * error message below.
 *
 * @param {{ label?: string, error?: string, full?: boolean, children: React.ReactNode }} props
 *   `full` makes the field span both columns of the 2-column form grid.
 */
export function FormField({ label, error, full = false, children }) {
    return (
        <div className={`flex flex-col ${full ? 'sm:col-span-2' : ''}`}>
            {label && <label className={labelCls}>{label}</label>}
            {children}
            {error && <span className="form-error">{error}</span>}
        </div>
    );
}

/** Right-aligned Cancel / Submit row rendered at the bottom of a modal form. */
export function FormActions({ children }) {
    return (
        <div className="flex flex-wrap gap-4 justify-end mt-8 pt-6 border-t border-border-default">
            {children}
        </div>
    );
}
