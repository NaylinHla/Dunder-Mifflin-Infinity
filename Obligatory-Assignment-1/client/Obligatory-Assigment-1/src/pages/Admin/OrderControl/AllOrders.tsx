import FetchOrders from "../../../components/Orders/FetchAllOrders.tsx";
import {useAtom} from "jotai/index";
import {authAtom, checkAdminStatus} from "../../../atoms/LoginAtoms.ts";
import NoPermission from "../../Errors/NoPermission.tsx";


function AllOrders() {
    const [authState] = useAtom(authAtom);
    const isAdminUser = checkAdminStatus(authState);

    // Check if user is an admin
    if (!isAdminUser) {
        return <NoPermission />; // Show NoPermission page if not an admin
    }

    return (
      <div>

          <h1 className="text-3xl m-2 font-bold">All Orders</h1>

          <FetchOrders />
      </div>
  );
}

export default AllOrders;