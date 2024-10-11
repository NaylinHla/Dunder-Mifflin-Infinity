// useLogin.ts
import { useAtom } from 'jotai';
import { authAtom, setAuthData, isAdmin } from '../../atoms/LoginAtoms';
import { toast } from "react-hot-toast";
import { useCustomerData } from '../../atoms/CustomerAtoms';
import { CustomerAtoms } from '../../atoms/CustomerAtoms';
import {MyApi} from "../Pages/MyProfile.tsx";
import getAPIA from "../Utils/getAPIA.ts";


export const useLogin = () => {
    const [, setAuth] = useAtom(authAtom);
    const [, ] = useAtom(CustomerAtoms);
    const { updateCustomerData } = useCustomerData();

    const loginUser = async (email: string) => {

            // Save user login state without the password in authAtom
            const authData = {
                email,
                isLoggedIn: true,
            };

            const userRoleType = isAdmin(email) ? 'Admin' : 'User';
            const loginResponse = await MyApi.api.authLogin({
                email,
                roleType: userRoleType,
            });

            // @ts-expect-error: Ignore an error there don't exist
            localStorage.setItem('token', loginResponse.data.token);

            // Save to localStorage and update the atom
            setAuthData(authData); // Save auth data with expiration
            setAuth(authData);


            // Fetch customer data based on the email using MyApi
        try {
            const response = await MyApi.api.customerGetCustomerByEmail(email,getAPIA());

            if (response) {
                // @ts-expect-error: Ignore an error if it doesn't exist
                updateCustomerData(response.data);
                console.log(response.data)

            } else {
                //At the moment we ignore should tell to create a new one?
            }

            return true; // Indicate success
        } catch (error) {
            console.error("Error fetching customer data:", error);
            return true; // Indicate success at the moment we don't handle this
        } finally {
            toast.success("You have logged in successfully!", {duration: 3000});
        }

    };

    return { loginUser };
};
