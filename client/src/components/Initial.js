<<<<<<< HEAD
import React from "react";
import CreateWallet from "./CreateWallet";
import JoinWallet from "./JoinWallet";

export default function Initial() {
  return <div>
    <CreateWallet/>
    <JoinWallet/>
  </div>;
=======
import React, { useState } from "react";
import CreateWallet from "./CreateWallet";
import JoinWallet from "./JoinWallet";
import BeatLoader from "react-spinners/BeatLoader";
import { LoadingContext } from "./LoadingContext";

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
          <div>
            <h1
              className="text-light fw-bolder mb-5"
              style={{ fontSize: "70px", marginTop: "70px" }}
            >
              About Parental Control
            </h1>
            <h3 style={{ color: "white" }} className="mb-5">
              Parental control is a web application designed to provide parents{" "}
              <br />
              with the ability to monitor and manage their child's transactions.
              <br /> It allows parents to set limits on various aspects of
              <br />
              funds use, such as website access or specific apps
            </h3>
            <div className="row justify-content-center">
              <div className="col-1">
                <CreateWallet />
              </div>
              <div className="col-1">
                <JoinWallet />
              </div>
            </div>
          </div>
        )}
      </div>
    </LoadingContext.Provider>
  );
>>>>>>> 09d64b6 (adding push notifications)
}
