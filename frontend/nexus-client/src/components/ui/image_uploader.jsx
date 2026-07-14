import { useState, useRef } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import UploadService from '@/api/upload_service';

/**
 * Image picker used inside the create/edit forms. Uploads the chosen file to the
 * given `folder` via the upload API and reports the resulting URL through
 * `onChange`; also accepts a pasted URL as a fallback.
 *
 * @param {{ value: string, onChange: (url:string)=>void, folder?: string, label?: string }} props
 */
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
        <div className="flex flex-col">
            <label className="font-heading text-xs tracking-[0.1em] uppercase text-text-secondary mb-2">{label}</label>

            <div className="flex gap-6 items-start max-[600px]:flex-col">
                {/* Preview */}
                <div className="w-[140px] h-[140px] shrink-0 overflow-hidden rounded-md border-2 border-dashed border-border-default bg-bg-tertiary transition-colors duration-150 hover:border-border-glow max-[600px]:w-full max-[600px]:h-[200px]">
                    {value ? (
                        <img src={value} alt="Preview" className="w-full h-full object-contain bg-white p-2" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-text-muted text-[0.85rem]">
                            <i className="bi bi-image text-[2rem]"></i>
                            <span>No image</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="grow flex flex-col gap-3">
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
                        className="form-control text-[0.85rem]"
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
