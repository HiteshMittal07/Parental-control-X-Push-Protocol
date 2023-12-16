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
        console.log(tx);
      } else {
        alert("Password Mismatch");
      }
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
      <input
        type="text"
        id="ReEnter"
        placeholder="Re-Enter the Password"
        className="form-control"
      />
      <button className="btn btn-light" onClick={Signup}>
        Submit
      </button>
    </div>
  );
};
