import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ParentalContext } from "../useContext/ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../images/download1.png";
import { FaBell } from "react-icons/fa";
import "../Styles/Header.css";
import { getWeb3Provider, requestAccounts } from "../Web3/web3";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [account, setAccount] = useState(null);
  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const { setConnected } = useContext(ParentalContext);
  const navigate = useNavigate();
  const truncateWalletAddress = async (address, length = 4) => {
    if (!address) return "";
    const start = address.substring(0, length);
    const end = address.substring(address.length - length);
    setAccount(`${start}...${end}`);
    setConnected(true);
  };
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = getWeb3Provider();
      const address = await requestAccounts(provider);
      truncateWalletAddress(address);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const connect = async () => {
      const provider = getWeb3Provider();
      const address = await requestAccounts(provider);
      truncateWalletAddress(address);
    };
    connect();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-dark text-bg-dark bg-transparent">
      <div className="container">
        {localStorage.getItem("enter") ? (
          <Link className="navbar-brand" to="/home">
            <img
              src={logo}
              alt="Logo"
              height="100"
              width="210"
              className="d-inline-block align-top"
            />
          </Link>
        ) : (
          <Link className="navbar-brand" to="/">
            <img
              src={logo}
              alt="Logo"
              height="100"
              width="210"
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
            {localStorage.getItem("enter") ? (
              <li className="nav-item">
                <Link to="/home" className="nav-link">
                  Home
                </Link>
              </li>
            ) : (
              ""
            )}

            <li className="nav-item">
              <Link to="/info" className="nav-link">
                Info
              </Link>
            </li>
            {localStorage.getItem("enter") ? (
              <li className="nav-item">
                <Link to="/notifications" className="nav-link">
                  <FaBell style={{ cursor: "pointer" }} />
                </Link>
              </li>
            ) : (
              ""
            )}
            {!account ? (
              <button
                className="btn btn-outline-secondary custom__button"
                onClick={connectWallet}
              >
                Connect wallet
              </button>
            ) : localStorage.getItem("enter") ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary custom__button"
                  type="button"
                  onClick={toggleDropDown}
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {account} <ArrowDropDownIcon />
                </button>
                <ul
                  className={`dropdown-menu ${
                    dropdownOpen ? "show" : ""
                  } custom-dropdown-menu`}
                >
                  <li>
                    <Link to="/transaction" className="dropdown-item">
                      Transaction Logs
                    </Link>
                  </li>
                  <li>
                    <Link to="/owners" className="dropdown-item">
                      Parents
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        localStorage.removeItem("enter");
                        localStorage.removeItem("owner");
                        localStorage.removeItem("contractAddr");
                        navigate("/");
                        toast.success("Exited successfully");
                      }}
                    >
                      Exit
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                className="btn btn-outline-secondary custom__button"
                onClick={connectWallet}
              >
                {account}
              </button>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
