import { useState, useEffect } from 'react';
import TeamsService from '@/api/teams_service';
import CountriesService from '@/api/countries_service';
import ImageUploader from '@/components/ui/image_uploader';
import { FormField, FormActions } from '@/components/ui/form_field';

/** Create / edit form for a player, rendered inside a modal. */
function PlayerForm({ initialData, onSubmit, onCancel, isSubmitting }) {
    const [formData, setFormData] = useState({
        gamertag: '',
        realName: '',
        role: 'Fragger',
        yearOfBirth: 2000,
        salary: 50000,
        photoUrl: '',
        teamId: '',
        countryId: '',
        ...initialData
    });

    const [teams, setTeams] = useState([]);
    const [countries, setCountries] = useState([]);
    const [errors, setErrors] = useState({});

    const roles = ['Fragger', 'IGL', 'Support', 'Sniper', 'Lurker', 'Coach', 'Analyst', 'Substitute'];

    useEffect(() => {
        TeamsService.getAllTeams({ pageSize: 50 }).then(r => setTeams(r.data));
        CountriesService.getAllCountries().then(r => setCountries(r.data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: ['yearOfBirth', 'salary', 'teamId', 'countryId'].includes(name)
                ? parseFloat(value) || ''
                : value
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.gamertag.trim()) newErrors.gamertag = 'Gamertag is required';
        if (!formData.realName.trim()) newErrors.realName = 'Real name is required';
        if (!formData.teamId) newErrors.teamId = 'Team is required';
        if (!formData.countryId) newErrors.countryId = 'Country is required';
        if (formData.yearOfBirth < 1970 || formData.yearOfBirth > new Date().getFullYear())
            newErrors.yearOfBirth = 'Invalid birth year';
        if (formData.salary < 0) newErrors.salary = 'Salary must be positive';
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
                <FormField label="Gamertag *" error={errors.gamertag}>
                    <input type="text" name="gamertag" className={controlClass('gamertag')}
                        value={formData.gamertag} onChange={handleChange} placeholder="e.g. s1mple" />
                </FormField>

                <FormField label="Real Name *" error={errors.realName}>
                    <input type="text" name="realName" className={controlClass('realName')}
                        value={formData.realName} onChange={handleChange} placeholder="e.g. Oleksandr Kostyliev" />
                </FormField>

                <FormField label="Role *">
                    <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </FormField>

                <FormField label="Year of Birth *" error={errors.yearOfBirth}>
                    <input type="number" name="yearOfBirth" className={controlClass('yearOfBirth')}
                        value={formData.yearOfBirth} onChange={handleChange}
                        min="1970" max={new Date().getFullYear()} />
                </FormField>

                <FormField label="Team *" error={errors.teamId}>
                    <select name="teamId" className={controlClass('teamId', 'form-select')}
                        value={formData.teamId} onChange={handleChange}>
                        <option value="">Select team...</option>
                        {teams.map(t => <option key={t.id} value={t.id}>[{t.tag}] {t.name}</option>)}
                    </select>
                </FormField>

                <FormField label="Country *" error={errors.countryId}>
                    <select name="countryId" className={controlClass('countryId', 'form-select')}
                        value={formData.countryId} onChange={handleChange}>
                        <option value="">Select country...</option>
                        {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </FormField>

                <FormField label="Salary ($) *" error={errors.salary}>
                    <input type="number" name="salary" className={controlClass('salary')}
                        value={formData.salary} onChange={handleChange} min="0" step="1000" />
                </FormField>

                <FormField full>
                    <ImageUploader
                        value={formData.photoUrl}
                        onChange={(url) => setFormData({ ...formData, photoUrl: url })}
                        folder="players"
                        label="Player Photo"
                    />
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

export default PlayerForm;
