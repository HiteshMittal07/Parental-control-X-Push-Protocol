import React from "react";
import "./Login.css";
import { useState } from "react";
export default function Login(props) {
  async function login() {
    const { contract } = props;
    const address = document.querySelector("#address").value;
    const Pass = document.querySelector("#SetPass").value;
    try {
      const tx = await contract.Login(address, Pass.toString());
      await tx.wait();
      props.handleUser(address);
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
      <button className="btn btn-light" onClick={login}>
        Login
      </button>
    </div>
  );
}
