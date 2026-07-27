import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PublicBusinessCard() {
    const { id } = useParams();

    const [card, setCard] = useState(null);

    useEffect(() => {
        fetch(`/api/public-business-cards/${id}/`)
            .then((res) => res.json())
            .then((data) => setCard(data));
    }, [id]);

    if (!card) {
        return <h2>Loading...</h2>;
    }

    return (
    <div className="public-card">

        <img
            className="cover-photo"
            src={card.cover_photo}
            alt="Cover"
        />

        <img
            className="profile-photo"
            src={card.profile_photo}
            alt="Profile"
        />

        <h1>{card.company_name}</h1>

        <h3>{card.designation}</h3>

        <p>{card.about}</p>

        <div className="contact-info">

            <p>📞 {card.phone}</p>

            <p>✉️ {card.email}</p>

            <p>🌐 {card.website}</p>

            <p>📍 {card.address}</p>

        </div>

        <div className="action-buttons">

            <a href={`tel:${card.phone}`}>
                Call
            </a>

            <a href={`mailto:${card.email}`}>
                Email
            </a>

            <a href={card.website} target="_blank" rel="noreferrer">
                Website
            </a>

            <a href={`https://wa.me/${card.phone}`}>
                WhatsApp
            </a>

        </div>

        <h2>Products</h2>

        <div className="product-list">
            {card.products?.map((product) => (
                <div key={product.id} className="product-card">
                    {product.name}
                </div>
            ))}
        </div>

        <h2>Services</h2>

        <div className="service-list">
            {card.services?.map((service) => (
                <div key={service.id} className="service-card">
                    {service.name}
                </div>
            ))}
        </div>

        <img
            src={card.qr_code}
            alt="QR Code"
            width="180"
        />

    </div>
);
}
export default PublicBusinessCard;