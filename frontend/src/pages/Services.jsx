import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import icons from "../data/icons";

function Services() {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchServices = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/services/");
            if (!res.ok) throw new Error("Failed to load services");
            const data = await res.json();
            setServices(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchServices(); }, []);

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setSaving(true);
        setError("");
        try {
            const res = await fetch(`/api/services/${deleteTarget.id}/`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete service");
            await fetchServices();
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
                    <h1>Services</h1>
                    <p>Manage your services and their pricing</p>
                </div>
                <button className="btn-primary" onClick={() => navigate("/dashboard/services/add")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14m-7-7h14" />
                    </svg>
                    Add Service
                </button>
            </div>

            {error && (
                <div className="error-alert">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
                    </svg>
                    {error}
                </div>
            )}

            <div className="products-table-wrap">
                <table className="products-table">
                    <thead>
    <tr>
        <th>Icon</th>
        <th>Image</th>
        <th>Service Name</th>
        <th>Category</th>
        <th>Price</th>
        <th>Duration</th>
        <th>Status</th>
        <th>Created</th>
        <th className="th-actions">Actions</th>
    </tr>
</thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={9} className="td-empty">
                                    <div className="spinner-wrapper"><div className="spinner" /><span>Loading...</span></div>
                                </td>
                            </tr>
                        ) : services.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="td-empty">No services yet. Click "Add Service" to create one.</td>
                            </tr>
                        ) : (
                            services.map((s) => (
                                <tr key={s.id}>

    <td>
        {(() => {
            const icon = icons.find(
                (i) => i.name.toLowerCase() === (s.icon || "").toLowerCase()
            ) || { name: "", paths: [] };
            return icon.paths.length ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {icon.paths.map((d, i) => <path key={i} d={d} />)}
                </svg>
            ) : (
                <span>-</span>
            );
        })()}
    </td>

    <td>
        {s.image ? (
            <img
                src={`http://127.0.0.1:8000${s.image}`}
                alt={s.name}
                className="service-image"
            />
        ) : (
            <span>No Image</span>
        )}
    </td>

    <td>{s.name}</td>

    <td>{s.category || "-"}</td>

    <td>₹{parseFloat(s.price).toFixed(2)}</td>

    <td>{s.duration}</td>

    <td>
        {s.status ? (
            <span className="status-active">
                Active
            </span>
        ) : (
            <span className="status-inactive">
                Inactive
            </span>
        )}
    </td>

    <td>
        {new Date(s.created_at).toLocaleDateString()}
    </td>

    <td className="td-actions">

        <button
            className="btn-icon btn-edit"
            onClick={() =>
                navigate(`/dashboard/services/${s.id}/edit`)
            }
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
        </button>

        <button
            className="btn-icon btn-delete"
            onClick={() => setDeleteTarget(s)}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
        </button>

    </td>

</tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {deleteTarget && (
                <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header"><h2>Delete Service</h2></div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
                            <button type="button" className="btn-danger" onClick={confirmDelete} disabled={saving}>
                                {saving ? <span className="spinner-wrapper"><div className="spinner" />Deleting...</span> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Services;
