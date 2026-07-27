import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeContext";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

function DashboardLayout() {
    return (
        <ThemeProvider>
            <div className="dashboard-layout">
                <Sidebar />
                <div className="dashboard-main">
                    <Navbar />
                    <main className="dashboard-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default DashboardLayout;
