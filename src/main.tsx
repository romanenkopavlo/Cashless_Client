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
import {HistoriqueTransaction} from "./pages/HistoriqueTransaction.tsx";
import {GestionStands} from "./pages/administration/GestionStands.tsx";
import AdminRoute from "./components/AdminRoute.tsx";

const router = createBrowserRouter(([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "/", element: <Home/>},
            {path: "/login", element: <UserLogin/>},
            {path: "/signup", element: <Signup/>},
            {
                element: <PrivateRoute/>,
                children: [
                    {path: "/profile", element: <Profile/>},
                    {path: "/transaction-history", element: <HistoriqueTransaction/>},
                    {path: "/logout", element: <Logout/>},
                ]
            },
            {
                element: <AdminRoute/>,
                children: [
                    {path: "/manage-stands", element: <GestionStands/>}
                ]
            }
        ]
    }
]))


ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>
)