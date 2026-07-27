import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (!e.target.closest(".account-dropdown")) {
                setOpen(false);
            }
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, [open]);

    const initials = user
        ? ((user.first_name?.[0] || "") + (user.last_name?.[0] || "")).toUpperCase() || user.username[0].toUpperCase()
        : "?";

    return (
        <header className="navbar">
            <div className="navbar-title">Dashboard</div>
            <div className="navbar-right">
                <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                    {theme === "light" ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    )}
                </button>
                <div className="account-dropdown">
                    <button
                        type="button"
                        className="account-btn"
                        onClick={() => setOpen((prev) => !prev)}
                        aria-label="Account"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </button>
                    {open && user && (
                        <div className="dropdown-menu">
                            <div className="dropdown-header">
                                <div className="dropdown-avatar">{initials}</div>
                                <div>
                                    <div className="dropdown-name">{user.first_name} {user.last_name}</div>
                                    <div className="dropdown-email">{user.email}</div>
                                    <div className="dropdown-username">@{user.username}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
