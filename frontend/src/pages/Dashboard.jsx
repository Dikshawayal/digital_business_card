import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
function Dashboard() {
     const { user } = useAuth();
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);

const [stats, setStats] = useState({
    business_cards: 0,
    services: 0,
    products: 0,
    appointments: 0,
});
useEffect(() => {
    const fetchDashboard = async () => {
        try {
            // Fetch Stats
            const statsRes = await fetch("/api/dashboard/stats/");
            const statsData = await statsRes.json();
            setStats(statsData);

            // Fetch Activities
            const activityRes = await fetch("/api/dashboard/activities/");
            const activityData = await activityRes.json();
            setActivities(activityData);
        } catch (err) {
            console.error(err);
        }
    };

    fetchDashboard();
}, []);

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1>Welcome back{user ? `, ${user.first_name || user.username}` : ""}!</h1>
                <p>Here's an overview of your digital business card</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon stat-icon-1">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" />
                            <path d="M12 17v4" />
                            <path d="M8 21h8" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.business_cards}</span>
                        <span className="stat-label">Business Cards</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon stat-icon-2">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.services}</span>
                        <span className="stat-label">Services</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon stat-icon-3">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.products}</span>
                        <span className="stat-label">Products</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon stat-icon-4">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.appointments}</span>
                        <span className="stat-label">Appointments</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div className="card-body">
                        <div className="action-list">
                            <button className="action-btn"onClick={() => navigate("/dashboard/business/add")}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14m-7-7h14" />
                                </svg>
                                Create Business Card
                            </button>
                            <button
    className="action-btn"
    onClick={() => navigate("/dashboard/services/add")}
>

                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14m-7-7h14" />
                                </svg>
                                Add Service
                            </button>
                            <button
    className="action-btn"
    onClick={() => navigate("/dashboard/products/add")}
>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14m-7-7h14" />
                                </svg>
                                Add Product
                            </button>
                            <button
    className="action-btn"
    onClick={() => navigate("/dashboard/appointments/add")}
>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14m-7-7h14" />
                                </svg>
                                Add Appointments
                            </button>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Recent Activity</h3>
                    </div>
                    <div className="card-body">
                        <div className="activity-list">
    {activities.length > 0 ? (
        activities.map((activity, index) => (
            <div className="activity-item" key={index}>
                <div className="activity-icon activity-icon-check">
                    ✓
                </div>

                <div className="activity-info">
    <span className="activity-text">
        {activity.action}
    </span>

    <span className="activity-time">
        {formatDistanceToNow(
            new Date(activity.created_at),
            { addSuffix: true }
        )}
    </span>
</div>
            </div>
        ))
    ) : (
        <p className="activity-empty">
            No recent activities to show
        </p>
    )}
</div>
</div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
