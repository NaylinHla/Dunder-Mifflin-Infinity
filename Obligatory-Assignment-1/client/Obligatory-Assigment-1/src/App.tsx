import './App.css';
import Home from './pages/Home/Home.tsx';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import NotFound from "./pages/Errors/NotFound.tsx";
import NewOrderTest from "./pages/NewOrderTest.tsx";
import NavBar from "./components/NavBar.tsx";
import { Toaster } from "react-hot-toast";
import Footer from "./components/PageHelpers/Footer.tsx";
import About from "./pages/About/About.tsx";
import Contact from "./pages/CustomService/Contact.tsx";
import CustomService from './pages/CustomService/CustomService.tsx';
import SalesAndDeliveryConditions from "./pages/CustomService/SalesAndDeliveryConditions.tsx";
import GDPRDataProtectionPolicy from "./pages/CustomService/GDPRDataProtectionPolicy.tsx";
import CookiePolicy from "./pages/CustomService/CookiePolicy.tsx";
import WhistleBlowingPolicy from "./pages/CustomService/WhistleBlowingPolicy.tsx";
import FAQ from "./pages/CustomService/FAQ.tsx";
import MyOrders from "./pages/Profile/MyOrders.tsx";
import AllOrders from "./pages/Admin/OrderControl/AllOrders.tsx";
import Admin from "./pages/Admin/Admin.tsx";
import Profile from "./pages/Profile/Profile.tsx";
import Checkout from "./pages/Profile/Checkout.tsx";
import ProtectedAdminRoute from "./components/ProtectedRoute.tsx"; // Import the ProtectedRoute component
import OrderDetails from "./components/Orders/OrderDetails.tsx";
import Shop from "./pages/Shop/Shop.tsx";
import Basket from "./pages/Shop/Basket.tsx";
import Rainbow from "./pages/CardPages/Rainbow/Rainbow.tsx";
import Chinese from "./pages/CardPages/Chinese/Chinese.tsx";
import Space from "./pages/CardPages/Space/Space.tsx";
import Productivity from "./pages/CardPages/Productivity/Productivity.tsx";
import { useSetAtom } from 'jotai';
import { searchAtom } from './atoms/atoms.ts';
import React from "react";

function App() {
    const setSearch = useSetAtom(searchAtom);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <BrowserRouter>
                <Toaster/>
                <NavBar/>
                <div className="flex-grow pt-20">

                    {/* Use useEffect and useLocation after BrowserRouter */}
                    <LocationListener setSearch={setSearch} />

                    <Routes>
                        {/* Protecting admin routes with a wildcard route */}
                        <Route path="/admin/*" element={
                            <ProtectedAdminRoute>
                                <Routes>
                                    <Route path="" element={<Admin />} />
                                    <Route path="allOrders" element={<AllOrders />} />
                                    <Route path="allOrders/:id" element={<OrderDetails  isAdmin={true}/>} />
                                    <Route path="/*" element={<NotFound/>}/>
                                </Routes>
                            </ProtectedAdminRoute>
                        } />
                        <Route path="/" element={<Home/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/basket" element={<Basket/>}/>
                        <Route path="/basket/checkout" element={<Checkout/>}/>
                        <Route path="/customer-service" element={<CustomService/>}/>
                        <Route path="/customer-service/contact-us" element={<Contact/>}/>
                        <Route path="/customer-service/faq" element={<FAQ/>}/>
                        <Route path="/customer-service/sales-and-delivery-conditions"
                               element={<SalesAndDeliveryConditions/>}/>
                        <Route path="/customer-service/gdpr-data-protection-policy"
                               element={<GDPRDataProtectionPolicy/>}/>
                        <Route path="/customer-service/cookie-policy" element={<CookiePolicy/>}/>
                        <Route path="/customer-service/whistleblowing-policy" element={<WhistleBlowingPolicy/>}/>
                        <Route path="/ipsum" element={<NewOrderTest/>}/>
                        <Route path="/myOrders" element={<MyOrders/>}/>
                        <Route path="myOrders/:id" element={<OrderDetails  isAdmin={false}/>} />
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="/shop" element={<Shop/>}/>
                        <Route path="/*" element={<NotFound/>}/>
                        <Route path="/rainbow" element={<Rainbow/>}/>
                        <Route path="/chinese" element={<Chinese/>}/>
                        <Route path="/space" element={<Space/>}/>
                        <Route path="/productivity" element={<Productivity/>}/>
                    </Routes>
                </div>
                <Footer/>
            </BrowserRouter>
        </div>
    );
}

// Helper component to handle location-based logic
function LocationListener({ setSearch }: { setSearch: (value: string) => void }) {
    const location = useLocation();

    React.useEffect(() => { // Only clear the search value if the user is not on the "/shop" page
        if (location.pathname !== '/shop') {
            setSearch('');
        }
    }, [location, setSearch]);

    return null; // This component does not render anything
}

export default App;
