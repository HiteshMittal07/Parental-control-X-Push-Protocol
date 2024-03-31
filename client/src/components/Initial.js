import React, { useState } from "react";
import CreateWallet from "./CreateWallet";
import JoinWallet from "./JoinWallet";
import BeatLoader from "react-spinners/BeatLoader";
import { LoadingContext } from "../useContext/LoadingContext";
import "../Styles/initial.css";
export default function Initial() {
  const [loading, setLoading] = useState(false);
  const override = {
    display: "block",
    marginTop: "200px",
  };
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <div>
        {loading ? (
          <>
            <BeatLoader color="#ffffff" cssOverride={override} />
            <p className="text-light">Entering Wallet...</p>
          </>
        ) : (
          <div className="container">
            <div className="Iam">
              <p className="heading">
                With <br />
                Parental Control
              </p>
              <b>
                <div className="innerIam">
                  Empowering Parents
                  <br />
                  Safeguarding Futures
                  <br />
                  Shielding Innocence
                  <br />
                </div>
              </b>
            </div>
            <div className="button-container text-center mt-3">
              <div className="button-wrapper">
                <div className="button-item">
                  <CreateWallet />
                </div>
                <div className="button-item">
                  <JoinWallet />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LoadingContext.Provider>
  );
}
