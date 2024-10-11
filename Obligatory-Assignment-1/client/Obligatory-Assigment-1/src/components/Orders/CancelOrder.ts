import {Api} from "../../../Api.ts";
import toast from 'react-hot-toast';
import getAPIA from "../Utils/getAPIA.ts";

const MyApi = new Api();

export const cancelOrder = async (orderId: number) => {
    try {
        await MyApi.api.orderCancelOrder(orderId, getAPIA());
        toast.success("Order has been cancelled successfully."); // Show success toast
    } catch (error: any) {
        if (error.response) {
            // Server-side error
            if (error.response.status === 404) {
                toast.error("Order not found."); // Specific error
            } else if (error.response.status === 403) {
                toast.error("You do not have permission to cancel this order."); // Permission error
            } else {
                toast.error("Failed to cancel order due to server error."); // Generic server error
            }
        } else if (error.request) {
            // Network error
            toast.error("Network error. Please try again later."); // Network error
        } else {
            // Some other error
            toast.error("An error occurred. Please try again."); // Generic error
        }
    }
};
