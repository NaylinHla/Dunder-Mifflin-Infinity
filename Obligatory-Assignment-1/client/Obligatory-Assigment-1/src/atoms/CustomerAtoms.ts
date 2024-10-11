import { atom, useAtom } from 'jotai';

// Define the type for customer state
export interface CustomerState {
    id: number;
    address: string;
    email: string;
    name: string;
    phone: string;
}

// Initial customer state
const initialCustomerState: CustomerState = {
    id: 0,
    address: '',
    email: '',
    name: '',
    phone: '',
};

// Save customer data to localStorage with expiration
export const setCustomerData = (data: CustomerState) => {
    const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour in milliseconds
    localStorage.setItem('customerData', JSON.stringify({ ...data, expirationTime }));
};

// Retrieve customer data from localStorage with expiration check
const getCustomerData = (): CustomerState | null => {
    const storedCustomerData = localStorage.getItem('customerData');
    if (storedCustomerData) {
        const { id, address, email, name, phone, expirationTime } = JSON.parse(storedCustomerData) as CustomerState & { expirationTime: number };
        if (new Date().getTime() < expirationTime) {
            return { id, address, email, name, phone }; // Return the data without expirationTime
        } else {
            localStorage.removeItem('customerData'); // Remove expired data
        }
    }
    return null; // Return null if no valid data found
};

// Clear customer data from localStorage
export const clearCustomerData = (setCustomerAtom: (data: CustomerState) => void) => {
    localStorage.removeItem('customerData'); // Clear customer data
    setCustomerAtom(initialCustomerState); // Reset the atom state to the initial customer state
};

// Initialize CustomerAtoms with stored data if available
const storedCustomerData = getCustomerData();
export const CustomerAtoms = atom<CustomerState>(storedCustomerData || initialCustomerState);

// Custom hook to manage customer data
export const useCustomerData = () => {
    const [customerData, setCustomerAtom] = useAtom(CustomerAtoms);

    // Function to update customer data in both atom and localStorage
    const updateCustomerData = (data: CustomerState) => {
        setCustomerAtom(data); // Update atom state
        setCustomerData(data); // Save to localStorage
    };

    return { customerData, updateCustomerData, clearCustomerData };
};