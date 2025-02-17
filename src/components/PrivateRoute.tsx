import {Navigate, Outlet} from 'react-router-dom'
import {useAuthenticationJWTStore} from "../store/AuthenticationJWT.ts";


const PrivateRoute = () => {
    const {accessToken} = useAuthenticationJWTStore()
    return accessToken ? <Outlet/> : <Navigate to="/login" replace/>;
}

export default PrivateRoute