import Transaction from "../components/Transactions";
import Home from "../components/Home";
import Owners from "../components/Parents";
import { Routes, Route } from "react-router-dom";
import Initial from "../components/Initial";
import Notifications from "../components/Notifications";
import Info from "../components/Info";
import PrivateRoute from "./PrivateComponent";
const Router = () => {
  return (
    <Routes>
      {localStorage.getItem("enter") !== true && (
        <Route path="/" element={<Initial />} />
      )}
      <Route path="/home" element={<PrivateRoute Component={Home} />} />
      <Route
        path="/transaction"
        element={<PrivateRoute Component={Transaction} />}
      />
      <Route path="/owners" element={<PrivateRoute Component={Owners} />} />
      <Route
        path="/notifications"
        element={<PrivateRoute Component={Notifications} />}
      />
      <Route path="/info" element={<Info />} />
    </Routes>
  );
};
export default Router;
