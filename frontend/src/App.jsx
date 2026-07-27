import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./layouts/Dashboardlayout";
import Dashboard from "./pages/Dashboard";

import Business from "./pages/Business";
import AddBusinessCard from "./pages/AddBusinessCard";
import EditBusinessCard from "./pages/EditBusinessCard";
import ViewBusinessCard from "./pages/ViewBusinessCard";
import PublicBusinessCard from "./pages/PublicBusinessCard";
import Services from "./pages/Services";
import AddService from "./pages/AddService";
import EditService from "./pages/EditService";

import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";

import Appointments from "./pages/Appointments";
import AddAppointment from "./pages/AddAppointment";
import EditAppointment from "./pages/EditAppointment";

import SocialLinks from "./pages/SocialLinks";
import AddSocialLink from "./pages/AddSocialLink";
import EditSocialLink from "./pages/EditSocialLink";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    theme="light"
                />

                <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    {/* Public Business Card Page - NO SIDEBAR */}
    <Route path="/business/view/:id" element={<ViewBusinessCard />} />

    <Route path="/card/:id" element={<PublicBusinessCard />} />


    {/* Dashboard Routes - WITH SIDEBAR */}
    <Route path="/dashboard" element={<DashboardLayout />}>

        <Route index element={<Dashboard />} />

        <Route path="business" element={<Business />} />
        <Route path="business/add" element={<AddBusinessCard />} />
        <Route path="business/:id/edit" element={<EditBusinessCard />} />

        <Route path="services" element={<Services />} />
        <Route path="services/add" element={<AddService />} />
        <Route path="services/:id/edit" element={<EditService />} />

        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/:id/edit" element={<EditProduct />} />

        <Route path="social-links" element={<SocialLinks />} />
        <Route path="social-links/add" element={<AddSocialLink />} />
        <Route path="social-links/:id/edit" element={<EditSocialLink />} />

        <Route path="appointments" element={<Appointments />} />
        <Route path="appointments/add" element={<AddAppointment />} />
        <Route path="appointments/:id/edit" element={<EditAppointment />} />

    </Route>

</Routes>

            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;