import Transaction from "../components/Transactions";
import Home from "../components/Home";
import Owners from "../components/Owners"
import { Routes,Route } from "react-router-dom";
const Router=(props)=>{
    return(
        <Routes>
            {/*<Route path="/" element={<Home/>}/>*/}
            <Route path="/" element={<Home {...props}/>}/>
            <Route path="/transaction" element={<Transaction{...props}/>}/>
            <Route path="/owners" element={<Owners {...props}/>}/>
        </Routes>
    )
}
export default Router;