import { useState, useEffect } from 'react';
import GamesService from '@/api/games_service';

function TournamentForm({ initialData, onSubmit, onCancel, isSubmitting }) {
    // Handle date format if editing (backend returns "dd/MM/yyyy", input needs "yyyy-MM-dd")
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
        startDate: '',
        endDate: '',
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

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-grid">
                <div className="form-field form-field-full">
                    <label>Tournament Name *</label>
                    <input type="text" name="name"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        value={formData.name} onChange={handleChange} placeholder="e.g. IEM Katowice 2025" />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-field">
                    <label>Game *</label>
                    <select name="gameId"
                        className={`form-select ${errors.gameId ? 'is-invalid' : ''}`}
                        value={formData.gameId} onChange={handleChange}>
                        <option value="">Select game...</option>
                        {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                    {errors.gameId && <span className="form-error">{errors.gameId}</span>}
                </div>

                <div className="form-field">
                    <label>Prize Pool ($) *</label>
                    <input type="number" name="prizePool"
                        className={`form-control ${errors.prizePool ? 'is-invalid' : ''}`}
                        value={formData.prizePool} onChange={handleChange} min="0" step="10000" />
                    {errors.prizePool && <span className="form-error">{errors.prizePool}</span>}
                </div>

                <div className="form-field">
                    <label>Status *</label>
                    <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className="form-field">
                    <label>Format *</label>
                    <select name="format" className="form-select" value={formData.format} onChange={handleChange}>
                        {formats.map(f => (
                            <option key={f} value={f}>
                                {f.replace(/([A-Z])/g, ' $1').trim()}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-field">
                    <label>Start Date *</label>
                    <input type="date" name="startDate"
                        className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                        value={formData.startDate} onChange={handleChange} />
                    {errors.startDate && <span className="form-error">{errors.startDate}</span>}
                </div>

                <div className="form-field">
                    <label>End Date *</label>
                    <input type="date" name="endDate"
                        className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                        value={formData.endDate} onChange={handleChange} />
                    {errors.endDate && <span className="form-error">{errors.endDate}</span>}
                </div>
            </div>

            <div className="modal-actions">
                <button type="button" className="btn-neon" onClick={onCancel} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="btn-neon-primary" disabled={isSubmitting}>
                    {isSubmitting
                        ? <><span className="btn-spinner"></span> Saving...</>
                        : <><i className="bi bi-check-lg me-2"></i> {initialData ? 'Update' : 'Create'}</>
                    }
                </button>
            </div>
        </form>
    );
}

export default TournamentForm;