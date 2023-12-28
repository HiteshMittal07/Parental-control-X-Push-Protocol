import React, { useContext } from "react";
import { ParentalContext } from "../ParentalContext";
import abi from "../contractJson/Parental.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
export default function AddUser() {
  const { state } = useContext(ParentalContext);
  async function Adduser() {
    const { contractAddress } = state;
    const contractABI = abi.abi;
    let provider = new ethers.BrowserProvider(window.ethereum);
    let signer = await provider.getSigner();
    let contract = new ethers.Contract(contractAddress, contractABI, signer);
    const address = document.querySelector("#address").value;
    const tx = await contract.addUser(address);
    await tx.wait();
    toast.success("User added Successfully");
  }
  return (
    <div>
      <h1 className="text-center mt-5">Add User</h1>
      <form
        onSubmit={Adduser}
        className="d-flex flex-column align-items-center"
      >
        <input
          type="text"
          id="address"
          placeholder="Enter user's wallet address"
        />
        <br />
        <button onClick={Adduser} className="btn btn-primary col-4 mt-3">
          Set Owner
        </button>
      </form>
    </div>
  );
}
