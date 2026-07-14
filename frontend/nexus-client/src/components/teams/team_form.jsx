import { useState, useEffect } from 'react';
import GamesService from '@/api/games_service';
import CountriesService from '@/api/countries_service';
import ImageUploader from '@/components/ui/image_uploader';
import { FormField, FormActions } from '@/components/ui/form_field';

/** Create / edit form for a team, rendered inside a modal. */
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

    // Adds the invalid outline to a control when its field has an error.
    const controlClass = (field, base = 'form-control') => `${base} ${errors[field] ? 'is-invalid' : ''}`;

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Team Name *" error={errors.name} full>
                    <input type="text" name="name" className={controlClass('name')}
                        value={formData.name} onChange={handleChange} placeholder="e.g. Natus Vincere" />
                </FormField>

                <FormField label="Tag *" error={errors.tag}>
                    <input type="text" name="tag" className={controlClass('tag')}
                        value={formData.tag} onChange={handleChange} placeholder="e.g. NaVi" maxLength={10} />
                </FormField>

                <FormField label="Region *">
                    <select name="region" className="form-select" value={formData.region} onChange={handleChange}>
                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </FormField>

                <FormField label="Founded Year *" error={errors.foundedYear}>
                    <input type="number" name="foundedYear" className={controlClass('foundedYear')}
                        value={formData.foundedYear} onChange={handleChange}
                        min="1990" max={new Date().getFullYear()} />
                </FormField>

                <FormField label="Game *" error={errors.gameId}>
                    <select name="gameId" className={controlClass('gameId', 'form-select')}
                        value={formData.gameId} onChange={handleChange}>
                        <option value="">Select game...</option>
                        {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                </FormField>

                <FormField label="Country *" error={errors.countryId}>
                    <select name="countryId" className={controlClass('countryId', 'form-select')}
                        value={formData.countryId} onChange={handleChange}>
                        <option value="">Select country...</option>
                        {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </FormField>

                <FormField label="Organization ID">
                    <input type="number" name="organizationId" className="form-control"
                        value={formData.organizationId} onChange={handleChange} />
                </FormField>

                <FormField full>
                    <ImageUploader
                        value={formData.logoUrl}
                        onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                        folder="teams"
                        label="Team Logo"
                    />
                </FormField>
            </div>

            <FormActions>
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
            </FormActions>
        </form>
    );
}

export default TeamForm;
