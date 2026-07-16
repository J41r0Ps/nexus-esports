import { useState, useEffect } from 'react';
import GamesService from '@/api/games_service';
import { FormField, FormActions } from '@/components/ui/form_field';
import { humanize } from '@/lib/format';

/** Create / edit form for a tournament, rendered inside a modal. */
function TournamentForm({ initialData, onSubmit, onCancel, isSubmitting }) {
    // Editing returns dates as "dd/MM/yyyy"; the native date input needs "yyyy-MM-dd".
    const parseDate = (dateStr) => {
        if (!dateStr) return '';
        if (dateStr.includes('/')) {
            const [d, m, y] = dateStr.split('/');
            return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        }
        return dateStr.split('T')[0];
    };

    const [formData, setFormData] = useState({
        name: '',
        prizePool: 100000,
        status: 'Upcoming',
        format: 'SingleElimination',
        gameId: '',
        ...initialData,
        startDate: parseDate(initialData?.startDate),
        endDate: parseDate(initialData?.endDate)
    });

    const [games, setGames] = useState([]);
    const [errors, setErrors] = useState({});

    const statuses = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'];
    const formats = ['SingleElimination', 'DoubleElimination', 'RoundRobin', 'Swiss', 'GSL'];

    useEffect(() => {
        GamesService.getAllGames().then(r => setGames(r.data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: ['prizePool', 'gameId'].includes(name) ? parseFloat(value) || '' : value
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.gameId) newErrors.gameId = 'Game is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate))
            newErrors.endDate = 'End date must be after start date';
        if (formData.prizePool < 0) newErrors.prizePool = 'Prize pool must be positive';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({
                ...formData,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString()
            });
        }
    };

    // Adds the invalid outline to a control when its field has an error.
    const controlClass = (field, base = 'form-control') => `${base} ${errors[field] ? 'is-invalid' : ''}`;

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Tournament Name *" error={errors.name} full>
                    <input type="text" name="name" className={controlClass('name')}
                        value={formData.name} onChange={handleChange} placeholder="e.g. IEM Katowice 2025" />
                </FormField>

                <FormField label="Game *" error={errors.gameId}>
                    <select name="gameId" className={controlClass('gameId', 'form-select')}
                        value={formData.gameId} onChange={handleChange}>
                        <option value="">Select game...</option>
                        {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                </FormField>

                <FormField label="Prize Pool ($) *" error={errors.prizePool}>
                    <input type="number" name="prizePool" className={controlClass('prizePool')}
                        value={formData.prizePool} onChange={handleChange} min="0" step="10000" />
                </FormField>

                <FormField label="Status *">
                    <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </FormField>

                <FormField label="Format *">
                    <select name="format" className="form-select" value={formData.format} onChange={handleChange}>
                        {formats.map(f => (
                            <option key={f} value={f}>{humanize(f)}</option>
                        ))}
                    </select>
                </FormField>

                <FormField label="Start Date *" error={errors.startDate}>
                    <input type="date" name="startDate" className={controlClass('startDate')}
                        value={formData.startDate} onChange={handleChange} />
                </FormField>

                <FormField label="End Date *" error={errors.endDate}>
                    <input type="date" name="endDate" className={controlClass('endDate')}
                        value={formData.endDate} onChange={handleChange} />
                </FormField>
            </div>

            <FormActions>
                <button type="button" className="btn-neon" onClick={onCancel} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="btn-neon-primary" disabled={isSubmitting}>
                    {isSubmitting
                        ? <><span className="btn-spinner"></span> Saving...</>
                        : <><i className="bi bi-check-lg me-2"></i> {initialData ? 'Update' : 'Create'}</>
                    }
                </button>
            </FormActions>
        </form>
    );
}

export default TournamentForm;
