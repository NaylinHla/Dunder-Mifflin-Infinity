import axios, {isAxiosError} from 'axios';
import React, { useEffect, useState } from "react";
import { Api } from "../../Api.ts";
import { useAtom } from "jotai/index";
import { Product, productAtom } from '../atoms/ProductAtom.ts';
import {
    addToBasket,
    BasketAtom,
    clearBasket,
    loadBasketFromStorage,
    TotalAmountAtom,
    updateQuantity
} from '../atoms/BasketAtoms'; // Import the BasketAtom

// Define the interface for order entries
interface OrderEntry {
    productId: number;
    quantity: number;
    price: number;
}

type BasketItem = {
    product_id: number;
    quantity: number;
    price: number;
    name: string;
};


export const MyApi = new Api();

const NewOrderTest = () => {
    const [orderDate, setOrderDate] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [status, setStatus] = useState('Pending'); // Default status
    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');

    const [products, setProducts] = useAtom<Product[]>(productAtom);
    const [orderEntries, setOrderEntries] = useState<OrderEntry[]>([]); // Initially empty
    const [basket, setBasket] = useAtom(BasketAtom);
    const [totalAmount] = useAtom(TotalAmountAtom);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MyApi.api.paperGetAllPapers(); // Fetch data
                const fetchedProducts: Product[] = response.data as unknown as Product[]; // Use type assertion
                setProducts(fetchedProducts); // Set the products atom
                handleFillOrder(fetchedProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchData().then(null);
    }, [setProducts]);

    useEffect(() => {
        // Load basket from local storage
        loadBasketFromStorage(setBasket);
    }, [setBasket]);


    // Autofill predefined test data
    const fillFields = () => {
        const currentDate = new Date();
        // Format order date manually to local time without UTC conversion
        const orderDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}T${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}`;
        const deliveryDate = new Date(currentDate); // Create a new Date object based on the current date
        deliveryDate.setDate(deliveryDate.getDate() + 2); // Two days from now

        // Set the order date and delivery date
        setOrderDate(orderDate); // Using local time format
        setDeliveryDate(deliveryDate.toISOString().slice(0, 10)); // Delivery date in YYYY
        setStatus('Pending');
        setCustomerId('1');
        setCustomerName('John Doe');
        setCustomerEmail('johndoe@example.com');
        setCustomerPhone('123-456-7890');
        setCustomerAddress('123 Main St, Springfield, IL 62701, USA');

        handleFillOrder(products);
    };

    const handleQuantityChange = (index: number, newQuantity: number) => {
        const updatedOrderEntries = [...orderEntries];
        updatedOrderEntries[index].quantity = newQuantity; // Update quantity
        setOrderEntries(updatedOrderEntries);
    };

    const handleClearBasket = () => {
        clearBasket(setBasket);
    };


    const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const selectedId = parseInt(e.target.value);
        const product = products.find(p => p.id === selectedId);

        if (product) {
            const updatedOrderEntries = [...orderEntries];
            updatedOrderEntries[index] = {
                productId: product.id,
                quantity: 1, // Default quantity
                price: product.price
            };
            setOrderEntries(updatedOrderEntries);
        }
    };

    // Handle filling the order with the first product
    const handleFillOrder = (availableProducts: Product[]) => {
        if (availableProducts.length > 0) {
            const firstProduct = availableProducts[0];
            setOrderEntries([{ productId: firstProduct.id, quantity: 1, price: firstProduct.price }]);
        } else {
            setOrderEntries([]);
        }
    };

    // Create the new basket entry
    const handleAddToBasket = (entry: OrderEntry) => {
        const newEntry: BasketItem = {
            product_id: entry.productId,
            quantity: entry.quantity,
            price: entry.price, // Add the price here
            name: "N/A", // Add the price here
        };
        addToBasket(basket, newEntry, setBasket);
    };

    // Update quantity using the atom's method
    const handleUpdateQuantity = (entry: OrderEntry) => {
        updateQuantity(basket, entry.productId, entry.quantity, entry.price, "N/A","N/A", setBasket);
    };

    const calculateOrderEntriesTotal = () => {
        return orderEntries.reduce((total, entry) => total + entry.quantity * entry.price, 0);
    };



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const orderData = {
            customer: {
                id: parseInt(customerId),
                name: customerName,
                address: customerAddress,
                phone: customerPhone,
                email: customerEmail
            },
            order: {
                orderDate,
                deliveryDate,
                status,
                totalAmount,
            },
            orderEntries: basket.map(item => ({
                productId: item.product_id,
                quantity: item.quantity
            }))
        };

        try {
            const response = await axios.post('http://localhost:5261/api/order', orderData);
            alert(`Order created with ID: ${response.data.id}`);
            // Clear the form
            setOrderDate('');
            setDeliveryDate('');
            setStatus('');
            setCustomerId('');
            setOrderEntries([]); // Clear the order entries
            clearBasket(setBasket);
        } catch (error: unknown) {
            if (isAxiosError(error) && error.response?.data?.errors) {
                const productIds = error.response.data.errors
                    .map((errorMsg: string) => {
                        const match = errorMsg.match(/product ID (\d+)/);
                        return match ? match[1] : null; // Return the product ID or null if not found
                    })
                    .filter((id: string | null): id is string => id !== null); // Ensure the id is of type string

                // Create a user-friendly message if product IDs are found
                if (productIds.length > 0) {
                    alert(`We do not have enough stock for product ID(s): ${productIds.join(', ')}`);
                }
            } else {
                console.error('Unexpected error:', error);
                alert('Failed to create order. Please check console for details.');
            }
        }
    };


    return (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen p-4">
            <h1 className="text-3xl font-bold mb-4">Order Management System Beta 0.2</h1>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 py-6 mb-4 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Place an Order</h2>

                {/* Fill Fields Button */}
                <button
                    type="button"
                    onClick={fillFields}
                    className="bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mb-4"
                >
                    Fill Fields with Test Data
                </button>

                {/* OrderControl Date */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="orderDate">
                        Order Date:
                    </label>
                    <input
                        type="datetime-local"
                        id="orderDate"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                        required
                    />
                </div>

                {/* Delivery Date */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deliveryDate">
                        Delivery Date:
                    </label>
                    <input
                        type="date"
                        id="deliveryDate"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        required
                    />
                </div>

                {/* Status */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                        Status:
                    </label>
                    <input
                        type="text"
                        id="status"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    />
                </div>

                {/* Customer ID */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerId">
                        Customer ID:
                    </label>
                    <input
                        type="number"
                        id="customerId"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        required
                    />
                </div>

                {/* Customer Name */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerName">
                        Customer Name:
                    </label>
                    <input
                        type="text"
                        id="customerName"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                    />
                </div>

                {/* Customer Address */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerAddress">
                        Customer Address:
                    </label>
                    <input
                        type="text"
                        id="customerAddress"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        required
                    />
                </div>

                {/* Customer Email */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerEmail">
                        Customer Email:
                    </label>
                    <input
                        type="email"
                        id="customerEmail"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        required
                    />
                </div>

                {/* Customer Phone */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerPhone">
                        Customer Phone:
                    </label>
                    <input
                        type="tel"
                        id="customerPhone"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        required
                    />
                </div>

                {/* OrderControl Entry */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="orderEntries">Select
                        Products:</label>
                    {orderEntries.map((entry, index) => (
                        <div key={index} className="flex flex-col mb-4 border rounded-lg p-4 shadow-md bg-white">
                            <div className="flex items-center mb-2">
                                <select
                                    value={entry.productId}
                                    onChange={(e) => handleProductSelect(e, index)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
                                >
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>{product.name}</option>
                                    ))}
                                </select>
                                <div className="flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange(index, Math.max(entry.quantity - 1, 1))}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={entry.quantity}
                                        onChange={(e) => handleQuantityChange(index, Math.max(parseInt(e.target.value), 1))}
                                        min="1"
                                        className="shadow appearance-none border-t border-b rounded-none w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange(index, entry.quantity + 1)}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => handleUpdateQuantity(entry)} // Update Quantity
                                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
                                >
                                    Update Quantity
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAddToBasket(entry)} // Add to basket
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
                                >
                                    Add to Basket
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Display total amount for selected products */}
                <div className="flex items-center justify-between">
                <span className="text-gray-700 text-sm font-bold">
                Total Amount for Selected Products: ${calculateOrderEntriesTotal().toFixed(2)}
                </span>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    >
                        Submit Order
                    </button>

                    {/* Clear Basket Button */}
                    <button
                        type="button"
                        onClick={handleClearBasket}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                    >
                        Clear Basket
                    </button>
                </div>

            </form>

            {/* Basket Display */}
            <div className="bg-white shadow-md rounded px-8 py-6 mb-4 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Basket</h2>
                {basket.length === 0 ? (
                    <p className="text-gray-700">Your basket is empty.</p>
                ) : (
                    <div>
                        <ul className="list-disc pl-5">
                            {basket.map((item, index) => (
                                <li key={index} className="text-gray-700">
                                    Product ID: {item.product_id}, Quantity: {item.quantity}
                                </li>
                            ))}
                        </ul>
                        {/* Display the total price using the totalAmount from the TotalAmountAtom */}
                        <div className="mt-4 font-bold">
                            Total Price: ${totalAmount.toFixed(2)}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default NewOrderTest;
