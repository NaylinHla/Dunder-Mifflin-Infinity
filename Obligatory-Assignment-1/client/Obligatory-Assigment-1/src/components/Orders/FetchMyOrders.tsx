import React, { useEffect, useState } from "react";
import {Api} from "../../../Api.ts";
import { useAtom } from "jotai";
import {CustomerAtoms} from "../../atoms/CustomerAtoms.ts";
import { useNavigate } from "react-router-dom";
import {orderStatusAtom} from "../../atoms/OrderStatusAtoms.ts";
import {searchAtom} from "../../atoms/atoms.ts";
import {orderAtom} from "../../atoms/OrderEntryAtoms.ts";
import GetAPIA from "../Utils/getAPIA.ts";


export const MyApi = new Api();

// Inline TableCell component
const TableCell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <td className="border border-gray-300 px-2 py-1 text-xs sm:text-sm">{children}</td>
    );
};

function AddOrder() {
    const [orders, setOrders] = useAtom(orderAtom);
    const [customer] = useAtom(CustomerAtoms);
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [statuses] = useAtom(orderStatusAtom);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Hook for navigation
    const [searchQuery] = useAtom(searchAtom); // Use the navbar search

    useEffect(() => {
        setLoading(true); // Set loading to true when fetching starts
        // Fetch orders for the specific customer
        MyApi.api.customerGetOrdersByCustomerId(customer.id, GetAPIA())
            .then((ordersResponse) => {
                    // @ts-expect-error: Ignore an error if it doesn't exist
                    setOrders(ordersResponse.data);
                    setError(null); // Clear any previous errors
            })
            .catch((error) => {
                // Check if response is empty and handle it
                if (error.status === 404) {
                    setOrders([]); // No orders found
                    setError("No orders found for this customer.");
                } else {
                    console.error("Error fetching orders:");
                    setError("Failed to load orders. Please try again later."); // Set error message
                }
                setOrders([]); // Clear orders on error
            })
            .finally(() => {
                setLoading(false); // Set loading to false after the API call
            });
    }, [setOrders, customer]);

    // Handle filtering orders by status and search query
    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === "All" || order.status === filterStatus;
        const matchesSearch =
            order.id.toString().includes(searchQuery) || // Search by ID
            order.totalAmount.toString().includes(searchQuery) || // Search by Total Amount
            new Date(order.deliveryDate).toLocaleDateString().includes(searchQuery) || // Search by Delivery Date
            new Date(order.orderDate).toLocaleDateString().includes(searchQuery); // Search by Order Date
        return matchesStatus && matchesSearch; // Combine filters
    });

    const handleOrderClick = (orderId: number) => {
        // Navigate to the order details page with the order ID
        navigate(`/myOrders/${orderId}`);
    };

    return (
        <div className="m-4 sm:m-0">
            <div className="mb-4 m-4">
                <label htmlFor="filterStatus" className="mr-2">Filter by Status:</label>
                <select
                    id="filterStatus"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border rounded p-1"
                >
                    <option value="All">All</option>
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            {/* Only render the table if not loading */}
            <div className="overflow-x-auto">
                {/* Standard Table for larger screens */}
                <table className="table-auto border-collapse w-full min-w-[800px] hidden sm:table">
                    <thead className="bg-gray-200">
                    <tr className="bg-gray-200">
                        <TableCell>Id</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Total Amount</TableCell>
                        <TableCell>Order Date</TableCell>
                        <TableCell>Delivery Date</TableCell>
                        <TableCell>Check Order</TableCell>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={6}>Loading...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={6} className="text-red-500 py-4">{error}</td>
                        </tr>
                    ) : filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <tr key={order.id} className="cursor-pointer hover:bg-gray-100">
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>{order.totalAmount}$</TableCell>
                                <TableCell>
                                    {new Date(order.orderDate).toLocaleDateString()}{" "}
                                    {new Date(order.orderDate).toLocaleTimeString()}
                                </TableCell>
                                <TableCell>
                                    {new Date(order.deliveryDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <button onClick={() => handleOrderClick(order.id)}
                                            className="btn btn-primary px-0.5 py-0.5">
                                        Check Order
                                    </button>
                                </TableCell>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6}>No Orders found</td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {/* Mobile view representation of orders */}
                <div className="sm:hidden grid grid-cols-1 gap-4 overflow-hidden">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="p-4 border border-gray-300 rounded-lg">
                            <div className="mb-2">
                                <strong>Id:</strong> {order.id}
                            </div>
                            <div className="mb-2 overflow-hidden text-ellipsis">
                                <strong>Status:</strong> {order.status}
                            </div>
                            <div className="mb-2 overflow-hidden text-ellipsis">
                                <strong>Total Order:</strong> {order.totalAmount}$
                            </div>
                            <div className="mb-2 overflow-hidden text-ellipsis">
                                <strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}
                            </div>
                            <div className="mb-2 overflow-hidden text-ellipsis">
                                <strong>Delivery Date:</strong> {new Date(order.deliveryDate).toDateString()}
                            </div>
                            <button onClick={() => handleOrderClick(order.id)} className="btn btn-primary px-4 py-2">
                                Check Order
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AddOrder;