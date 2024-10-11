import { useAtom } from 'jotai';
import {orderStatusAtom} from "../../atoms/OrderStatusAtoms.ts";
import {Api} from "../../../Api.ts";
import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import ConfirmationModal from "../Modals/ConfirmationModal.tsx";
import { cancelOrder } from './CancelOrder.ts';
import getAPIA from "../Utils/getAPIA.ts"; // Import your cancelOrder function





interface StatusChangeProps {
    orderId: number;
    currentStatus: string;
    onStatusChange: (newStatus: string) => void;
}

const StatusChange: React.FC<StatusChangeProps> = ({ orderId, currentStatus, onStatusChange }) => {
    const [statuses] = useAtom(orderStatusAtom); // Fetch available statuses
    const MyApi = new Api(); // Instantiate the API class

    const [isModalOpen, setModalOpen] = useState(false); // State to manage modal visibility
    const [newStatus, setNewStatus] = useState(currentStatus); // Track the new status

    // Whitelisted statuses that require confirmation
    const whitelistStatuses = ['Cancelled'];

    // Handle status change from the dropdown
    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatus = event.target.value;
        setNewStatus(selectedStatus);

        // Check if the selected status is in the whitelist
        if (whitelistStatuses.includes(selectedStatus)) {
            setModalOpen(true);
        } else {
            updateOrderStatus(selectedStatus).then();
        }
    };

    // Function to update order status and handle API call
    const updateOrderStatus = async (status: string) => {
        onStatusChange(status); // Update the status locally
        setModalOpen(false);

        try {
            await MyApi.api.orderUpdateOrderStatus(orderId, status, getAPIA());
            toast.success(`You have successfully updated the order status to ${status}!`, { duration: 3000 });
        } catch (error) {
            toast.error(`Failed to update status for order ${orderId}. Error: ${error || 'Unknown error occurred.'}`, { duration: 3000 });
        }
    };

    // Confirm the status change for whitelisted statuses
    const confirmStatusChange = async () => {
        if (newStatus === 'Cancelled') {
            try {
                await cancelOrder(orderId); // Use extern function
                onStatusChange(newStatus); // Update the local status to "Cancelled" only after successful cancellation
            } catch (error) {
                console.error("Error cancelling order:", error);
            }
        } else {
            await updateOrderStatus(newStatus);
        }
        setModalOpen(false);
    };


    return (
        <div>
            <label htmlFor="statusSelect" className=""></label>
            <select id="statusSelect" value={currentStatus} onChange={handleStatusChange} disabled={currentStatus === 'Cancelled'}>
                {statuses.map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={confirmStatusChange}
                title={`Confirm Action`}
                message={`Are you sure you want to change the order status to "${newStatus}"?`} // Custom message
            />
        </div>
    );
};

export default StatusChange;
