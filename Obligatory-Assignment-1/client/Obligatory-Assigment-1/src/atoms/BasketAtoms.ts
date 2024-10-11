import { atom } from 'jotai';

// Define a type for a basket item
type BasketItem = {
    product_id: number;
    quantity: number;
    price: number;
    name: string;
    selectedProperty?: string; // Optional selected property
};

// Local storage keys
const BASKET_STORAGE_KEY = 'basket_data';
const BASKET_EXPIRY_KEY = 'basket_expiry';

// Function to get the current timestamp in milliseconds
const getCurrentTimestamp = () => new Date().getTime();

// Utility functions for local storage
const getFromLocalStorage = (key: string) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
};

// Generic function to set items in local storage
const setInLocalStorage = <T>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
};

// Function to check if the basket in localStorage is expired
const isBasketExpired = () => {
    const expiry = localStorage.getItem(BASKET_EXPIRY_KEY);
    return !expiry || getCurrentTimestamp() > parseInt(expiry, 10);
};

// Atom to initialize the basket
export const BasketAtom = atom<BasketItem[]>([]);

// Derived atom to calculate total amount from the basket items
export const TotalAmountAtom = atom((get) => {
    const basket = get(BasketAtom);
    return basket.reduce((total, item) => total + item.quantity * item.price, 0);
});

// Load the basket from localStorage, only if it's not expired
export const loadBasketFromStorage = (setBasket: (basket: BasketItem[]) => void) => {
    const savedBasket = getFromLocalStorage(BASKET_STORAGE_KEY);
    if (savedBasket && !isBasketExpired()) {
        setBasket(savedBasket);
    } else {
        clearBasket(setBasket); // Clear everything if expired
    }
};

// Persist the basket to localStorage with a 1-hour expiry
export const saveBasketToStorage = (basket: BasketItem[]) => {
    if (basket.length > 0) {
        setInLocalStorage(BASKET_STORAGE_KEY, basket);
        const expiryTime = getCurrentTimestamp() + 3600000; // 1 hour from now
        setInLocalStorage(BASKET_EXPIRY_KEY, expiryTime);
    } else {
        localStorage.removeItem(BASKET_STORAGE_KEY);
        localStorage.removeItem(BASKET_EXPIRY_KEY);
    }
};

// Function to add an item to the basket
export const addToBasket = (
    basket: BasketItem[],
    product: BasketItem,
    setBasket: (updatedBasket: BasketItem[]) => void
) => {
    // Check if the product already exists in the basket
    const existingProduct = basket.find((item) => item.product_id === product.product_id);

    let updatedBasket: BasketItem[];

    if (existingProduct) {
        // If the product exists, update the quantity
        updatedBasket = basket.map((item) =>
            item.product_id === product.product_id
                ? { ...item, quantity: item.quantity + product.quantity, name: product.name, selectedProperty: product.selectedProperty } // Update the quantity, name, and selectedProperty
                : item
        );
    } else {
        // If it's a new product, add it to the basket
        updatedBasket = [...basket, product]; // Add the new product
    }

    // Update the basket state
    setBasket(updatedBasket);

    // Persist the updated basket to local storage
    saveBasketToStorage(updatedBasket); // Use the saveBasketToStorage function for persistence
};

// Function to update the quantity of an item
export const updateQuantity = (
    basket: BasketItem[],
    productId: number,
    newQuantity: number,
    productPrice: number,
    productName: string,
    selectedProperty: string,
    setBasket: (updatedBasket: BasketItem[]) => void
) => {
    const existingProductIndex = basket.findIndex(item => item.product_id === productId);
    let updatedBasket = [...basket];

    if (existingProductIndex !== -1) {
        // If the product exists, update the quantity and selected property
        updatedBasket[existingProductIndex].quantity = newQuantity; // Update the quantity
        if(selectedProperty !== "N/A")  { //Don't update name when its N/A
            updatedBasket[existingProductIndex].selectedProperty = selectedProperty; // Update the selected property
        }
    } else {
        // If the product does not exist, add it to the basket
        const newItem: BasketItem = { product_id: productId, quantity: newQuantity, price: productPrice, name: productName, selectedProperty }; // Include selectedProperty
        updatedBasket.push(newItem); // Add new item to the basket
    }

    // Remove products with quantity 0
    updatedBasket = updatedBasket.filter(item => item.quantity > 0);

    // Update the basket state
    setBasket(updatedBasket);
    saveBasketToStorage(updatedBasket); // Save the updated basket to local storage
};

// Function to clear the basket
export const clearBasket = (setBasket: (emptyBasket: BasketItem[]) => void) => {
    setBasket([]); // Clear the basket
    localStorage.removeItem(BASKET_STORAGE_KEY); // Also clear localStorage
    localStorage.removeItem(BASKET_EXPIRY_KEY); // Remove expiry key as well
};
