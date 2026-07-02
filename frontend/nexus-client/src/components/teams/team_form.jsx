import { useState, useEffect } from 'react';
import GamesService from '@/api/games_service';
import CountriesService from '@/api/countries_service';
import ImageUploader from '@/components/ui/image_uploader';

function TeamForm({ initialData, onSubmit, onCancel, isSubmitting }) {
    const [formData, setFormData] = useState({
        name: '',
        tag: '',
        region: 'EU',
        logoUrl: '',
        foundedYear: new Date().getFullYear(),
        gameId: '',
        organizationId: 1,
        countryId: '',
        ...initialData
    });

    const [games, setGames] = useState([]);
    const [countries, setCountries] = useState([]);
    const [errors, setErrors] = useState({});

    const regions = ['EU', 'NA', 'APAC', 'LATAM', 'ME', 'CIS', 'OCE'];

    useEffect(() => {
        GamesService.getAllGames().then(r => setGames(r.data));
        CountriesService.getAllCountries().then(r => setCountries(r.data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: ['foundedYear', 'gameId', 'organizationId', 'countryId'].includes(name)
                ? parseInt(value) || ''
                : value
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.tag.trim()) newErrors.tag = 'Tag is required';
        if (formData.tag.length > 10) newErrors.tag = 'Tag max 10 characters';
        if (!formData.gameId) newErrors.gameId = 'Game is required';
        if (!formData.countryId) newErrors.countryId = 'Country is required';
        if (formData.foundedYear < 1990 || formData.foundedYear > new Date().getFullYear())
            newErrors.foundedYear = 'Invalid year';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-grid">
                <div className="form-field form-field-full">
                    <label>Team Name *</label>
                    <input
                        type="text"
                        name="name"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Natus Vincere"
                    />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-field">
                    <label>Tag *</label>
                    <input
                        type="text"
                        name="tag"
                        className={`form-control ${errors.tag ? 'is-invalid' : ''}`}
                        value={formData.tag}
                        onChange={handleChange}
                        placeholder="e.g. NaVi"
                        maxLength={10}
                    />
                    {errors.tag && <span className="form-error">{errors.tag}</span>}
                </div>

                <div className="form-field">
                    <label>Region *</label>
                    <select
                        name="region"
                        className="form-select"
                        value={formData.region}
                        onChange={handleChange}
                    >
                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                <div className="form-field">
                    <label>Founded Year *</label>
                    <input
                        type="number"
                        name="foundedYear"
                        className={`form-control ${errors.foundedYear ? 'is-invalid' : ''}`}
                        value={formData.foundedYear}
                        onChange={handleChange}
                        min="1990"
                        max={new Date().getFullYear()}
                    />
                    {errors.foundedYear && <span className="form-error">{errors.foundedYear}</span>}
                </div>

                <div className="form-field">
                    <label>Game *</label>
                    <select
                        name="gameId"
                        className={`form-select ${errors.gameId ? 'is-invalid' : ''}`}
                        value={formData.gameId}
                        onChange={handleChange}
                    >
                        <option value="">Select game...</option>
                        {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                    {errors.gameId && <span className="form-error">{errors.gameId}</span>}
                </div>

                <div className="form-field">
                    <label>Country *</label>
                    <select
                        name="countryId"
                        className={`form-select ${errors.countryId ? 'is-invalid' : ''}`}
                        value={formData.countryId}
                        onChange={handleChange}
                    >
                        <option value="">Select country...</option>
                        {countries.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    {errors.countryId && <span className="form-error">{errors.countryId}</span>}
                </div>

                <div className="form-field">
                    <label>Organization ID</label>
                    <input
                        type="number"
                        name="organizationId"
                        className="form-control"
                        value={formData.organizationId}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field form-field-full">
                    <ImageUploader
                        value={formData.logoUrl}
                        onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                        folder="teams"
                        label="Team Logo"
                    />
                </div>
            </div>

            <div className="modal-actions">
                <button type="button" className="btn-neon" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </button>
                <button type="submit" className="btn-neon-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <><span className="btn-spinner"></span> Saving...</>
                    ) : (
                        <><i className="bi bi-check-lg me-2"></i> {initialData ? 'Update' : 'Create'}</>
                    )}
                </button>
            </div>
        </form>
    );
}

export default TeamForm;