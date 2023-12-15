import React from "react";
import { Signup } from "./Signup";
import Login from "./Login";
import { useState } from "react";
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
      <h2 className="text-light">
        <span onClick={showLoginComponent}>Login</span>/
        <span onClick={showSignupComponent}>Signup</span>
      </h2>
      {showLogin ? <Login {...props} /> : <Signup {...props} />}
    </div>
  );
};
