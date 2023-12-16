import React, { useState } from "react";
import "./Login.css";
export const Setowners = (props) => {
  async function SetOwner() {
    const { contract } = props;
    console.log(contract);
    const address = document.querySelector("#address").value;
    const address2 = document.querySelector("#address2").value;
    const vote = document.querySelector("#vote").value;
    try {
      const tx = await contract.setOwners(props.user, address, address2, vote);
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
        placeholder="Enter the Father address"
        className="form-control"
        // autoComplete="off"
      />
      <input
        type="text"
        id="address2"
        placeholder="Enter the Mother Password"
        className="form-control"
        //   autoComplete="off"
      />
      <input
        type="text"
        id="vote"
        placeholder="No of votes"
        className="form-control"
        autoComplete="off"
      />
      <button className="btn btn-light" onClick={SetOwner}>
        Submit
      </button>
    </div>
  );
};
