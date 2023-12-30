import Transaction from "../components/Transactions";
import Home from "../components/Home";
import Owners from "../components/Owners";
import { Routes, Route } from "react-router-dom";
const Router = () => {
  return (
    <Routes>
      {/*<Route path="/" element={<Home/>}/>*/}
      <Route path="/" element={<Home />} />
      <Route path="/transaction" element={<Transaction />} />
      <Route path="/owners" element={<Owners />} />
    </Routes>
  );
};
export default Router;
