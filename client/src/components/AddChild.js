import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getParentalContractRead,
  getUser,
  getWeb3Provider,
  sendNotification,
  switchNetwork,
} from "../Web3/web3";

export default function AddUser() {
  const contractAddress = localStorage.getItem("contractAddr");
  const owner = localStorage.getItem("owner");
  async function Adduser() {
    let provider = getWeb3Provider();
    const selectedValue = "2442";
    await switchNetwork(selectedValue);
    let signer = provider.getSigner();
    let contractRead = getParentalContractRead(provider, contractAddress);
    let contract = contractRead.connect(signer);
    const address = document.querySelector("#address").value;
    try {
      const tx = await contract.addChild(address);
      await tx.wait();
      await switchNetwork("11155111");
      const userAlice = await getUser(signer, owner);
      const addedDelegate = await userAlice.channel.delegate.add(
        `eip155:11155111:${address}`
      );
      const title = "New Child Added";
      const body = `${address} successfully added to Wallet!`;
      await sendNotification(userAlice, title, body);
      toast.success("send successfully");
    } catch (error) {
      toast.error(error.reason);
    }
    toast.success("User added Successfully");
  }

  return (
    <div>
      <div className="input-group mb-1">
        <input
          type="text"
          id="address"
          placeholder="Enter the Child Address here"
          className="form-control custom-input"
        />
      </div>
      <div className="input-group mb-1">
        <button className="btn btn-danger add-btn" onClick={Adduser}>
          Add
        </button>
      </div>
    </div>
  );
}
