import React, { useEffect, useState, useRef } from 'react';
import { useAtom } from 'jotai';
import {loginFormAtom, authAtom} from '../../atoms/LoginAtoms';
import {clearCustomerData, CustomerAtoms, setCustomerData} from '../../atoms/CustomerAtoms';
import EyeOnIcon from "../../assets/icons/EyeOnIcon.tsx";
import EyeOffIcon from '../../assets/icons/EyeOffIcon.tsx';
import FacebookLogo from '../../assets/icons/FacebookIcon.tsx';
import GoogleLogo from '../../assets/icons/GoogleIcon.tsx';
import logo from '../../assets/LogoDMI.png';
import useDataWithExpirationCheck from "../hooks/CheckDataWithExpirationCheck";
import {useLogin} from "../hooks/LoginUser.ts";


// Define the structure of the auth form state
interface AuthFormType {
    email: string;
    password: string;
}

interface AuthFormErrors {
    emailValidationError?: string;
    passwordValidationError?: string;
}

interface LoginFormProps {
    onConfirm: () => void;
    onCancel: () => void;
}

// Define the authentication and customer state interfaces
interface AuthState {
    email: string;
    isLoggedIn: boolean;
}

interface CustomerState {
    id: number;
    address: string;
    email: string;
    name: string;
    phone: string;
}

export function LoginModal({ onConfirm, onCancel }: LoginFormProps) {
    const [authForm, setAuthForm] = useAtom(loginFormAtom);
    const [, setCustomer] = useAtom(CustomerAtoms);
    const [, setAuth] = useAtom(authAtom); // To update the authAtom state
    const [authFormErrors, setAuthFormErrors] = useState<AuthFormErrors>({});
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility
    const [touchedFields, setTouchedFields] = useState({ email: false, password: false }); // Track touched fields
    const modalRef = useRef<HTMLDivElement>(null); // Ref for the modal
    const { loginUser } = useLogin(); // Use the custom login hook

    // Using the custom hook to get auth and customer data
    const storedAuthData = useDataWithExpirationCheck<AuthState>('authData');
    const storedCustomerData = useDataWithExpirationCheck<CustomerState>('customerData');

    useEffect(() => {
        // Clear form fields when the component mounts
        setAuthForm({ email: '', password: '' });
        clearCustomerData(setCustomerData); // Reset to default values

        // Load customer data from the custom hook if available
        if (storedCustomerData) {setCustomer(storedCustomerData);} // If data is valid, update the atom state
        if (storedAuthData) {setAuth(storedAuthData);} // -||-
    }, [setAuth, setAuthForm, setCustomer, storedAuthData, storedCustomerData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedAuthForm = { ...authForm, [name]: value } as AuthFormType;
        setAuthForm(updatedAuthForm);
        setTouchedFields((prev) => ({...prev, [name]: true,})); // Mark the field as touched
        validateForm(updatedAuthForm, {
            email: name === 'email' ? true : touchedFields.email,
            password: name === 'password' ? true : touchedFields.password,
        });
    };

    const validateForm = (authForm: AuthFormType, touchedFields: { email: boolean; password: boolean; }) => {
        const errors: AuthFormErrors = {};

        if (touchedFields.email && !authForm.email) {
            errors.emailValidationError = 'Email is required';
        } else if (authForm.email && authForm.email.length > 100) {
            errors.emailValidationError = "Email cannot be more than 100 characters.";
        }

        if (touchedFields.password) {
            if (!authForm.password) {
                errors.passwordValidationError = 'Password is required';
            } else if (authForm.password.length < 6) {
                errors.passwordValidationError = 'Password must be at least 6 characters';
            }
        }

        setAuthFormErrors(errors);
        return !errors.emailValidationError && !errors.passwordValidationError;
    };

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();

        // Prepare a local variable to hold the touched fields state
        const updatedTouchedFields = {
            email: true,
            password: true,
        };

        if (validateForm(authForm, updatedTouchedFields)) {
            // Call the login function from the custom hook
            const success = await loginUser(authForm.email);
            if (success) {
                onConfirm(); // Close the modal after successful login
            }
        }
    };

    // Mockup functions for social login buttons
    const handleGoogleLogin = () => {
        console.log('Login with Google');
        handleSubmit().then();
    }

    const handleFacebookLogin = () => {
        console.log('Login with Facebook');
        handleSubmit().then();
    };

    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    // Close modal if clicked outside the square
    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onCancel(); // Call onCancel to close the modal
        }
    };

    useEffect(() => { // Add event listener for clicks outside the modal
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="modal modal-open">
            {/* Overlay with reduced opacity */}
            <div className="fixed inset-0 bg-black opacity-50 z-10" />
            <div ref={modalRef} className="text-white modal-box rounded-lg bg-blue-500 z-20 relative">
                <img src={logo} alt="Our Logo" style={{ width: '50px', height: 'auto' }} />
                <h3 className="font-bold text-lg text-left">Login</h3>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <label htmlFor="email" className="block text-sm">Email:</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder="JohnDoe@example.com"
                            value={authForm.email}
                            onChange={handleInputChange}
                            className={`text-gray-400 input input-bordered w-full ${authFormErrors.emailValidationError ? 'border-red-500' : ''}`}
                        />
                        <div className="h-2 text-red-500 text-sm">
                            {authFormErrors.emailValidationError}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm">Password:</label>
                        <div className="relative">
                            <input
                                type={isPasswordVisible ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Password"
                                value={authForm.password}
                                onChange={handleInputChange}
                                className={`text-gray-400 input input-bordered w-full ${authFormErrors.passwordValidationError ? 'border-red-500' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center pr-2"
                            >
                                {isPasswordVisible ? <EyeOnIcon className="w-6 h-6 text-icon-color" /> :
                                    <EyeOffIcon className="w-6 h-6 text-icon-color" />}
                            </button>
                        </div>
                        <div className="h-2 text-red-500 text-sm">
                            {authFormErrors.passwordValidationError}
                        </div>
                        <div className="text-left mt-4">
                            <a href="" onClick={onCancel} className="text-xs">Forgot Password?</a>
                        </div>
                    </div>
                    <div className="modal-action">
                        <button type="submit" className="btn btn-primary  hover:bg-logo-color-hover hover:border-logo-color-hover border-logo-color bg-logo-color w-full">Sign in</button>
                    </div>
                </form>
                <div className="text-center mt-4">or continue with</div>
                <div className="flex justify-center space-x-2 mt-2">
                    <button onClick={handleGoogleLogin} className="btn text-gray-400 bg-white border-white hover:bg-gray-200 hover:border-gray-200">
                        <GoogleLogo className="w-4 h-4 mr-1" />
                        Google
                    </button>
                    <button onClick={handleFacebookLogin} className="btn text-gray-400 bg-white border-white hover:bg-gray-200 hover:border-gray-200">
                        <FacebookLogo className="w-6 h-6 mr-1" />
                        Facebook
                    </button>
                </div>
                <div className="text-center mt-2">
                    <span className="text-xs">Don’t have an account yet? </span>
                    <a href="" className="text-sm" onClick={onCancel}>Register for free</a>
                </div>
            </div>
        </div>
    );
}
