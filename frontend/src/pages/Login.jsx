import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function Login() {
    const location = useLocation();
    const navigate = useNavigate();
    const { login: setAuth } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const signupSuccess = location.state?.signupSuccess;

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
        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
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
            const res = await fetch("/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setAuth(data.user);
                navigate("/dashboard");
            } else {
                setServerError(
                    data.error || "Invalid username or password. Please try again."
                );
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
                        <h2>Login</h2>
                    </div>
                    {signupSuccess && (
                        <div className="success-alert" role="alert">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            <span>Account created successfully! Please login.</span>
                        </div>
                    )}
                    {serverError && (
                        <div className="error-alert" role="alert">
                            <FiAlertCircle size={18} />
                            <span>{serverError}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                                placeholder="Enter your username"
                                autoComplete="username"
                                disabled={loading}
                            />
                            {errors.username && (
                                <div className="invalid-feedback">{errors.username}</div>
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
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    disabled={loading}
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

                        <button
                            type="submit"
                            className="btn login-btn w-100"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner-wrapper">
                                    <span className="spinner" />
                                    Login
                                </span>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>
                    <div className="text-center mt-4">
                        <p className="signup-text">
                            Don't have an account?{" "}
                            <Link to="/signup" className={loading ? "disabled-link" : ""}>
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
