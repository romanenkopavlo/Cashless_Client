import { Header } from "../components/Header"
import { Footer } from "../components/Footer"

export const Home = () => {
    return (
        <><Header/><Footer/></>
    )
}

// import { useEffect, useState } from "react";
//
// export const Home = () => {
//     const [data, setData] = useState(null);
//
//     useEffect(() => {
//         fetch("http://localhost:5000/")
//             .then((res) => res.json())
//             .then((result) => setData(result.message))
//             .catch((err) => console.error(err));
//     }, []);
//
//     return (
//         <div>
//             <h1>React + Vite</h1>
//             <p>{data ? data : "Chargement des données..."}</p>
//         </div>
//     );
// }