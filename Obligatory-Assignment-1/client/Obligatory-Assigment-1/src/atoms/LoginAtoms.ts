import { atom } from 'jotai';
import {clearCustomerData, setCustomerData} from "./CustomerAtoms.ts";

// Define types for the authentication state
interface AuthState {
    email: string;
    isLoggedIn: boolean;
}

// Admin accounts list
const adminEmails: string[] = [
    'David.Wallace@Dunder.com',
    'admin@Dunder.com',
];

// Atom to manage login form state
export const loginFormAtom = atom({
    email: '',
    password: '',
});

// Initial auth state
const initialAuthState: AuthState = {
    email: '',
    isLoggedIn: false,
};

// Set authentication data in localStorage and return updated state
export const setAuthData = (data: AuthState) => {
    const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour in milliseconds
    localStorage.setItem('authData', JSON.stringify({ ...data, expirationTime }));
    startExpirationCheck(); // Start the expiration check
    return data; // Return the updated state to tell relevant site there is now logged out
};

// Function to start checking the expiration periodically
const startExpirationCheck = () => {
    const checkInterval = setInterval(() => {
        const storedAuthData = localStorage.getItem('authData');
        if (storedAuthData) {
            const { expirationTime } = JSON.parse(storedAuthData);
            // Check if the current time is greater than the expiration time
            if (new Date().getTime() > expirationTime) {
                clearInterval(checkInterval); // Stop checking if already expired
                clearAuthData(); // Log out the user
                console.log("Session expired, user logged out."); // You might want to handle UI updates here
            }
        }
    }, 60000); // Check every minute (60,000 ms)
};

// Function to get authentication data from localStorage
const getAuthData = (): AuthState | null => {
    const storedAuthData = localStorage.getItem('authData');
    if (storedAuthData) {
        const { email, isLoggedIn, expirationTime } = JSON.parse(storedAuthData);
        if (new Date().getTime() < expirationTime) {
            return { email, isLoggedIn };
        } else {
            clearAuthData(); // Logout the user immediately if expired
        }
    }
    return null;
};

// Function to clear authentication data and token
export const clearAuthData = () => {
    localStorage.removeItem('authData'); // Clear authentication data
    localStorage.removeItem('token'); // Clear token
    clearCustomerData(setCustomerData);
    return initialAuthState; // Return initial state
};

// Function to check if the user is an admin (either starts with "admin" or is in adminEmails list)
export const isAdmin = (email: string): boolean => {
    const emailStartsWithAdmin = email.toLowerCase().startsWith('admin'); //Not safe way
    const emailIsInAdminList = adminEmails.includes(email);

    return emailStartsWithAdmin || emailIsInAdminList;
};


// Example usage: Checking if logged-in user is an admin
export const checkAdminStatus = (authState: AuthState): boolean => {
    return authState.isLoggedIn && isAdmin(authState.email);
};


// Initialize authAtom with stored data if available
const storedAuthData = getAuthData();
export const authAtom = atom<AuthState>(storedAuthData || initialAuthState);
