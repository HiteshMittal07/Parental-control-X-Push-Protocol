import Transaction from "../components/Transactions";
import Home from "../components/Home";
import Owners from "../components/Owners";
import { Routes, Route } from "react-router-dom";
import Initial from "../components/Initial";
import Notifications from "../components/Notifications";
const Router = () => {
  return (
    <Routes>
      {!localStorage.getItem("enter") ? (
        <Route path="/" element={<Initial />} />
      ) : (
        <Route path="/home" element={<Home />} />
      )}
      {localStorage.getItem("enter") ? (
        <Route path="/home" element={<Home />} />
      ) : (
        <Route path="/" element={<Initial />} />
      )}
      {localStorage.getItem("enter") ? (
        <Route path="/transaction" element={<Transaction />} />
      ) : (
        ""
      )}
      {localStorage.getItem("enter") ? (
        <Route path="/owners" element={<Owners />} />
      ) : (
        ""
      )}
      {localStorage.getItem("enter") ? (
        <Route path="/notifications" element={<Notifications />} />
      ) : (
        ""
      )}
    </Routes>
  );
};
export default Router;
