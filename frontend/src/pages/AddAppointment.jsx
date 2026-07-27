import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddAppointment() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "", description: "", date: "", time: "", duration: "",
        status: "scheduled", client_name: "", client_email: "", client_phone: "",
    });
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
            const res = await fetch("/api/appointments/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(Object.values(errData).flat().join(", ") || "Failed to save");
            }
            navigate("/dashboard/appointments");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="products-page">
            <div className="products-header">
                <div><h1>Add Appointment</h1><p>Schedule a new appointment</p></div>
            </div>
            {error && <div className="error-alert"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>{error}</div>}
            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-card-body">
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input name="title" className="form-control" value={form.title} onChange={handleChange} required placeholder="Appointment title" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea name="description" className="form-control form-textarea" value={form.description} onChange={handleChange} rows={2} placeholder="Optional description" />
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
                                <input name="duration" className="form-control" value={form.duration} onChange={handleChange} placeholder="e.g. 60 min" />
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
                                <input name="client_name" className="form-control" value={form.client_name} onChange={handleChange} placeholder="Client name" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Client Email</label>
                                <input name="client_email" className="form-control" value={form.client_email} onChange={handleChange} placeholder="client@example.com" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Client Phone</label>
                            <input name="client_phone" className="form-control" value={form.client_phone} onChange={handleChange} placeholder="+1 (555) 123-4567" />
                        </div>
                    </div>
                    <div className="form-card-footer">
                        <button type="button" className="btn-secondary" onClick={() => navigate("/dashboard/appointments")}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? <span className="spinner-wrapper"><div className="spinner" />Saving...</span> : "Create Appointment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddAppointment;
