import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ViewBusinessCard() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCard = async () => {
            try {
                const res = await fetch(`/api/business-cards/${id}/`, {
    credentials: "include",
});
                if (!res.ok) throw new Error("Card not found");
                const data = await res.json();
                setCard(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCard();
    }, [id]);

    if (loading) {
        return (
            <div className="products-page">
                <div className="products-header"><h1>Business Card</h1></div>
                <div className="spinner-wrapper" style={{ padding: "40px" }}><div className="spinner" /><span>Loading...</span></div>
            </div>
        );
    }

    if (!card) {
        return (
            <div className="products-page">
                <div className="products-header"><h1>Business Card</h1></div>
                <p style={{ color: "var(--text-muted)", padding: "40px" }}>Card not found.</p>
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="products-header">
                <div>
                    <h1>{card.company_name || "Business Card"}</h1>
                    <p>Card preview</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="btn-secondary" onClick={() => navigate("/dashboard/business")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
                        Back
                    </button>
                </div>
            </div>

            <div className="business-card-preview" style={{ "--card-color": card.primary_color }}>
                <div className="preview-card-wrap">
                    <div
                        className={`preview-card${card.cover_photo ? " has-cover" : ""}`}
                        style={card.cover_photo ? {
                            backgroundImage: `url(${card.cover_photo})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        } : {}}
                    >
                        <div className={`preview-card-body${card.cover_photo ? " preview-card-overlay" : ""}`}>
                            <h3 className="preview-name">{card.company_name || "Untitled"}</h3>
                            {card.designation && <p className="preview-designation">{card.designation}</p>}
                            {card.profile_photo ? (
                                <img src={card.profile_photo} alt="Profile" className="preview-profile" />
                            ) : (
                                <div className="preview-profile preview-profile-placeholder">
                                    {(card.company_name || "?").charAt(0).toUpperCase()}
                                </div>
                            )}
                            {card.about && <p className="preview-about">{card.about}</p>}
                            <div className="preview-details">
                                {card.phone && <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>{card.phone}</span>}
                                {card.email && <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>{card.email}</span>}
                                {card.website && <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>{card.website}</span>}
                                {card.address && <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>{card.address}</span>}
                            </div>
                            {card.qr_code && <img src={card.qr_code} alt="QR Code" className="preview-qr" />}
                        </div>
                    </div>
                </div>
                {/* Products */}
<div className="card-section">
    <h2>Products</h2>

    {card.products && card.products.length > 0 ? (
        <div className="product-grid">
            {card.products.map((product) => (
                <div key={product.id} className="product-card">
                    {product.image && (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="product-image"
                        />
                    )}

                    <h4>{product.name}</h4>

                    <p>{product.description}</p>

                    <strong>₹ {product.price}</strong>
                </div>
            ))}
        </div>
    ) : (
        <p>No Products Added</p>
    )}
</div>

{/* Services */}
<div className="card-section">
    <h2>Services</h2>

    {card.services && card.services.length > 0 ? (
        <div className="service-grid">
            {card.services.map((service) => (
                <div key={service.id} className="service-card">
                    {service.image && (
                        <img
                            src={service.image}
                            alt={service.name}
                            className="service-image"
                        />
                    )}

                    <h4>{service.name}</h4>

                    <p>{service.description}</p>

                    <strong>₹ {service.price}</strong>
                </div>
            ))}
        </div>
    ) : (
        <p>No Services Added</p>
    )}
</div>
            </div>
        </div>
    );
}

export default ViewBusinessCard;
