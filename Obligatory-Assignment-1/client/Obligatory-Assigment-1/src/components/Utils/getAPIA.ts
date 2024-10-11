// Import necessary types
import { RequestParams } from "../../../Api.ts";

// Function to retrieve the token from local storage
const getToken = (): string | null => {
    return localStorage.getItem('token');
};

// Method that returns the config object dynamically
const getAPIA = (): RequestParams => {
    const token = getToken(); // Get the token
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
        },
    };
};

export default getAPIA;