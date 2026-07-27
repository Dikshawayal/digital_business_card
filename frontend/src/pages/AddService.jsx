import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IconPicker from "../components/IconPicker";

function AddService() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "",category:"", description: "", price: "", duration: "", image: null,icon: "Box",status: true, });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

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
        const res = await fetch("/api/services/", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(
                Object.values(err).flat().join(", ")
            );
        }
        toast.success("Service added successfully!");

setTimeout(() => {
    navigate("/dashboard/services");
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
                <h1>Add Service</h1>
                <p>Create a new service for your business</p>
            </div>
        </div>

        {error && (
            <div className="error-alert">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4m0 4h.01" />
                </svg>
                {error}
            </div>
        )}

        <div className="form-card">
            <form onSubmit={handleSubmit} encType="multipart/form-data">

                <div className="form-card-body">

                    <div className="form-group">
                        <label className="form-label">Service Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter service name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <input
                            type="text"
                            name="category"
                            className="form-control"
                            value={form.category}
                            onChange={handleChange}
                            placeholder="e.g. Web Development"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            className="form-control form-textarea"
                            rows="4"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Enter service description"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            className="form-control"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Duration</label>
                        <input
                            type="text"
                            name="duration"
                            className="form-control"
                            value={form.duration}
                            onChange={handleChange}
                            placeholder="e.g. 60 Minutes"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Service Image</label>
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
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => navigate("/dashboard/services")}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Create Service"}
                    </button>
                </div>

            </form>
        </div>
    </div>
);
}

export default AddService;
