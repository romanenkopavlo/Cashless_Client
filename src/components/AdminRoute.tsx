import {Navigate, Outlet} from 'react-router-dom'
import {useAuthenticationJWTStore} from "../stores/AuthenticationJWT.ts";
import {getDecodedToken} from "../utils/TokenDecodage.ts";


const AdminRoute = () => {
    const {accessToken} = useAuthenticationJWTStore()
    const user = getDecodedToken(accessToken?.token)
    return (accessToken && (user?.role === "Administrateur")) ? <Outlet/> : <Navigate to="/login" replace/>;
}

export default AdminRoute