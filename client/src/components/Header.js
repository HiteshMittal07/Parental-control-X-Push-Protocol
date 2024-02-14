import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ParentalContext } from "../ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../images/logo.png";
import { FaBell } from "react-icons/fa";
import AddUser from "./AddUser";
import AddOwner from "./AddOwner";
const Header = () => {
  const { state, connectWallet, SetJoined, SetCreated, joined, created } =
    useContext(ParentalContext);
  const { contract } = state;
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
            {joined || created == true ? <AddUser /> : ""}
            {joined || created == true ? <AddOwner /> : ""}
            {joined || created == true ? (
              <li className="nav-item">
                <button
                  className="btn btn-light ms-2"
                  onClick={() => {
                    SetJoined(false);
                    SetCreated(false);
                    navigate("/");
                    toast.success("Exited successfully");
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