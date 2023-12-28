import { useContext } from "react";
import { Link } from "react-router-dom";
import { ParentalContext } from "../ParentalContext";

const Header = () => {
  const {state,connectWallet}=useContext(ParentalContext);
  const {contract}=state;
  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-dark text-bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <h5 className="brand-name">Parental Control</h5>
        </Link>
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
            {contract == null ? (
              <li className="nav-item">
                <button
                  className="btn btn-light ms-2"
                  onClick={connectWallet}
                >
                  Connect wallet
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <button
                  className="btn btn-light ms-2"
                  onClick={connectWallet}
                >
                  Connected
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
