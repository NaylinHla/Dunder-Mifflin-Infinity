// CheckoutPage.tsx
import { useAtom } from 'jotai';
import { BasketAtom, TotalAmountAtom } from '../../atoms/BasketAtoms.ts'; // Corrected path
import {clearCustomerData, CustomerAtoms, setCustomerData, useCustomerData} from '../../atoms/CustomerAtoms.ts'; // Corrected path
import { authAtom, clearAuthData, loginFormAtom } from "../../atoms/LoginAtoms.ts"; // Import the auth atom
import { ShippingAtom, SelectedShippingOptionAtom } from '../../atoms/ShippingAtom.ts'; // Import shipping atoms
import { useState, useEffect } from 'react';
import OrderPlacementComponent from "../../components/Orders/PlaceOrder.tsx";
import React from 'react';
import {useLogin} from "../../components/hooks/LoginUser.ts";
import {toast} from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
    const [customer, setCustomer] = useAtom(CustomerAtoms);
    const [basket] = useAtom(BasketAtom);
    const [totalAmountBasket] = useAtom(TotalAmountAtom);
    const [authState, setAuthState] = useAtom(authAtom); // Subscribe to auth state
    const [, setLoginForm] = useAtom(loginFormAtom); // Get loginFormAtom state
    const [shippingOptions] = useAtom(ShippingAtom); // Use shipping options atom
    const [selectedShippingOption, setSelectedShippingOption] = useAtom(SelectedShippingOptionAtom); // Use selected shipping option atom
    const { loginUser } = useLogin(); // Use the custom login hook
    const { updateCustomerData } = useCustomerData();
    const navigate = useNavigate(); // Create navigate instance

    const initialTouchedFields = {
        email: false,
        password: false,
        name: false,
        address: false,
        phone: false,
        cardNumber: false,
        expirationDate: false,
        cvv: false,
    };

    const [touchedFields, setTouchedFields] = useState(initialTouchedFields);;

    const initialErrorState = {
        email: '',
        password: '',
        name: '',
        address: '',
        phoneNumber: '',
        cardNumber: '',
        expirationDate: '',
        cvv: '',
    };

    // Local state for payment details
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        expirationDate: '',
        cvv: '',
    });

    const [fakePassword, setFakePassword] = useState({
        password: '',
    });

    const [orderConfirm, setOrderConfirm] = useState({
        orderId: 0,
        deliveryDate: '',
        totalAmount: 0.0,
    });

    const [currentStep, setCurrentStep] = useState(1);

    // Validation states
    const [errors, setErrors] = useState(initialErrorState);

    // Automatically set current step to 2 if customer data exists
    useEffect(() => {

        if (authState.isLoggedIn) { // Check if user is logged in
            setCurrentStep(2);
        } else {
            setCurrentStep(1); // Reset to Step 1 if not logged in
        }
    }, [authState.isLoggedIn]); // Dependency array to run effect when login state changes

    // Validate when touched fields change
    useEffect(() => {
        validateAllFields(touchedFields); // Pass touchedFields to validation
    }, [touchedFields, customer, paymentDetails]);

    if (basket.length == 0 && currentStep !== 5) { //Handle case where user go basket using change browser url
        navigate(`/shop`);
    }

    // Validate all steps
    const validateAllFields = (touchedFields: { [key: string]: boolean }) => {
        const newErrors = { ...errors };

        // Step 1 validation
        if (currentStep === 1) {
            if (touchedFields.email && !customer.email) {
                newErrors.email = 'Email is required';
            } else {
                newErrors.email = '';
            }
            if (!authState.isLoggedIn)   {
                if (touchedFields.password && !fakePassword.password) {
                    newErrors.password = 'Password is required';
                } else {
                    newErrors.password = '';
                }
            } else {
                newErrors.password = '';
            }
        }

        // Step 2 validation
        if (currentStep === 2) {
            if (touchedFields.name && !customer.name) {
                newErrors.name = 'Name is required';
            } else {
                newErrors.name = '';
            }
            if (touchedFields.address && !customer.address) {
                newErrors.address = 'Address is required';
            } else {
                newErrors.address = '';
            }
            if (touchedFields.phone && !customer.phone) {
                newErrors.phoneNumber = 'Phone number is required';
            } else {
                newErrors.phoneNumber = '';
            }
        }

        // Step 3 validation
        if (currentStep === 3) {
            if (touchedFields.cardNumber && !paymentDetails.cardNumber) {
                newErrors.cardNumber = 'Card number is required';
            } else {
                newErrors.cardNumber = '';
            }
            if (touchedFields.expirationDate && !paymentDetails.expirationDate) {
                newErrors.expirationDate = 'Expiration date is required';
            } else {
                newErrors.expirationDate = '';
            }
            if (touchedFields.cvv && !paymentDetails.cvv) {
                newErrors.cvv = 'CVV is required';
            } else {
                newErrors.cvv = '';
            }
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };


    const handleNextStep = () => {
        // Prepare new touched fields
        const newTouchedFields = { ...touchedFields }; // Start with the previous state

        if (authState.isLoggedIn && currentStep === 1)   {
            setCurrentStep(currentStep + 1); // Handle special case
        }

        // Mark all fields as touched for the current step
        if (currentStep === 1) {
            newTouchedFields.email = true;
            newTouchedFields.password = true;
            // Validate fields before trying to log in
            if (validateAllFields(newTouchedFields)) {
                if (!authState.isLoggedIn)   {
                    loginUser(customer.email).then();
                }
            }
        } else if (currentStep === 2) {
            newTouchedFields.name = true;
            newTouchedFields.address = true;
            newTouchedFields.phone = true;
        } else if (currentStep === 3) {
            newTouchedFields.cardNumber = true;
            newTouchedFields.expirationDate = true;
            newTouchedFields.cvv = true;
        }
        setTouchedFields(newTouchedFields);
        if (validateAllFields(newTouchedFields)) {
            if (currentStep === 2) {
                updateCustomerData(customer);
            }
            setCurrentStep(currentStep + 1); // Move to the next step if valid
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleLogout = () =>  {
        if (authState.isLoggedIn)  {
            clearAuthData(); // Clear authentication data from localStorage
            clearCustomerData(setCustomerData); // -||-
            setAuthState({ email: '', isLoggedIn: false }); // Set user as logged out
            setLoginForm({ email: '', password: '' }); // Reset login form state
            setErrors(initialErrorState); // Clear all error messages
            setTouchedFields(initialTouchedFields);
            toast.success("You have logged out successfully.");
        } else {
            toast.error("You are not logged in.", { duration: 2000 }); // Show error message if already logged out
        }
    }

    const handleOrderSuccess = (orderId: string, deliveryDate: string, totalAmount: number) => {
        setOrderConfirm({ orderId: parseInt(orderId), deliveryDate, totalAmount  }); // Store orderId and deliveryDate
        setCurrentStep(5); // Move to step 5 on success
    };

    return (
        <div className="container mx-auto p-4 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Checkout</h1>

            {/* Step Indicator */}
            <div className="flex flex-wrap mb-1 justify-center items-center">
                {[
                    { step: 1, label: 'Login' },
                    { step: 2, label: 'Shipping' },
                    { step: 3, label: 'Payment' },
                    { step: 4, label: 'Confirmation' },
                    { step: 5, label: 'Receipt' }
                ].map(({ step, label }, index) => (
                    <React.Fragment key={step}>
                        <div className={`sm:flex-1 text-center ${currentStep === step ? 'font-bold text-logo-color' : 'text-gray-700'}`}>
                            <span className="block text-xs md:text-sm">{label}</span>
                        </div>
                        {/* Render the custom arrow if it's not the last step */}
                        {index < 4 && (
                            <span className="text-gray-500 text-[20px] md:text-[50px] -translate-y-0.5 md:-translate-y-1 mx-2">&gt;</span>
                        )}
                        {/* Add line break after the third step only on small screens */}
                        {index === 2 && (
                            <span className=" w-full items-center justify-center block sm:hidden" />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Step 1: Log In */}
            {currentStep === 1 && (
                <div className="bg-base-100 p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Log In</h2>
                    <form className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={customer.email}
                                onChange={(e) => {
                                    const email = e.target.value;
                                    setCustomer({ ...customer, email });
                                    setTouchedFields((prev) => ({ ...prev, email: true }));
                                }}
                                placeholder="john.doe@example.com"
                                disabled={authState.isLoggedIn}
                                className={`input input-bordered w-full ${errors.email ? 'border-red-500' : ''}`}
                            />
                            <div className="h-2">
                                {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                            </div>
                        </div>
                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                placeholder="••••••"
                                className={`input input-bordered w-full ${errors.password ? 'border-red-500' : ''}`}
                                onChange={(e) => {
                                    const password = e.target.value;
                                    setFakePassword({ ...fakePassword, password });
                                    setTouchedFields((prev) => ({ ...prev, password: true }));
                                }}
                                disabled={authState.isLoggedIn}
                            />
                            <div className="h-2">
                                {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                            </div>
                        </div>
                    </form>
                    <div className="flex justify-between mt-4">
                        <button className="btn" onClick={handleLogout}>
                            Logout
                        </button>
                        <button className="btn btn-primary mt-4" onClick={handleNextStep}>
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Address and Shipping Options */}
            {currentStep === 2 && (
                <div className="bg-base-100 p-6 rounded-lg shadow-md mb-6">
                    {/* Container for Address and Shipping Options */}
                    <div className="flex flex-col sm:flex-row bg-base-100 rounded-lg shadow-md mb-4 p-4">
                        {/* Address Section */}
                        <div className="flex-1 pr-0 sm:pr-4 mb-4 sm:mb-0">
                            <h2 className="text-2xl font-semibold mb-4">Address</h2>
                            <form className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="label">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={customer.name}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            setCustomer({ ...customer, name });
                                            setTouchedFields((prev) => ({ ...prev, name: true }));
                                        }}
                                        placeholder="John Doe"
                                        className={`input input-bordered w-full ${errors.name ? 'border-red-500' : ''}`}
                                    />
                                    <div className="h-2">
                                        {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                                    </div>
                                </div>
                                <div>
                                    <label className="label">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={customer.address}
                                        onChange={(e) => {
                                            const address = e.target.value;
                                            setCustomer({ ...customer, address });
                                            setTouchedFields((prev) => ({ ...prev, address: true }));
                                        }}
                                        placeholder="123 Main St"
                                        className={`input input-bordered w-full ${errors.address ? 'border-red-500' : ''}`}
                                    />
                                    <div className="h-2">
                                        {errors.address && <div className="text-red-500 text-sm">{errors.address}</div>}
                                    </div>
                                </div>
                                <div>
                                    <label className="label">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={customer.phone}
                                        onChange={(e) => {
                                            const phone = e.target.value;
                                            setCustomer({ ...customer, phone });
                                            setTouchedFields((prev) => ({ ...prev, phone: true }));
                                        }}
                                        placeholder="(555) 123-4567"
                                        className={`input input-bordered w-full ${errors.phoneNumber ? 'border-red-500' : ''}`}
                                    />
                                    <div className="h-2">
                                        {errors.phoneNumber && <div className="text-red-500 text-sm">{errors.phoneNumber}</div>}
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="flex-1 pl-0 sm:pl-4">
                            <h2 className="text-2xl font-semibold mb-4">Shipping Options</h2>
                            <form className="grid grid-cols-1 gap-4">
                                {shippingOptions.map(option => (
                                    <div key={option.id} className="flex flex-col sm:flex-row items-start sm:items-center p-2 sm:p-0 rounded-lg shadow-sm mb-2">
                                        <input
                                            type="radio"
                                            id={option.id}
                                            name="shipping"
                                            checked={selectedShippingOption.id === option.id}
                                            onChange={() => setSelectedShippingOption(option)}
                                            className="mr-2 mb-2 radio radio-primary checked:bg-logo-color checked:border-logo-color border-gray-700"
                                        />
                                        <label htmlFor={option.id} className="flex-1">
                                            <span className="font-semibold ">{option.name}</span><br/>
                                            Price:
                                            ${totalAmountBasket >= option.freeShippingRequirement ? '0.00' : option.price.toFixed(2)}<br/>
                                            Estimated Delivery: {option.deliveryTime}<br/>
                                            {totalAmountBasket >= option.freeShippingRequirement ? (
                                                <span className="text-green-600">
                                                Free shipping on orders over ${option.freeShippingRequirement}.
                                                </span>
                                            ) : (
                                                <span className="text-red-600">
                                                Spend ${option.freeShippingRequirement - totalAmountBasket} more for free shipping.
                                                </span>
                                            )}
                                        </label>
                                    </div>
                                ))}
                            </form>
                        </div>
                    </div>

                    {/* Buttons for Navigation */}
                    <div className="flex justify-between mt-4">
                        <button className="btn" onClick={handlePrevStep}>
                            Previous
                        </button>
                        <button className="btn btn-primary" onClick={handleNextStep}>
                            Next
                        </button>
                    </div>
                </div>
            )}


            {/* Step 3: Payment */}
            {currentStep === 3 && (
                <div className="bg-base-100 p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Payment Details</h2>
                    <form className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="label">Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={paymentDetails.cardNumber}
                                onChange={(e) => {
                                    const cardNumber = e.target.value;
                                    setPaymentDetails({ ...paymentDetails, cardNumber });
                                    setTouchedFields((prev) => ({ ...prev, cardNumber: true }));
                                }}
                                placeholder="1234 5678 9012 3456"
                                className={`input input-bordered w-full ${errors.cardNumber ? 'border-red-500' : ''}`}
                            />
                            <div className="h-2">
                                {errors.cardNumber && <div className="text-red-500 text-sm">{errors.cardNumber}</div>}
                            </div>
                        </div>
                        <div>
                            <label className="label">Expiration Date</label>
                            <input
                                type="text"
                                name="expirationDate"
                                value={paymentDetails.expirationDate}
                                onChange={(e) => {
                                    const expirationDate = e.target.value;
                                    setPaymentDetails({ ...paymentDetails, expirationDate });
                                    setTouchedFields((prev) => ({ ...prev, expirationDate: true }));
                                }}
                                placeholder="MM/YY"
                                className={`input input-bordered w-full ${errors.expirationDate ? 'border-red-500' : ''}`}
                            />
                            <div className="h-2">
                                {errors.expirationDate && <div className="text-red-500 text-sm">{errors.expirationDate}</div>}
                            </div>
                        </div>
                        <div>
                            <label className="label">CVV</label>
                            <input
                                type="text"
                                name="cvv"
                                value={paymentDetails.cvv}
                                onChange={(e) => {
                                    const cvv = e.target.value;
                                    setPaymentDetails({ ...paymentDetails, cvv });
                                    setTouchedFields((prev) => ({ ...prev, cvv: true }));
                                }}
                                placeholder="123"
                                className={`input input-bordered w-full ${errors.cvv ? 'border-red-500' : ''}`}
                            />
                            <div className="h-2">
                                {errors.cvv && <div className="text-red-500 text-sm">{errors.cvv}</div>}
                            </div>
                        </div>
                    </form>
                    <div className="flex justify-between mt-4">
                        <button className="btn" onClick={handlePrevStep}>
                            Previous
                        </button>
                        <button className="btn btn-primary mt-4" onClick={handleNextStep}>
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
                <div className="bg-base-100 p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Confirm Your Order</h2>

                    {/* Customer Information */}
                    <h3 className="text-lg mb-2 font-bold">Your Information</h3>
                    <p>Name: {customer.name}</p>
                    <p>Email: {customer.email}</p>
                    <p>Address: {customer.address}</p>
                    <p>Phone: {customer.phone}</p>

                    {/* Delivery Method */}
                    <h3 className="text-lg mt-4 mb-2 font-bold">Delivery Method</h3>
                    <p>
                        {selectedShippingOption.name} - ${selectedShippingOption.price.toFixed(2)}
                    </p>

                    {/* OrderControl Summary */}
                    <h3 className="text-lg mt-4 mb-2 font-bold">Order Summary</h3>
                    <ul className="space-y-2">
                        {basket.map((item) => (
                            <li key={item.product_id} className="flex justify-between">
                    <span className="flex items-center w-4/5 overflow-hidden">
                        <span className="truncate ">
                            {item.quantity} - {item.name}
                        </span>
                        <span className="truncate text-xs text-gray-500 ml-1">
                            ({item.selectedProperty || 'White'})
                        </span>
                    </span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Calculate Total Price */}
                    {/* Sum the prices of the basket items */}
                    <p className="mt-4 font-bold">
                        Subtotal: $
                        {totalAmountBasket.toFixed(2)}
                    </p>

                    {/* Add Shipping Cost */}
                    <p className="mt-2">
                        Shipping Cost: $
                        {totalAmountBasket >= selectedShippingOption.freeShippingRequirement
                            ? '0.00' // Free shipping
                            : selectedShippingOption.price.toFixed(2)}
                    </p>

                    {/* Total Price Calculation */}
                    <p className="mt-4 font-bold">
                        Total Price: $
                        {(totalAmountBasket + (totalAmountBasket >= selectedShippingOption.freeShippingRequirement ? 0 : selectedShippingOption.price)).toFixed(2)}
                    </p>

                    <div className="flex justify-between mt-4">
                        <button className="btn" onClick={handlePrevStep}>
                            Previous
                        </button>
                        <OrderPlacementComponent
                            onOrderPlaced={handleOrderSuccess}
                        />
                    </div>
                </div>
            )}

            {/* Step 5: Complete */}
            {currentStep === 5 && (
                <div className="bg-base-100 p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Thank You!</h2>
                    <p>Your order has been placed successfully.</p>
                    <p>A confirmation email has been sent to {customer.email}.</p>

                    {/* OrderControl Confirmation Details */}
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Order Confirmation</h3>
                        <p className="mt-2">Total Price: ${orderConfirm.totalAmount.toFixed(2)}</p>
                        <p className="mt-2">Delivery Date: {new Date(orderConfirm.deliveryDate).toLocaleDateString()}</p>
                        <p className="mt-2">Order ID: {orderConfirm.orderId}</p>
                    </div>

                    <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>
                        Back to Home
                    </button>
                </div>
            )}

        </div>
    );
};

export default CheckoutPage;
