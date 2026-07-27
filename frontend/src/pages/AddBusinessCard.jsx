import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

function AddBusinessCard() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        company_name: "", designation: "", phone: "", email: "",
        website: "", address: "", about: "",primary_color: "#2563eb",
    });
    const [files, setFiles] = useState({});
    const [previews, setPreviews] = useState({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [products, setProducts] = useState([]);
const [services, setServices] = useState([]);

const [selectedProducts, setSelectedProducts] = useState([]);
const [selectedServices, setSelectedServices] = useState([]);
useEffect(() => {
    fetch("/api/products/", {
        credentials: "include",
    })
        .then((res) => res.json())
        .then((data) => {
            setProducts(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error(err));

    fetch("/api/services/", {
        credentials: "include",
    })
        .then((res) => res.json())
        .then((data) => {
            setServices(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error(err));
}, []);

// ADD THESE LINES HERE
const productOptions = products.map((product) => ({
    value: product.id,
    label: product.name,
}));

const serviceOptions = services.map((service) => ({
    value: service.id,
    label: service.name,
}));

const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFile = (e) => {
        const field = e.target.name;
        const file = e.target.files[0];
        if (!file) return;
        setFiles((prev) => ({ ...prev, [field]: file }));
        setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        Object.entries(files).forEach(([k, v]) => fd.append(k, v));
        selectedProducts.forEach((id) => {
    fd.append("products", id);
});

selectedServices.forEach((id) => {
    fd.append("services", id);
});
        try {
            const res = await fetch("/api/business-cards/", { method: "POST", body: fd });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(Object.values(errData).flat().join(", ") || "Failed to save card");
            }
            navigate("/dashboard/business");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const imgField = (field, label) => (
        <div className="photo-upload">
            {previews[field] ? <img src={previews[field]} alt={label} className="photo-preview" /> : <div className="photo-placeholder"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg></div>}
            <label className="photo-label"><span>{label}</span><input type="file" name={field} accept="image/*" onChange={handleFile} hidden /></label>
        </div>
    );

    return (
        <div className="products-page">
            <div className="products-header">
                <div><h1>Add Business Card</h1><p>Create a new digital business card</p></div>
            </div>
            {error && (
                <div className="error-alert">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
                    {error}
                </div>
            )}
            <div className="form-card">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-card-body">
                        <div className="photos-row">
                            {imgField("profile_photo", "Profile Photo")}
                            {imgField("cover_photo", "Cover Photo")}
                            {imgField("qr_code", "QR Code")}
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Company Name</label><input name="company_name" className="form-control" value={form.company_name} onChange={handleChange} placeholder="Your company" /></div>
                            <div className="form-group"><label className="form-label">Designation</label><input name="designation" className="form-control" value={form.designation} onChange={handleChange} placeholder="Your designation" /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="form-label">Phone No</label><input name="phone" className="form-control" value={form.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" /></div>
                            <div className="form-group"><label className="form-label">Email</label><input name="email" className="form-control" value={form.email} onChange={handleChange} placeholder="contact@company.com" /></div>
                        </div>
                        <div className="form-group"><label className="form-label">Website</label><input name="website" className="form-control" value={form.website} onChange={handleChange} placeholder="https://yourcompany.com" /></div>
                        <div className="form-group"><label className="form-label">Address</label><textarea name="address" className="form-control form-textarea" value={form.address} onChange={handleChange} placeholder="Your business address" rows={2} /></div>
                        <div className="form-group"><label className="form-label">About</label><textarea name="about" className="form-control form-textarea" value={form.about} onChange={handleChange} placeholder="Tell people about your business" rows={3} /></div>
                        <div className="form-group">

<div className="form-group">
    <label className="form-label">Products</label>

    <Select
        isMulti
        options={productOptions}
        placeholder="Select Products"
        onChange={(selected) =>
            setSelectedProducts(
                selected ? selected.map((item) => item.value) : []
            )
        }
    />
</div>

<div className="form-group">
    <label className="form-label">Services</label>

    <Select
        isMulti
        options={serviceOptions}
        placeholder="Select Services"
        onChange={(selected) =>
            setSelectedServices(
                selected ? selected.map((item) => item.value) : []
            )
        }
            />
            </div> 
                        </div>
                    </div>
                    <div className="form-card-footer">
                        <button type="button" className="btn-secondary" onClick={() => navigate("/dashboard/business")}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? <span className="spinner-wrapper"><div className="spinner" />Saving...</span> : "Create Card"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddBusinessCard;
