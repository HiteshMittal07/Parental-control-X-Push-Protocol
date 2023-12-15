import React from "react";
import "./Login.css";
export default function Login(props) {
  async function login() {
    const { contract } = props;
    const address = document.querySelector("#address").value;
    const Pass = document.querySelector("#SetPass").value;
    try {
      const tx = await contract.Login(address, Pass.toString());
      await tx.wait();
    } catch (error) {
      alert(error);
    }
  }
  return (
    <div className="form-box">
      <input
        type="text"
        id="address"
        placeholder="Enter the Family address"
        className="form-control"
      />
      <input
        type="text"
        id="SetPass"
        placeholder="Enter the Password"
        className="form-control"
      />
      <button className="btn btn-light" onClick={login}>
        Login
      </button>
    </div>
  );
}
