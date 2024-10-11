// OrderPlacementComponent.tsx
import React from 'react';
import axios, { isAxiosError } from 'axios';
import { useAtom } from 'jotai';
import {BasketAtom, clearBasket, TotalAmountAtom} from '../../atoms/BasketAtoms';
import { SelectedShippingOptionAtom } from '../../atoms/ShippingAtom';
import {CustomerAtoms} from "../../atoms/CustomerAtoms.ts";
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';


const OrderPlacementComponent: React.FC<{ onOrderPlaced: (orderId: string, deliveryDate: string, totalAmount: number) => void; }> = ({ onOrderPlaced }) => {
    // Fetching the necessary state from atoms
    const [basket, setBasket] = useAtom(BasketAtom);
    const [totalAmount] = useAtom(TotalAmountAtom);
    const [selectedShippingOption] = useAtom(SelectedShippingOptionAtom);
    const [customerData] = useAtom(CustomerAtoms);
    const navigate = useNavigate();

    const sendOrder = async () => {
        // Prepare the current date
        const currentDate = new Date();

        // Determine delivery days based on selected shipping option
        let deliveryDays;
        switch (selectedShippingOption.id) {
            case 'standard':
                deliveryDays = 7; // Standard shipping takes 5-7 business days
                break;
            case 'express':
                deliveryDays = 3; // Express shipping takes 2-3 business days
                break;
            case 'overnight':
                deliveryDays = 1; // Overnight shipping takes 1 business day
                break;
            default:
                deliveryDays = 2; // Default to 2 days if no option is selected
        }

        // Calculate the delivery date by adding the delivery days to the current date
        const deliveryDate = new Date(currentDate);
        deliveryDate.setDate(currentDate.getDate() + deliveryDays);

        // Prepare the order data
        const orderData = {
            customer: {
                id: customerData.id,
                name: customerData.name,
                address: customerData.address,
                phone: customerData.phone,
                email: customerData.email,
            },
            order: {
                orderDate: currentDate.toISOString(), // Current date in ISO format
                deliveryDate: deliveryDate.toISOString().split('T')[0], // Store the formatted delivery date
                status: 'Pending', // Default order status
                totalAmount, // Ensure totalAmount is defined
            },
            orderEntries: basket.map(item => ({
                productId: item.product_id, // Assuming product_id matches the expected API structure
                quantity: item.quantity,
                price: item.price, // Include price if needed
            })),
        };

        // Sending the order to the API
        const response = await axios.post('http://localhost:5261/api/order', orderData);

        // Return both order ID and delivery date
        return {
            orderId: response.data.id,
            deliveryDate: deliveryDate.toISOString().split('T')[0], // Return formatted delivery date
            totalAmount: totalAmount
        };
    };

    const handlePlaceOrder = async () => {
        try {
            const { orderId, deliveryDate } = await sendOrder(); // Destructure the returned object
            toast.success(`Order created with ID: ${orderId}`, { duration: 3000 });
            clearBasket(setBasket);
            onOrderPlaced(orderId, deliveryDate, totalAmount); // Call the success handler to move to step 5
        } catch (error: unknown) {
            let errorMessage = 'An error occurred while placing the order.';

            if (isAxiosError(error) && error.response?.data?.errors) {
                const productIds = error.response.data.errors
                    .map((errorMsg: string) => {
                        const match = errorMsg.match(/product ID (\d+)/);
                        return match ? match[1] : null; // Return the product ID or null if not found
                    })
                    .filter((id: string | null): id is string => id !== null); // Ensure the id is of type string

                // Create a user-friendly message if product IDs are found
                if (productIds.length > 0) {
                    errorMessage = `We do not have enough stock for product ID(s): ${productIds.join(', ')}`;
                    navigate('/shop'); // Navigate to the basket on error
                }
            } else {
                console.error('Unexpected error:', error);
                errorMessage = 'Failed to create order. Please check console for details.';
            }

            toast.error(errorMessage, { duration: 3000 });

        }
    };

    return (
        <>
            <button
                onClick={handlePlaceOrder}
                className="btn btn-primary"
            >
                Place Order
            </button>
        </>
    );
};

export default OrderPlacementComponent;
