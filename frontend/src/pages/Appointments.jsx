import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Appointments() {
    const navigate = useNavigate();
    const [appts, setAppts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchAppts = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/appointments/");
            if (!res.ok) throw new Error("Failed to load appointments");
            const data = await res.json();
            setAppts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAppts(); }, []);

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setSaving(true);
        setError("");
        try {
            await fetch(`/api/appointments/${deleteTarget.id}/`, { method: "DELETE" });
            await fetchAppts();
            setDeleteTarget(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const statusClass = (status) => {
        if (status === "completed") return "status-completed";
        if (status === "cancelled") return "status-cancelled";
        if (status === "rescheduled") return "status-rescheduled";
        return "status-scheduled";
    };

    return (
        <div className="products-page">
            <div className="products-header">
                <div>
                    <h1>Appointments</h1>
                    <p>{appts.length ? `${appts.length} appointment${appts.length > 1 ? "s" : ""}` : "No appointments yet"}</p>
                </div>
                <button className="btn-primary" onClick={() => navigate("/dashboard/appointments/add")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14m-7-7h14" /></svg>
                    Add Appointment
                </button>
            </div>

            {error && <div className="error-alert"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>{error}</div>}

            {appts.length === 0 ? (
                <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <h3>No Appointments Yet</h3>
                    <p>Schedule your first appointment.</p>
                    <button className="btn-primary" onClick={() => navigate("/dashboard/appointments/add")}>Add Appointment</button>
                </div>
            ) : (
                <div className="products-table-wrap">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Client</th>
                                <th>Status</th>
                                <th className="th-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appts.map((a) => (
                                <tr key={a.id}>
                                    <td className="td-name">{a.title}</td>
                                    <td className="td-date">{new Date(a.date).toLocaleDateString()}</td>
                                    <td className="td-date">{a.time.slice(0, 5)}</td>
                                    <td className="td-date">{a.client_name || "-"}</td>
                                    <td><span className={`status-badge ${statusClass(a.status)}`}>{a.status}</span></td>
                                    <td className="td-actions">
                                        <button className="btn-icon btn-edit" onClick={() => navigate(`/dashboard/appointments/${a.id}/edit`)} title="Edit">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        </button>
                                        <button className="btn-icon btn-delete" onClick={() => setDeleteTarget(a)} title="Delete">
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
                        <div className="modal-header"><h2>Delete Appointment</h2></div>
                        <div className="modal-body"><p>Delete <strong>{deleteTarget.title}</strong>?</p></div>
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

export default Appointments;
