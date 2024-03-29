import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ParentalContext } from "../ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../images/download1.png";
import { FaBell } from "react-icons/fa";
import AddUser from "./AddChild";
import AddOwner from "./AddParent";
import { connected } from "process";
import "./Header.css";
const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const {
    state,
    connectWallet,
    SetJoined,
    SetCreated,
    joined,
    created,
    connected,
  } = useContext(ParentalContext);
  const { contract } = state;
  const navigate = useNavigate();
  // return (
  //   <nav className="navbar navbar-expand-lg sticky-top navbar-dark text-bg-dark bg-transparent">
  //     <div className="container">
  //       {localStorage.getItem("enter") ? (
  //         <Link className="navbar-brand" to="/home">
  //           <img
  //             src={logo}
  //             alt="Logo"
  //             height="100"
  //             width="210"
  //             className="d-inline-block align-top"
  //           />
  //         </Link>
  //       ) : (
  //         <Link className="navbar-brand" to="/">
  //           <img
  //             src={logo}
  //             alt="Logo"
  //             height="100"
  //             width="210"
  //             className="d-inline-block align-top"
  //           />
  //         </Link>
  //       )}
  //       <button
  //         className="navbar-toggler"
  //         data-bs-target="#navDrop"
  //         data-bs-toggle="collapse"
  //         aria-controls="navDrop"
  //         aria-expanded="false"
  //         aria-label="Toggle navigation"
  //       >
  //         <span className="navbar-toggler-icon"></span>
  //       </button>
  //       <div className="collapse navbar-collapse" id="navDrop">
  //         <ul className="navbar-nav ms-auto">
  //           {localStorage.getItem("enter") ? (
  //             <li className="nav-item">
  //               <Link to="/home" className="nav-link">
  //                 Home
  //               </Link>
  //             </li>
  //           ) : (
  //             ""
  //           )}
  //           {localStorage.getItem("enter") ? (
  //             <li className="nav-item">
  //               <Link to="/transaction" className="nav-link">
  //                 Transaction Logs
  //               </Link>
  //             </li>
  //           ) : (
  //             ""
  //           )}
  //           {localStorage.getItem("enter") ? (
  //             <li className="nav-item">
  //               <Link to="/owners" className="nav-link">
  //                 Parents
  //               </Link>
  //             </li>
  //           ) : (
  //             ""
  //           )}
  //           <li className="nav-item">
  //             <Link to="/info" className="nav-link">
  //               Info
  //             </Link>
  //           </li>
  //           {localStorage.getItem("enter") ? (
  //             <li className="nav-item">
  //               <Link to="/notifications" className="nav-link">
  //                 <FaBell style={{ cursor: "pointer" }} />
  //               </Link>
  //             </li>
  //           ) : (
  //             ""
  //           )}
  //           {!connected ? (
  //             <li className="nav-item">
  //               <button className="btn btn-light ms-2" onClick={connectWallet}>
  //                 Connect wallet
  //               </button>
  //             </li>
  //           ) : (
  //             <li className="nav-item">
  //               <button className="btn btn-light ms-2" onClick={connectWallet}>
  //                 Connected
  //               </button>
  //             </li>
  //           )}

  //           {localStorage.getItem("enter") ? <AddUser /> : ""}
  //           {localStorage.getItem("enter") ? <AddOwner /> : ""}
  //           {localStorage.getItem("enter") ? (
  //             <li className="nav-item">
  //               <button
  //                 className="btn btn-light ms-2"
  //                 onClick={() => {
  //                   SetJoined(false);
  //                   SetCreated(false);
  //                   localStorage.removeItem("enter");
  //                   localStorage.removeItem("owner");
  //                   localStorage.removeItem("contractAddr");
  //                   navigate("/");
  //                   toast.success("Exited successfully");
  //                 }}
  //               >
  //                 Exit
  //               </button>
  //             </li>
  //           ) : (
  //             ""
  //           )}
  //         </ul>
  //       </div>
  //     </div>
  //   </nav>
  // );
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
            {/* {localStorage.getItem("enter") ? (
              <li className="nav-item">
                <Link to="/transaction" className="nav-link">
                  Transaction Logs
                </Link>
              </li>
            ) : (
              ""
            )} */}
            {/* {localStorage.getItem("enter") ? (
              <li className="nav-item">
                <Link to="/owners" className="nav-link">
                  Owners
                </Link>
              </li>
            ) : (
              ""
            )} */}
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
            {!connected ? (
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
                >
                  Connected
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
                      Owners
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        SetJoined(false);
                        SetCreated(false);
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
                Connected
              </button>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
