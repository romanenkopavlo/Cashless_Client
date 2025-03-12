import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router";
import {Home} from "./pages/Home.tsx";
import {App} from "./App.tsx";
import {Login} from "./pages/connection/Login.tsx";
import {Profile} from "./pages/users/Profile.tsx";
import {Signup} from "./pages/connection/Signup.tsx";
import {Logout} from "./pages/connection/Logout.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import {HistoriqueTransaction} from "./pages/users/HistoriqueTransaction.tsx";
import {GestionStands} from "./pages/administration/GestionStands.tsx";
import AdminRoute from "./components/AdminRoute.tsx";
import {GestionFestivaliers} from "./pages/administration/GestionFestivaliers.tsx";
import {GestionBenevoles} from "./pages/administration/GestionBenevoles.tsx";
import {GestionTransactions} from "./pages/administration/GestionTransactions.tsx";
import {GestionCartes} from "./pages/administration/GestionCartes.tsx";
import {GestionPhones} from "./pages/administration/GestionPhones.tsx";
import {GestionTerminaux} from "./pages/administration/GestionTerminaux.tsx";
import {ListeDesBenevoles} from "./pages/administration/ListeDesBenevoles.tsx";

const router = createBrowserRouter(([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "/", element: <Home/>},
            {path: "/login", element: <Login/>},
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
                    {path: "/listes-benevoles", element: <ListeDesBenevoles/>},
                    {path: "/manage-stands", element: <GestionStands/>},
                    {path: "/manage-phones", element: <GestionPhones/>},
                    {path: "/manage-terminals", element: <GestionTerminaux/>},
                    {path: "/manage-cards", element: <GestionCartes/>},
                    {path: "/manage-festivaliers", element: <GestionFestivaliers/>},
                    {path: "/manage-transactions", element: <GestionTransactions/>},
                    {path: "/manage-benevoles", element: <GestionBenevoles/>},
                ]
            }
        ]
    }
]))


ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>
)