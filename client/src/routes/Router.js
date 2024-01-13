import Transaction from "../components/Transactions";
import Home from "../components/Home";
import Owners from "../components/Owners";
<<<<<<< HEAD
import { Routes, Route } from "react-router-dom";
const Router = () => {
  return (
    <Routes>
      {/*<Route path="/" element={<Home/>}/>*/}
      <Route path="/" element={<Home />} />
      <Route path="/transaction" element={<Transaction />} />
      <Route path="/owners" element={<Owners />} />
=======
import NotificationInterface from "../NotificationInterface";
import { Routes, Route } from "react-router-dom";
import Initial from "../components/Initial";
import { useContext } from "react";
import { ParentalContext } from "../ParentalContext";
const Router = () => {
  const { joined } = useContext(ParentalContext);
  return (
    <Routes>
      {!joined ? (
        <Route path="/" element={<Initial />} />
      ) : (
        <Route path="/home" element={<Home />} />
      )}
      {joined ? (
        <Route path="/home" element={<Home />} />
      ) : (
        <Route path="/" element={<Initial />} />
      )}
      {joined && <Route path="/transaction" element={<Transaction />} />}
      {joined && <Route path="/owners" element={<Owners />} />}
      {joined && (
        <Route path="/notifications" element={<NotificationInterface />} />
      )}
>>>>>>> 09d64b6 (adding push notifications)
    </Routes>
  );
};
export default Router;
