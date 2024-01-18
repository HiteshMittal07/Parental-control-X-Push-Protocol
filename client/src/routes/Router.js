import Transaction from "../components/Transactions";
import Home from "../components/Home";
import Owners from "../components/Owners";
import { Routes, Route } from "react-router-dom";
import Initial from "../components/Initial";
import { useContext } from "react";
import { ParentalContext } from "../ParentalContext";
import Notifications from "../components/Notifications";
const Router = () => {
  const { joined, created } = useContext(ParentalContext);
  return (
    <Routes>
      {!joined || !created ? (
        <Route path="/" element={<Initial />} />
      ) : (
        <Route path="/home" element={<Home />} />
      )}
      {joined || created ? (
        <Route path="/home" element={<Home />} />
      ) : (
        <Route path="/" element={<Initial />} />
      )}
      {created || joined ? (
        <Route path="/transaction" element={<Transaction />} />
      ) : (
        ""
      )}
      {created || joined ? <Route path="/owners" element={<Owners />} /> : ""}
      {created || joined ? (
        <Route path="/notifications" element={<Notifications />} />
      ) : (
        ""
      )}
    </Routes>
  );
};
export default Router;
