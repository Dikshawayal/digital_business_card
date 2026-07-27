import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IconPicker from "../components/IconPicker";

function AddProduct() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", description: "", price: "", icon: "box", image: null });
    const [preview, setPreview] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        setForm((prev) => ({ ...prev, image: file }));
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const fd = new FormData();
            fd.append("name", form.name);
            fd.append("description", form.description);
            fd.append("price", form.price);
            fd.append("icon", form.icon);
            if (form.image) fd.append("image", form.image);

            const res = await fetch("/api/products/", {
                method: "POST",
                body: fd,
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(Object.values(errData).flat().join(", ") || "Failed to save product");
            }
           toast.success("Product added successfully!");
           setTimeout(() => {
    navigate("/dashboard/products");
}, 1000);
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
                    <h1>Add Product</h1>
                    <p>Create a new product for your business</p>
                </div>
            </div>

            {error && (
                <div className="error-alert">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
                    </svg>
                    {error}
                </div>
            )}

            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-card-body">
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input name="name" className="form-control" value={form.name} onChange={handleChange} required placeholder="Product name" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea name="description" className="form-control form-textarea" value={form.description} onChange={handleChange} placeholder="Optional description" rows={4} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Price ($)</label>
                            <input name="price" type="number" step="0.01" min="0" className="form-control" value={form.price} onChange={handleChange} required placeholder="0.00" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Icon</label>
                            <IconPicker value={form.icon} onChange={(name) => setForm((prev) => ({ ...prev, icon: name }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Image</label>
                            <input type="file" accept="image/*" className="form-control" onChange={handleFile} />
                            {preview && <img src={preview} alt="Preview" className="form-image-preview" />}
                        </div>
                    </div>
                    <div className="form-card-footer">
                        <button type="button" className="btn-secondary" onClick={() => navigate("/dashboard/products")}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? <span className="spinner-wrapper"><div className="spinner" />Saving...</span> : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;
