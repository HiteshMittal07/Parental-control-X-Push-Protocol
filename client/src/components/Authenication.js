import React from "react";
import { Signup } from "./Signup";
import Login from "./Login";
import { useState } from "react";
import { Setowners } from "./Setowners";
export const Authenication = (props) => {
  const [showLogin, setShowLogin] = useState(true);

  const showLoginComponent = () => {
    if (!showLogin) {
      setShowLogin(true);
    }
  };

  const showSignupComponent = () => {
    if (showLogin) {
      setShowLogin(false);
    }
  };

  return (
    <div>
      <h2 className="text-light" style={{ cursor: "pointer" }}>
        <span onClick={showLoginComponent}>Login</span>/
        <span onClick={showSignupComponent}>Signup</span>
      </h2>
      {showLogin ? (
        <Login {...props} user={props.user} handleUser={props.handleUser} />
      ) : props.sign ? (
        <Setowners {...props} />
      ) : (
        <Signup
          {...props}
          user={props.user}
          handleUser={props.handleUser}
          handleSign={props.handleSign}
        />
      )}
    </div>
  );
};
