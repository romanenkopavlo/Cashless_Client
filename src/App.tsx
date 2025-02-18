import './App.css'
import {Outlet} from "react-router";
import {UnloadLogout} from "./utils/UnloadLogout.ts";

export const App = () => {
    UnloadLogout()
    return (
        <div>
            <Outlet/>
        </div>
    )
}
