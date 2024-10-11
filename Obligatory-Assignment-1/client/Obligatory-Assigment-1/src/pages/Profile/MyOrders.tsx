import FetchOrders from "../../components/Orders/FetchMyOrders.tsx";
import {useAtom} from "jotai/index";
import {authAtom, checkAdminStatus} from "../../atoms/LoginAtoms.ts";
import NoPermission from "../Errors/NoPermission.tsx";

function MyOrders() {
    const [authState] = useAtom(authAtom); // Subscribe to auth state
    const isAdminUser = checkAdminStatus(authState);

    // Check if user is logged in
    if (!authState.isLoggedIn || isAdminUser) {
        return <NoPermission />; // Show NoPermission if not logged in
    }

    return (
      <div>
          <h1 className="text-3xl m-2 font-bold">My Orders</h1>
          <FetchOrders />
      </div>
  );
}

export default MyOrders;