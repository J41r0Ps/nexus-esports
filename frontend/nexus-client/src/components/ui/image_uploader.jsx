import { useState, useRef } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import UploadService from '@/api/upload_service';

function ImageUploader({ value, onChange, folder = 'misc', label = 'Image' }) {
    const { getAccessTokenSilently } = useAuth0();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setError(null);
        setUploading(true);

        try {
            const token = await getAccessTokenSilently();
            const result = await UploadService.uploadImage(file, folder, token);
            onChange(result.data.url);
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="image-uploader">
            <label className="uploader-label">{label}</label>

            <div className="uploader-container">
                {/* Preview */}
                <div className="uploader-preview">
                    {value ? (
                        <img src={value} alt="Preview" />
                    ) : (
                        <div className="uploader-preview-empty">
                            <i className="bi bi-image"></i>
                            <span>No image</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="uploader-actions">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />

                    <button
                        type="button"
                        className="btn-neon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <><span className="btn-spinner"></span> Uploading...</>
                        ) : (
                            <><i className="bi bi-cloud-upload me-2"></i> Upload Image</>
                        )}
                    </button>

                    {value && (
                        <button
                            type="button"
                            className="btn-clear"
                            onClick={() => onChange('')}
                        >
                            <i className="bi bi-x-circle"></i> Remove
                        </button>
                    )}

                    {/* Manual URL input as fallback */}
                    <input
                        type="text"
                        className="form-control uploader-url-input"
                        placeholder="or paste an image URL..."
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                    />

                    {error && <span className="form-error">{error}</span>}
                </div>
            </div>
        </div>
    );
}

export default ImageUploader;