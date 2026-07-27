import { useState } from "react";
import { useNavigate } from "react-router-dom";

const platforms = [
    "facebook", "instagram", "twitter", "linkedin", "youtube",
    "tiktok", "whatsapp", "telegram", "github", "website", "other",
];

function AddSocialLink() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ platform: "other", label: "", url: "" });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const res = await fetch("/api/social-links/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(Object.values(errData).flat().join(", ") || "Failed to save");
            }
            navigate("/dashboard/social-links");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="products-page">
            <div className="products-header">
                <div><h1>Add Social Link</h1><p>Add a new social media link</p></div>
            </div>
            {error && <div className="error-alert"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>{error}</div>}
            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-card-body">
                        <div className="form-group">
                            <label className="form-label">Platform</label>
                            <select name="platform" className="form-control" value={form.platform} onChange={handleChange}>
                                {platforms.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Label <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional)</span></label>
                            <input name="label" className="form-control" value={form.label} onChange={handleChange} placeholder="e.g. My Business Page" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">URL</label>
                            <input name="url" className="form-control" value={form.url} onChange={handleChange} required placeholder="https://facebook.com/yourpage" />
                        </div>
                    </div>
                    <div className="form-card-footer">
                        <button type="button" className="btn-secondary" onClick={() => navigate("/dashboard/social-links")}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? <span className="spinner-wrapper"><div className="spinner" />Saving...</span> : "Add Link"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddSocialLink;
