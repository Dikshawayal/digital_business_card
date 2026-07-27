import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Business() {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [success, setSuccess] = useState("");

    const fetchCards = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/business-cards/", {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to load business cards");
            const data = await res.json();
            setCards(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCards(); }, []);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(""), 4000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setSaving(true);
        setError("");
        try {
            const res = await fetch(`/api/business-cards/${deleteTarget.id}/`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Failed to delete card (${res.status}): ${text}`);
            }
            setSuccess(`"${deleteTarget.company_name || "Business card"}" deleted successfully.`);
            await fetchCards();
            setDeleteTarget(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="products-page">
                <div className="products-header"><h1>Business Cards</h1></div>
                <div className="spinner-wrapper" style={{ padding: "40px" }}><div className="spinner" /><span>Loading...</span></div>
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="products-header">
                <div>
                    <h1>Business Cards</h1>
                    <p>{cards.length ? `You have ${cards.length} card${cards.length > 1 ? "s" : ""}` : "No business cards yet"}</p>
                </div>
                <button className="btn-primary" onClick={() => navigate("/dashboard/business/add")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14m-7-7h14" />
                    </svg>
                    Add Business Card
                </button>
            </div>

            {success && (
                <div className="success-alert">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {success}
                </div>
            )}
            {error && (
                <div className="error-alert">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
                    </svg>
                    {error}
                </div>
            )}

            {cards.length === 0 ? (
                <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M12 17v4" /><path d="M8 21h8" />
                    </svg>
                    <h3>No Business Cards Yet</h3>
                    <p>Create your first digital business card.</p>
                    <button className="btn-primary" onClick={() => navigate("/dashboard/business/add")}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14m-7-7h14" /></svg>
                        Create Business Card
                    </button>
                </div>
            ) : (
                <div className="products-table-wrap">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Company Name</th>
                                <th>Designation</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Created</th>
                                <th className="th-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cards.map((card) => (
                                <tr key={card.id}>
                                    <td className="td-name">{card.company_name || "Untitled"}</td>
                                    <td className="td-date">{card.designation || "-"}</td>
                                    <td className="td-date">{card.phone || "-"}</td>
                                    <td className="td-date">{card.email || "-"}</td>
                                    <td className="td-date">{new Date(card.created_at).toLocaleDateString()}</td>
                                    <td className="td-actions">
                                        <button className="btn-icon btn-view" onClick={() =>navigate(`/business/view/${card.id}`)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                        </button>
                                        <button className="btn-icon btn-edit" onClick={() => navigate(`/dashboard/business/${card.id}/edit`)} title="Edit">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        </button>
                                        <button className="btn-icon btn-delete" onClick={() => setDeleteTarget(card)} title="Delete">
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
  <div className="delete-modal-overlay">
    <div className="delete-modal">
      <h2>Delete Card</h2>

      <div className="divider"></div>

      <p className="delete-message">
        Are you sure you want to delete{" "}
        <span>{deleteTarget.company_name}</span>?
      </p>

      <p className="delete-warning">
        This action cannot be undone.
      </p>

      <div className="delete-actions">
        <button
          className="cancel-btn"
          onClick={() => setDeleteTarget(null)}
        >
          Cancel
        </button>

        <button
          className="delete-btn"
          onClick={confirmDelete}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

        </div>
    );
}

export default Business;
