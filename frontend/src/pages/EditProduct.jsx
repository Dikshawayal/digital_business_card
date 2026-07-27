import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import IconPicker from "../components/IconPicker";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", description: "", price: "", icon: "box", image: null });
    const [preview, setPreview] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}/`);
                if (!res.ok) throw new Error("Failed to load product");
                const data = await res.json();
                setForm({
                    name: data.name,
                    description: data.description || "",
                    price: data.price.toString(),
                    icon: data.icon || "box",
                    image: null,
                });
                if (data.image) setExistingImage(data.image);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

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

            const res = await fetch(`/api/products/${id}/`, {
                method: "PUT",
                body: fd,
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(Object.values(errData).flat().join(", ") || "Failed to update product");
            }
            toast.success("Product updated successfully!");
            setTimeout(() => {
    navigate("/dashboard/products");
}, 1000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="products-page">
                <div className="products-header"><h1>Edit Product</h1></div>
                <div className="spinner-wrapper" style={{ padding: "40px" }}><div className="spinner" /><span>Loading...</span></div>
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="products-header">
                <div>
                    <h1>Edit Product</h1>
                    <p>Update your product details</p>
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
                            {(preview || existingImage) && (
                                <img src={preview || existingImage} alt="Product" className="form-image-preview" />
                            )}
                        </div>
                    </div>
                    <div className="form-card-footer">
                        <button type="button" className="btn-secondary" onClick={() => navigate("/dashboard/products")}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? <span className="spinner-wrapper"><div className="spinner" />Saving...</span> : "Update Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProduct;
