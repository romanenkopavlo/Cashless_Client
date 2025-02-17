import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router";
import {Home} from "./pages/Home.tsx";
import {App} from "./App.tsx";
import {UserLogin} from "./pages/User-login.tsx";
import {Profile} from "./pages/Profile.tsx";
import {Signup} from "./pages/Signup.tsx";
import {Logout} from "./pages/Logout.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import {BalanceCheck} from "./pages/BalanceCheck.tsx";

const router = createBrowserRouter(([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "/", element: <Home/>},
            {path: "/login", element: <UserLogin/>},
            {path: "/signup", element: <Signup/>},
            {path: "/logout", element: <Logout/>},
            {
                element: <PrivateRoute/>,
                children: [
                    {path: "/profile", element: <Profile/>},
                    {path: "/checkBalance", element: <BalanceCheck/>}
                ]
            }
        ]
    }
]))


ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>
)