import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditAppointment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "", description: "", date: "", time: "", duration: "",
        status: "scheduled", client_name: "", client_email: "", client_phone: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAppt = async () => {
            try {
                const res = await fetch(`/api/appointments/${id}/`);
                if (!res.ok) throw new Error("Not found");
                const data = await res.json();
                setForm({
                    title: data.title,
                    description: data.description || "",
                    date: data.date,
                    time: data.time,
                    duration: data.duration || "",
                    status: data.status,
                    client_name: data.client_name || "",
                    client_email: data.client_email || "",
                    client_phone: data.client_phone || "",
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAppt();
    }, [id]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const res = await fetch(`/api/appointments/${id}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(Object.values(errData).flat().join(", ") || "Failed to update");
            }
            navigate("/dashboard/appointments");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="products-page">
                <div className="products-header"><h1>Edit Appointment</h1></div>
                <div className="spinner-wrapper" style={{ padding: "40px" }}><div className="spinner" /><span>Loading...</span></div>
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="products-header">
                <div><h1>Edit Appointment</h1></div>
            </div>
            {error && <div className="error-alert"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>{error}</div>}
            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-card-body">
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input name="title" className="form-control" value={form.title} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea name="description" className="form-control form-textarea" value={form.description} onChange={handleChange} rows={2} />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input name="date" type="date" className="form-control" value={form.date} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Time</label>
                                <input name="time" type="time" className="form-control" value={form.time} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Duration</label>
                                <input name="duration" className="form-control" value={form.duration} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select name="status" className="form-control" value={form.status} onChange={handleChange}>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="rescheduled">Rescheduled</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Client Name</label>
                                <input name="client_name" className="form-control" value={form.client_name} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Client Email</label>
                                <input name="client_email" className="form-control" value={form.client_email} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Client Phone</label>
                            <input name="client_phone" className="form-control" value={form.client_phone} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-card-footer">
                        <button type="button" className="btn-secondary" onClick={() => navigate("/dashboard/appointments")}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? <span className="spinner-wrapper"><div className="spinner" />Saving...</span> : "Update Appointment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditAppointment;
