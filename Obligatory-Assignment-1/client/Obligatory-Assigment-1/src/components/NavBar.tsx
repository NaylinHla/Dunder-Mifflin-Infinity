import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import logo from '../assets/LogoDMI.png';
import AccountIcon from '../assets/icons/AccountIcon';
import BasketIcon from '../assets/icons/BasketIcon';
import BurgerMenuIcon from '../assets/icons/BurgerMenuIcon';
import { searchAtom } from "../atoms/atoms.ts";
import {loginFormAtom, authAtom, clearAuthData, checkAdminStatus} from '../atoms/LoginAtoms.ts'; // Importing the atoms
import {clearCustomerData, setCustomerData} from '../atoms/CustomerAtoms.ts'; // Importing the atoms
import { LoginModal } from './Modals/LoginModal.tsx';
import { toast} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Define prop types for NavLinks
interface NavLinksProps {
    toggleDropdown: (name: string) => void;
    activeDropdown: string | null; // Track the currently active dropdown
    toggleMenu: () => void
}

// Navigation Links Component
const NavLinks: React.FC<NavLinksProps> = ({toggleMenu}) => {
    return (
        <>
            <Link to={"/shop"} className="btn btn-ghost" onClick={() => {
                toggleMenu();
            }}>Shop</Link>
            <Link to={"/about"} className="btn btn-ghost" onClick={() => {
                toggleMenu();
            }}>About Us</Link>
            <Link to={"/customer-service/contact-us"} className="btn btn-ghost" onClick={() => {
                toggleMenu();
            }}>Contact</Link>
        </>
    );
};

// Define props for AccountDropdown
interface AccountDropdownProps {
    isOpen: boolean;
    toggle: () => void;
    userLoggedIn: boolean; // Check if the user is logged in
    handleLogin: () => void; // Function to handle login
    handleLogout: () => void; // Function to handle logout
    handleClick: () => void; // Function to handle click
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ isOpen, toggle, userLoggedIn, handleLogin, handleLogout, handleClick }) => {
    const [authState] = useAtom(authAtom);
    const isAdminUser = checkAdminStatus(authState); // Check if the logged-in user is an admin

    return (
        <div className="relative">
            <button onClick={toggle} className="btn btn-ghost">
                <AccountIcon className="w-6 h-6 text-icon-color" />
            </button>
            {isOpen && (
                <ul className={`absolute left-0 top-full mt-3 p-2 shadow bg-base-100 rounded-box w-max z-10`}>
                    {userLoggedIn ? (
                        <>
                            {isAdminUser ? (
                                <>
                                    {/* Admin-specific menu items */}
                                    <li className="hover:bg-gray-200">
                                        <Link to={"/admin/allOrders"} onClick={() => { handleClick(); }}>
                                            All Orders
                                        </Link>
                                    </li>
                                    <li className="hover:bg-gray-200">
                                        <Link to={"/admin"} onClick={() => { handleClick(); }}>
                                            Admin Panel
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    {/* Non-admin user-specific menu items */}
                                    <li className="hover:bg-gray-200">
                                        <Link to={"/profile"} onClick={() => { handleClick(); }}>
                                            My Profile
                                        </Link>
                                    </li>
                                    <li className="hover:bg-gray-200">
                                        <Link to={"/myOrders"} onClick={() => { handleClick(); }}>
                                            My Orders
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li className="hover:bg-gray-200">
                                <button
                                    onClick={() => { handleLogout(); handleClick(); }}
                                    className="w-full text-left"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <li className="hover:bg-gray-200">
                            <button
                                onClick={() => { handleLogin(); handleClick(); }}
                                className="w-full text-left"
                            >
                                Login
                            </button>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

// NavBar Component
const NavBar: React.FC = () => {
    const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState<boolean>(false); // Track burger menu open state
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // Track active dropdown
    const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false); // Track login modal state
    const [searchValue, setSearchValue] = useAtom(searchAtom);
    const [authState, setAuthState] = useAtom(authAtom); // Get authAtom state
    const [, setLoginForm] = useAtom(loginFormAtom); // Get loginFormAtom state
    const navigate = useNavigate(); // Create navigate instance
    const location = useLocation(); // Get current location

    const handleLogin = () => {
        setLoginModalOpen(true); // Show login modal
    };

    const handleCloseModal = () => {
        setLoginModalOpen(false); // Close login modal
    };

    const handleLogout = () => {
        clearAuthData(); // Clear authentication data from localStorage
        clearCustomerData(setCustomerData); // -||-
        setAuthState({ email: '', isLoggedIn: false }); // Set user as logged out
        setLoginForm({ email: '', password: '' }); // Reset login form state
        toast.success("You have logged out successfully!", {duration: 3000,});
        navigate('/'); // Navigate to home page
    };

    const toggleMenu = () => {
        setIsBurgerMenuOpen(!isBurgerMenuOpen);
    };

    const toggleDropdown = (name: string) => {
        setActiveDropdown((prev) => (prev === name ? null : name)); // Toggle dropdown
    };

    const closeProfileDropdownMenu = () => {
        setActiveDropdown(null);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const burgerMenu = document.querySelector('.burger-menu'); // Change this selector to match your burger menu element
            if (
                target &&
                !target.closest('.dropdown') &&
                !burgerMenu?.contains(target) // Close menu if clicked outside burger menu
            ) {
                setActiveDropdown(null); // Close dropdowns if clicked outside
                setIsBurgerMenuOpen(false); // Close burger menu if clicked outside
            }
        };

        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Function to handle navigation to shop
    const navigateToShop = () => {
        const currentPath = location.pathname; // Get current path

        if (currentPath.startsWith('/shop') || currentPath.startsWith('/myOrders') || currentPath.startsWith('/admin/allOrders')) {
            return;
        }

        // If not on excluded paths, navigate to shop
        navigate('/shop');
    };

    return (
        <nav className="navbar h-20 bg-base-100 shadow-lg fixed top-0 w-full z-50">
            <div className="container mx-auto flex justify-between items-center px-4">
                <div className="mr-4"> {/* Margin for spacing */}
                    <Link to="/" className="flex items-center">
                        <img src={logo} alt="Logo" className="h-10 min-w-10"/>
                    </Link>
                </div>

                {/* Mobile Menu */}
                {isBurgerMenuOpen && (
                    <div
                        className="md:hidden bg-base-100 p-4 transition-all duration-300 ease-in-out absolute top-16 left-0">
                        <div className="flex flex-col space-y-2">
                            <NavLinks
                                toggleMenu={toggleMenu}
                                toggleDropdown={toggleDropdown}
                                activeDropdown={activeDropdown}
                            />
                        </div>
                    </div>
                )}

                {/* Desktop Menu */}
                <div className="hidden md:flex justify-start space-x-4 items-center">
                    <NavLinks
                        toggleMenu={toggleMenu}
                        toggleDropdown={toggleDropdown}
                        activeDropdown={activeDropdown}
                    />
                </div>

                {/* Search Field (Always Visible) */}
                <div className="flex-grow sm:mx-4 mr-4">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input input-bordered w-full"
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value); // Update search value
                            navigateToShop(); // Check navigation conditions
                        }}
                    />
                </div>

                {/* Navigation Icons (Always Visible) */}
                <div className="flex items-center sm:space-x-4 sm:m-0 space-x-1 -m-5">
                    {/* Toggle Button for Mobile View */}
                    <button
                        onClick={toggleMenu}
                        className="block md:hidden btn btn-ghost"
                        aria-label="Toggle Menu"
                    >
                        <BurgerMenuIcon className="burger-menu w-6 h-6"/>
                    </button>

                    {/* Account Menu */}
                    <div className="dropdown">
                        <AccountDropdown
                            isOpen={activeDropdown === 'account'}
                            toggle={() => toggleDropdown('account')}
                            userLoggedIn={authState.isLoggedIn} // Check from authAtom
                            handleLogin={handleLogin} // Pass the login function
                            handleLogout={handleLogout} // Pass the logout function
                            handleClick={closeProfileDropdownMenu} // Pas the close function
                        />
                    </div>

                    {/* Basket Menu */}
                    <Link to={"/basket"} className="btn btn-ghost">
                        <BasketIcon className="w-6 h-6 text-icon-color"/>
                    </Link>
                </div>
            </div>

            {isLoginModalOpen && (
                <LoginModal
                    onConfirm={() => {
                        handleCloseModal(); // Close modal
                    }}
                    onCancel={handleCloseModal} // Close modal on cancel
                />
            )}

        </nav>
    );
};

export default NavBar;
