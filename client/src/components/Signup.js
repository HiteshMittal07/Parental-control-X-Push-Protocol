import React, { useState } from "react";
import "./Login.css";
export const Signup = (props) => {
  async function Signup() {
    const { contract } = props;
    console.log(contract);
    const address = document.querySelector("#address").value;
    const Setpass = document.querySelector("#SetPass").value;
    const Repass = document.querySelector("#ReEnter").value;
    try {
      if (Setpass === Repass) {
        const tx = await contract.SignUp(address, Setpass.toString());
        await tx.wait();
        props.handleUser(address);
        props.handleSign(true);
        console.log(tx);
      } else {
        alert("Password Mismatch");
      }
    } catch (error) {
      alert(error);
    }
  }

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [inputType, setInputType] = useState("password");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    setInputType(passwordVisible ? "password" : "text");
  };
  return (
    <div className="form-box">
      <input
        type="text"
        id="address"
        placeholder="Enter the Family address"
        className="form-control"
      />
      <div className="password-input-container">
        <input
          type={inputType}
          id="SetPass"
          placeholder="Enter the Password"
          className="form-control"
          autoComplete="off"
        />
        <button onClick={togglePasswordVisibility} className="eye-button">
          {passwordVisible ? "Hide" : "Show"}
        </button>
      </div>
      <div className="password-input-container">
        <input
          type={inputType}
          id="ReEnter"
          placeholder="Re-Enter the Password"
          className="form-control"
          autoComplete="off"
        />
        <button onClick={togglePasswordVisibility} className="eye-button">
          {passwordVisible ? "Hide" : "Show"}
        </button>
      </div>
      <button className="btn btn-dark" onClick={Signup}>
        Next
      </button>
    </div>
  );
};
