import { useState, useEffect } from 'react';
import TeamsService from '@/api/teams_service';
import CountriesService from '@/api/countries_service';
import ImageUploader from '@/components/ui/image_uploader';

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

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-grid">
                <div className="form-field">
                    <label>Gamertag *</label>
                    <input type="text" name="gamertag"
                        className={`form-control ${errors.gamertag ? 'is-invalid' : ''}`}
                        value={formData.gamertag} onChange={handleChange} placeholder="e.g. s1mple" />
                    {errors.gamertag && <span className="form-error">{errors.gamertag}</span>}
                </div>

                <div className="form-field">
                    <label>Real Name *</label>
                    <input type="text" name="realName"
                        className={`form-control ${errors.realName ? 'is-invalid' : ''}`}
                        value={formData.realName} onChange={handleChange} placeholder="e.g. Oleksandr Kostyliev" />
                    {errors.realName && <span className="form-error">{errors.realName}</span>}
                </div>

                <div className="form-field">
                    <label>Role *</label>
                    <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                <div className="form-field">
                    <label>Year of Birth *</label>
                    <input type="number" name="yearOfBirth"
                        className={`form-control ${errors.yearOfBirth ? 'is-invalid' : ''}`}
                        value={formData.yearOfBirth} onChange={handleChange}
                        min="1970" max={new Date().getFullYear()} />
                    {errors.yearOfBirth && <span className="form-error">{errors.yearOfBirth}</span>}
                </div>

                <div className="form-field">
                    <label>Team *</label>
                    <select name="teamId"
                        className={`form-select ${errors.teamId ? 'is-invalid' : ''}`}
                        value={formData.teamId} onChange={handleChange}>
                        <option value="">Select team...</option>
                        {teams.map(t => <option key={t.id} value={t.id}>[{t.tag}] {t.name}</option>)}
                    </select>
                    {errors.teamId && <span className="form-error">{errors.teamId}</span>}
                </div>

                <div className="form-field">
                    <label>Country *</label>
                    <select name="countryId"
                        className={`form-select ${errors.countryId ? 'is-invalid' : ''}`}
                        value={formData.countryId} onChange={handleChange}>
                        <option value="">Select country...</option>
                        {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {errors.countryId && <span className="form-error">{errors.countryId}</span>}
                </div>

                <div className="form-field">
                    <label>Salary ($) *</label>
                    <input type="number" name="salary"
                        className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                        value={formData.salary} onChange={handleChange} min="0" step="1000" />
                    {errors.salary && <span className="form-error">{errors.salary}</span>}
                </div>

                <div className="form-field form-field-full">
                    <ImageUploader
                        value={formData.photoUrl}
                        onChange={(url) => setFormData({ ...formData, photoUrl: url })}
                        folder="players"
                        label="Player Photo"
                    />
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

export default PlayerForm;