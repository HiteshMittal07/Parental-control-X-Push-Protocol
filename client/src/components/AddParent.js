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
export default function AddOwner() {
  const contractAddress = localStorage.getItem("contractAddr");
  const owner = localStorage.getItem("owner");
  async function addOwner() {
    let provider = getWeb3Provider();
    const selectedValue = "534351";
    await switchNetwork(selectedValue);
    let signer = provider.getSigner();
    let contractRead2 = getParentalContractRead(provider, contractAddress);
    let contract = contractRead2.connect(signer);
    const address = document.querySelector("#address").value;
    try {
      const tx = await contract.addParent(address);
      await tx.wait();
      await switchNetwork("11155111");
      const userAlice = await getUser(signer, owner);
      const addedDelegate = await userAlice.channel.delegate.add(
        `eip155:11155111:${address}`
      );
      const title = "New Parent Added";
      const body = `${address} successfully added to Wallet!`;
      await sendNotification(userAlice, title, body);
      toast.success("send successfully");
    } catch (error) {
      toast.error(error.reason);
    }
    toast.success("Parent added Successfully");
  }
  async function removeOwner() {
    let provider = getWeb3Provider();
    const selectedValue = "534351";
    await switchNetwork(selectedValue);
    let signer = provider.getSigner();
    let contractRead2 = getParentalContractRead(provider, contractAddress);
    let contract = contractRead2.connect(signer);
    const address = document.querySelector("#address").value;
    try {
      const tx = await contract.removeParent(address);
      await tx.wait();
      await switchNetwork("11155111");
      const userAlice = await getUser(signer, owner);
      const addedDelegate = await userAlice.channel.delegate.add(
        `eip155:11155111:${address}`
      );
      const title = "Parent Removed!!";
      const body = `${address} successfully removed from Wallet!`;
      await sendNotification(userAlice, title, body);
      toast.success("send successfully");
    } catch (error) {
      toast.error(error.reason);
      console.log(error);
      return;
    }
    toast.success("Parent Removed Successfully");
  }
  return (
    <div>
      <div className="input-group mb-1">
        <input
          type="text"
          id="address"
          placeholder="Enter the Parent Address here"
          className="form-control custom-input"
        />
      </div>
      <div className="input-group mb-1 d-flex justify-content-between">
        <button className="btn btn-danger add-btn" onClick={addOwner}>
          Add
        </button>
        <button className="btn btn-danger add-btn" onClick={removeOwner}>
          Remove
        </button>
      </div>
    </div>
  );
}
