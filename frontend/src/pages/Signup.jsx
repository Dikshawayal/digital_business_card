import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
        if (serverError) setServerError("");
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setLoading(true);
        setServerError("");

        try {
            const res = await fetch("/api/signup/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            let data;
            try {
                data = await res.json();
            } catch {
                data = {};
            }
            if (res.ok) {
    setSuccess(true);
    setTimeout(() => navigate("/", { state: { signupSuccess: true } }), 2500);
} else {
    console.log("Django Error Response:", data);

    if (data.errors) {
        setErrors(data.errors);
    } else if (data.error) {
        setServerError(
            typeof data.error === "string"
                ? data.error
                : JSON.stringify(data.error)
        );
    } else {
        setServerError("Registration failed. Please try again.");
    }
}
        } catch {
            setServerError("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-card-body">
                    <div className="text-center mb-4">
                        <div className="login-logo">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2" />
                                <path d="M12 17v4" />
                                <path d="M8 21h8" />
                            </svg>
                        </div>
                        <h2>Create Account</h2>
                    </div>
                    {serverError && (
                        <div className="error-alert" role="alert">
                            <FiAlertCircle size={18} />
                            <span>{serverError}</span>
                        </div>
                    )}
                    {success && (
                        <div className="success-alert" role="alert">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            <span>Account created successfully! Redirecting to login...</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="row mb-3">
                            <div className="col">
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                                    placeholder="Enter first name"
                                    disabled={loading || success}
                                />
                                {errors.firstName && (
                                    <div className="invalid-feedback">{errors.firstName}</div>
                                )}
                            </div>
                            <div className="col">
                                <label className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                                    placeholder="Enter last name"
                                    disabled={loading || success}
                                />
                                {errors.lastName && (
                                    <div className="invalid-feedback">{errors.lastName}</div>
                                )}
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                                placeholder="Choose a username"
                                autoComplete="username"
                                disabled={loading || success}
                            />
                            {errors.username && (
                                <div className="invalid-feedback">{errors.username}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                placeholder="Enter your email"
                                autoComplete="email"
                                disabled={loading || success}
                            />
                            {errors.email && (
                                <div className="invalid-feedback">{errors.email}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    disabled={loading || success}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <div className="invalid-feedback">{errors.password}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirm Password</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                    disabled={loading || success}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    aria-label={showConfirm ? "Hide password" : "Show password"}
                                    tabIndex={-1}
                                >
                                    {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <div className="invalid-feedback">{errors.confirmPassword}</div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="btn login-btn w-100"
                            disabled={loading || success}
                        >
                            {loading ? (
                                <span className="spinner-wrapper">
                                    <span className="spinner" />
                                    Creating Account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>
                    <div className="text-center mt-4">
                        <p className="signup-text">
                            Already have an account?{" "}
                            <Link to="/" className={loading || success ? "disabled-link" : ""}>
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
