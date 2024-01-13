import { useContext } from "react";
<<<<<<< HEAD
import { Link } from "react-router-dom";
import { ParentalContext } from "../ParentalContext";

=======
import { Link, useNavigate } from "react-router-dom";
import { ParentalContext } from "../ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../images/logo.png";
import { FaBell } from "react-icons/fa";
import AddUser from "./AddUser";
>>>>>>> 09d64b6 (adding push notifications)
const Header = () => {
  const { state, connectWallet, SetJoined, SetCreated, joined, created } =
    useContext(ParentalContext);
  const { contract } = state;
<<<<<<< HEAD
  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-dark text-bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <h5 className="brand-name">Parental Control</h5>
        </Link>
=======
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-dark text-bg-dark bg-transparent">
      <div className="container">
        {joined || created ? (
          <Link className="navbar-brand" to="/home">
            <img
              src={logo}
              alt="Logo"
              height="80"
              width="110"
              className="d-inline-block align-top"
            />
          </Link>
        ) : (
          <Link className="navbar-brand" to="/">
            <img
              src={logo}
              alt="Logo"
              height="80"
              width="110"
              className="d-inline-block align-top"
            />
          </Link>
        )}
>>>>>>> 09d64b6 (adding push notifications)
        <button
          className="navbar-toggler"
          data-bs-target="#navDrop"
          data-bs-toggle="collapse"
          aria-controls="navDrop"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navDrop">
          <ul className="navbar-nav ms-auto">
<<<<<<< HEAD
            <li className="nav-item">
              <Link to="/transaction" className="nav-link">
                Transaction Logs
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/owners" className="nav-link">
                Owners
              </Link>
            </li>
=======
            {joined || created == true ? (
              <li className="nav-item">
                <Link to="/home" className="nav-link">
                  Home
                </Link>
              </li>
            ) : (
              ""
            )}
            {joined || created == true ? (
              <li className="nav-item">
                <Link to="/transaction" className="nav-link">
                  Transaction Logs
                </Link>
              </li>
            ) : (
              ""
            )}
            {joined || created == true ? (
              <li className="nav-item">
                <Link to="/owners" className="nav-link">
                  Owners
                </Link>
              </li>
            ) : (
              ""
            )}
            {joined || created == true ? (
              <li className="nav-item">
                <Link to="/notifications" className="nav-link">
                  <FaBell style={{ cursor: "pointer" }} />
                </Link>
              </li>
            ) : (
              ""
            )}
>>>>>>> 09d64b6 (adding push notifications)
            {contract == null ? (
              <li className="nav-item">
                <button className="btn btn-light ms-2" onClick={connectWallet}>
                  Connect wallet
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <button className="btn btn-light ms-2" onClick={connectWallet}>
                  Connected
                </button>
              </li>
            )}
<<<<<<< HEAD
=======
            {joined || created == true ? <AddUser /> : ""}
>>>>>>> 09d64b6 (adding push notifications)
            {joined || created == true ? (
              <li className="nav-item">
                <button
                  className="btn btn-light ms-2"
                  onClick={() => {
                    SetJoined(false);
                    SetCreated(false);
<<<<<<< HEAD
=======
                    navigate("/");
                    toast.success("Exited successfully");
>>>>>>> 09d64b6 (adding push notifications)
                  }}
                >
                  Exit
                </button>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
