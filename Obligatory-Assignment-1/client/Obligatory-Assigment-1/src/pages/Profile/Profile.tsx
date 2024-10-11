    import MyProfile from "../../components/Pages/MyProfile.tsx";
    import { authAtom, checkAdminStatus } from "../../atoms/LoginAtoms.ts";
    import {useAtom} from "jotai/index";
    import NoPermission from "../Errors/NoPermission.tsx";

    function Profile() {
        const [authState] = useAtom(authAtom); // Subscribe to auth state
        const isAdminUser = checkAdminStatus(authState);

        // Check if user is logged in
        if (!authState.isLoggedIn || isAdminUser) {
            return <NoPermission />; // Show NoPermission if not logged in
        }

        return (
            <div>
                <h1 className="text-5xl font-bold">Profile</h1>

                <MyProfile/>
            </div>
        );
    }

    export default Profile;