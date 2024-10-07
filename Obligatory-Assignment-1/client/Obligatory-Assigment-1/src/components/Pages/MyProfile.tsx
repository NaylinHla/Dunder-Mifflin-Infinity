﻿import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { CustomerAtoms, useCustomerData } from "../../atoms/CustomerAtoms.ts";
import { Api } from "../../../Api.ts";
import { toast } from "react-hot-toast";

export const MyApi = new Api();

// Define the structure of the profile form state
interface ProfileFormErrors {
    name?: string;
    email?: string;
    address?: string;
    phone?: string;
}

// Initial customer state
const initialCustomerState = {
    id: 0,
    address: '',
    email: '',
    name: '',
    phone: '',
};

function MyProfile() {
    const [toggleEditableProfile, setEditableProfile] = useState(false);
    const [customer, setCustomer] = useAtom(CustomerAtoms);
    const [touchedFields, setTouchedFields] = useState({
        name: false,
        email: false,
        address: false,
        phone: false,
    });
    const [state, setState] = useState(initialCustomerState);
    const [errors, setErrors] = useState<ProfileFormErrors>({});
    const { updateCustomerData } = useCustomerData(); // Access the custom hook

    // Initialize the state when customer atom changes
    useEffect(() => {
        if (customer) {
            setState(customer);
        }
    }, [customer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedForm = { ...state, [name]: value };
        setState(updatedForm);
        setTouchedFields((prev) => ({ ...prev, [name]: true })); // Mark the field as touched
        // Validate the form after each input change
        validateForm(updatedForm, { ...touchedFields, [name]: true });
    };

    const validateForm = (form: typeof initialCustomerState, touchedFields: { name: boolean; email: boolean; address: boolean; phone: boolean }) => {
        const newErrors: ProfileFormErrors = {};
        // Validate fields based on whether they have been touched
        if (touchedFields.name && !form.name) {
            newErrors.name = "Name is required.";
        }
        if (touchedFields.email) {
            if (!form.email) {
                newErrors.email = "Email is required.";
            } else {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(form.email)) {
                    newErrors.email = "Email is not valid.";
                }
            }
        }
        if (touchedFields.address && !form.address) {
            newErrors.address = "Address is required.";
        }
        if (touchedFields.phone) {
            if (!form.phone) {
                newErrors.phone = "Phone number is required.";
            } else if (!/^\d{3}-\d{3}-\d{4}$/.test(form.phone) && !/^\d{8}$/.test(form.phone)) {
                newErrors.phone = "Phone number must be in the format xxx-xxx-xxxx or 8 digits.";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveProfileChanges = async () => {
        // Validate the form before saving
        if (!validateForm(state, touchedFields)) return; // Stop if validation fails

        try {
            await MyApi.api.customerUpdateCustomer(customer.id, state);

            // Update the customer atom with the new data
            setCustomer(state);
            updateCustomerData(state);

            // Show success notification
            toast.success("Profile changes saved successfully!");
        } catch (error) {
            toast.error("Error saving profile changes. Please try again.");
        }
        setEditableProfile(false);
    };

    const cancelProfileChanges = () => {
        setState(customer); // Reset to customer state
        setEditableProfile(false);
    };

    const fieldProps = [
        { label: "Profile Name", name: "name", error: errors.name },
        { label: "Email", name: "email", error: errors.email },
        { label: "Address", name: "address", error: errors.address },
        { label: "Phone Number", name: "phone", error: errors.phone },
    ];

    return (
        <div className="p-5">
            {fieldProps.map(({ label, name, error }) => (
                <div key={name} className="mt-5">
                    <div className="flex mb-1">
                        <p>{label}</p>
                    </div>
                    <input
                        className={`text-200 input ${error ? "border-red-500" : ""} w-full sm:w-1/3`} // Make input full width
                        type="text"
                        name={name}
                        value={state[name as keyof typeof initialCustomerState]} // Ensure proper typing
                        readOnly={!toggleEditableProfile}
                        onChange={handleChange}
                    />
                    {/* Use a wrapper div to reserve space for error messages */}
                    <div className="h-5">
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                    </div>
                </div>
            ))}

            <div className="flex mt-5">
                {!toggleEditableProfile ? (
                    <button
                        onClick={() => setEditableProfile(true)}
                        className="btn btn-primary"
                    >
                        Change Info
                    </button>
                ) : (
                    <div className="space-x-4">
                        <button
                            onClick={saveProfileChanges}
                            className="btn btn-primary"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={cancelProfileChanges}
                            className="btn btn-ghost bg-gray-200"
                        >
                            Cancel Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyProfile;