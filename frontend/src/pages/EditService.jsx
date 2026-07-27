import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import IconPicker from "../components/IconPicker";

function EditService() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", category: "", description: "", price: "", duration: "",  image: null,icon:"Box",status: true,});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await fetch(`/api/services/${id}/`);
                if (!res.ok) throw new Error("Failed to load service");
                const data = await res.json();
                setForm({
    name: data.name,
    category: data.category || "",
    description: data.description || "",
    price: data.price ? data.price.toString() : "",
    duration: data.duration || "",
    image: null,
    icon:data.icon || "Box",
    status: data.status,
});

if (data.image) {
    setPreview(data.image);
}
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setForm((prev) => ({
        ...prev,
        [name]:
            type === "checkbox"
                ? checked
                : type === "file"
                ? files[0]
                : value,
    }));

    if (type === "file" && files[0]) {
        setPreview(URL.createObjectURL(files[0]));
    }
};
const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("duration", form.duration);
    formData.append("icon", form.icon);
    formData.append("status", form.status);

    if (form.image) {
        formData.append("image", form.image);
    }

    try {
        const res = await fetch(`/api/services/${id}/`, {
            method: "PUT",
            body: formData,
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(
                Object.values(errData).flat().join(", ")
            );
        }

       toast.success("Service updated successfully!");

setTimeout(() => {
    navigate("/dashboard/services");
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
                <div className="products-header"><h1>Edit Service</h1></div>
                <div className="spinner-wrapper" style={{ padding: "40px" }}><div className="spinner" /><span>Loading...</span></div>
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="products-header">
                <div>
                    <h1>Edit Service</h1>
                    <p>Update your service details</p>
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
                            <input name="name" className="form-control" value={form.name} onChange={handleChange} required placeholder="Service name" />
                        </div>
                        <div className="form-group">
    <label className="form-label">Category</label>

    <input
        type="text"
        name="category"
        className="form-control"
        value={form.category}
        onChange={handleChange}
        placeholder="Web Development"
    />
</div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea name="description" className="form-control form-textarea" value={form.description} onChange={handleChange} placeholder="Optional description" rows={4} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Price (₹)</label>
                            <input name="price" type="number" step="0.01" min="0" className="form-control" value={form.price} onChange={handleChange} required placeholder="0.00" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Duration</label>
                            <input name="duration" className="form-control" value={form.duration} onChange={handleChange} placeholder="e.g. 60 min" />
                        </div>
                        <div className="form-group">
    <label className="form-label">Service Image</label>

    {preview && (
        <img
            src={preview}
            alt="Preview"
            className="service-image"
            style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                marginBottom: "10px",
                borderRadius: "8px",
            }}
        />
    )}

    <input
        type="file"
        name="image"
        className="form-control"
        accept="image/*"
        onChange={handleChange}
    />
</div>
   
      <div className="form-group">
    <label className="form-label">Icon</label>

    <IconPicker
        value={form.icon}
        onChange={(icon) =>
            setForm({
                ...form,
                icon: icon
            })
        }
    />
</div>
<div className="form-group">
    <div className="form-check">
        <input
            type="checkbox"
            name="status"
            className="form-check-input"
            checked={form.status}
            onChange={handleChange}
        />

        <label className="form-check-label">
            Active
        </label>
    </div>
</div>
                    </div>
                    <div className="form-card-footer">
                        <button type="button" className="btn-secondary" onClick={() => navigate("/dashboard/services")}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? <span className="spinner-wrapper"><div className="spinner" />Saving...</span> : "Update Service"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditService;
