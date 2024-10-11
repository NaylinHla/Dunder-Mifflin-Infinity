import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {Api} from "../../../Api.ts";
import { useAtom } from "jotai/index";
import toast from 'react-hot-toast';
import NoPermission from "../../pages/Errors/NoPermission.tsx";
import {cancelOrder} from "./CancelOrder.ts";
import ConfirmationModal from "../Modals/ConfirmationModal.tsx";
import StatusChange from "./OrderStatusChange.tsx";
import {CustomerAtoms} from "../../atoms/CustomerAtoms.ts";
import axios from "axios";
import {authAtom} from "../../atoms/LoginAtoms.ts";
import getAPIA from "../Utils/getAPIA.ts";

const MyApi = new Api();

interface Order {
    id: number;
    customerId?: number; // Optional for admin view
    customer?: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    status: string;
    totalAmount: number;
    orderDate: number;
    deliveryDate: number;
    orderEntries: {
        id: number;
        productId: number;
        quantity: number;
        paper: {
            id: number;
            name: string;
            discontinued: boolean;
            stock: number;
            price: number;
            propertyName: string;
        };
    }[];
}

interface OrderDetailsProps {
    isAdmin: boolean; // Prop to determine if the user is an admin
}

function OrderDetails({ isAdmin }: OrderDetailsProps) {
    const { id } = useParams<{ id: string }>(); // Get the order ID from the URL parameters
    const [order, setOrder] = useState<Order | null>(null); // State to hold order details
    const navigate = useNavigate(); // Initialize navigate
    const [loading, setLoading] = useState(true); // Loading state
    const [customer] = useAtom(CustomerAtoms); // Get customer atom
    const [isModalOpen, setModalOpen] = useState(false); // Modal state for cancellation
    const [error, setError] = useState<string | null>(null);
    const [authState] = useAtom(authAtom); // Subscribe to auth state

    // Fetch order details when the component mounts or dependencies change
    const fetchOrderDetails = useCallback(async (orderId: number) => {
        setLoading(true); // Set loading to true before fetching
        setError(null); // Clear any previous errors
        try {
            const response = await MyApi.api.orderGetOrderById(orderId, getAPIA());
            const fetchedOrder = response.data;
            // Check if the fetched order belongs to the customer or if the user is admin
            if (!isAdmin && fetchedOrder.customerId !== customer.id) {
                setOrder(null); // If not the right customer and not an admin, set order to null
            } else {
                // @ts-expect-error: Ignore an error if it doesn't exist
                setOrder(fetchedOrder); // Set order data
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 404) {
                    setError("No orders found for this id.");
                } else if (error.response.status === 403) {
                    return <NoPermission />;
                } else {
                    setError("Failed to load order details. Please try again later.");
                }
                setOrder(null); // Set order to null on error as a fallback
            }
        } finally {
            setLoading(false); // Set loading to false when done
        }
    }, [customer.id, isAdmin]);

    const refreshOrderDetails = useCallback(() => {
        fetchOrderDetails(Number(id)).then(); // Ensure you're passing the correct id
    }, [fetchOrderDetails, id]); // Depend on fetchOrderDetails and id

    // Fetch order details when the component mounts or dependencies change
    useEffect(() => {
        refreshOrderDetails(); // Fetch the initial order details
    }, [id, refreshOrderDetails]); // Include refreshOrderDetails in the dependency array

    // Redirect for non-customers or non-admins
    if (!customer && !isAdmin || !authState.isLoggedIn) {
        return <NoPermission />; // No access for non-customers or non-admins
    }

    const handleReturn = () => {
        navigate(isAdmin ? '/admin/allOrders' : '/myOrders'); // Navigate based on role
    };

    const openCancelModal = () => {
        setModalOpen(true);
    };

    const confirmCancelOrder = () => {
        if (!order) return;
        cancelOrder(order.id).then(() => {setOrder((prevOrder) =>
                prevOrder ? { ...prevOrder, status: 'Cancelled' } : null);}); //Change status on screen direct
        refreshOrderDetails(); // Refresh order details
        setModalOpen(false); // Close modal
    };

    const handleCancelOrderClick = () => {
        if (order && order.status !== 'Pending') {
            toast.error(
                "You can only cancel an order if its status is 'Pending'. " +
                "If you still wish to proceed, please contact customer service."
            );
        } else {
            openCancelModal(); // Open cancellation confirmation modal
        }
    };

    return (
        <div className="p-6 bg-gray-50">
            <h1 className="text-3xl font-bold mb-4">Order Summary</h1>
            {loading ? (
                <p className="text-gray-700">Loading order details...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p> // Display error message
            ) : order ? (
                <div className="mt-4 bg-white shadow-md rounded-lg p-6">
                    <div className="mb-2">
                        <p><span className="font-semibold">Order ID:</span> {order.id}</p>
                        {isAdmin && (
                            <>
                                <p><span className="font-semibold">Customer Name:</span> {order.customer?.name || "Unknown"}</p>
                                <p><span className="font-semibold">Customer Email:</span> {order.customer?.email || "N/A"}</p>
                                <p><span className="font-semibold">Customer Phone:</span> {order.customer?.phone || "N/A"}</p>
                                <p><span className="font-semibold">Customer Address:</span> {order.customer?.address || "N/A"}</p>
                            </>
                        )}
                        <p><span className="font-semibold">Total Amount:</span> ${order.totalAmount.toFixed(2)}</p>
                        <p><span className="font-semibold">Order Date:</span> {new Date(order.orderDate).toLocaleString()}</p>
                        <p><span className="font-semibold">Expected Delivery Date:</span> {new Date(order.deliveryDate).toDateString()}</p>
                        {!isAdmin && (
                            <p><span className="font-semibold">Status:</span> {order.status}</p>
                        )}
                    </div>

                    {isAdmin && ( // Show StatusChange only for admin
                        <div className="flex items-center mt-4">
                            <span className="font-semibold mr-2">Change Order Status:</span>
                            <StatusChange
                                orderId={order.id}
                                currentStatus={order.status}
                                onStatusChange={(newStatus) => setOrder((prevOrder) => ({
                                    ...prevOrder!,
                                    status: newStatus,
                                }))}
                            />
                        </div>
                    )}

                    <h2 className="text-xl font-semibold mt-4">Order Entries</h2>
                    <ul className="list-disc ml-5">
                        {order.orderEntries.length > 0 ? (
                            order.orderEntries.map((entry) => (
                                <li key={entry.id} className="text-gray-700">
                                    Product Name: <span className="font-semibold">{entry.paper.name || "Unknown"}</span>,
                                    Quantity: <span className="font-semibold">{entry.quantity || "Unknown"} </span>,
                                    Price: <span className="font-semibold"> ${entry.paper.price || "Unknown"}</span>,
                                    Color: <span className="font-semibold">{entry.paper.propertyName || "Unknown"}</span>
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-700">No order entries available.</li>
                        )}
                    </ul>

                    <div className="flex justify-between mt-6">
                        <button onClick={handleReturn} className="btn btn-primary">
                            Return
                        </button>
                        {!isAdmin && ( // Show cancel button only for customers
                            <button
                                onClick={handleCancelOrderClick}
                                className={`btn ${order?.status === 'Pending' ? 'btn-red' : 'btn-gray opacity-50 cursor-not-allowed'}`}
                                disabled={order?.status !== 'Pending'}
                            >
                                Cancel Order
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <NoPermission />
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={confirmCancelOrder}
                title="Confirm Cancellation"
                message="Are you sure you want to cancel this order? This action cannot be undone."
            />
        </div>
    );
}

export default OrderDetails;
