import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SocialLinks() {
    const navigate = useNavigate();
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchLinks = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/social-links/");
            if (!res.ok) throw new Error("Failed to load social links");
            const data = await res.json();
            setLinks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLinks(); }, []);

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setSaving(true);
        setError("");
        try {
            await fetch(`/api/social-links/${deleteTarget.id}/`, { method: "DELETE" });
            await fetchLinks();
            setDeleteTarget(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="products-page">
            <div className="products-header">
                <div>
                    <h1>Social Links</h1>
                    <p>{links.length ? `${links.length} social link${links.length > 1 ? "s" : ""}` : "No social links yet"}</p>
                </div>
                <button className="btn-primary" onClick={() => navigate("/dashboard/social-links/add")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14m-7-7h14" /></svg>
                    Add Link
                </button>
            </div>

            {error && <div className="error-alert"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>{error}</div>}

            {links.length === 0 ? (
                <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <h3>No Social Links Yet</h3>
                    <p>Add links to your social media profiles.</p>
                    <button className="btn-primary" onClick={() => navigate("/dashboard/social-links/add")}>Add Link</button>
                </div>
            ) : (
                <div className="products-table-wrap">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Platform</th>
                                <th>Label</th>
                                <th>URL</th>
                                <th className="th-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {links.map((link) => (
                                <tr key={link.id}>
                                    <td className="td-name" style={{ textTransform: "capitalize" }}>{link.platform}</td>
                                    <td className="td-date">{link.label || "-"}</td>
                                    <td className="td-date" style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis" }}>{link.url}</td>
                                    <td className="td-actions">
                                        <button className="btn-icon btn-edit" onClick={() => navigate(`/dashboard/social-links/${link.id}/edit`)} title="Edit">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        </button>
                                        <button className="btn-icon btn-delete" onClick={() => setDeleteTarget(link)} title="Delete">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {deleteTarget && (
                <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header"><h2>Delete Link</h2></div>
                        <div className="modal-body"><p>Delete <strong>{deleteTarget.label || deleteTarget.platform}</strong>?</p></div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
                            <button className="btn-danger" onClick={confirmDelete} disabled={saving}>
                                {saving ? <span className="spinner-wrapper"><div className="spinner" />Deleting...</span> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SocialLinks;
