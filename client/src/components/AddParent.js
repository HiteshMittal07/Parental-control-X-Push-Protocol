import React, { useContext, useState } from "react";
import { ParentalContext } from "../ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abi from "../contractJson/Parental.json";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
export default function AddOwner() {
  const contractAddress = localStorage.getItem("contractAddr");
  const owner = localStorage.getItem("owner");
  const contractABI = abi.abi;
  async function addOwner() {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    const selectedValue = 1442;
    await provider.send("wallet_switchEthereumChain", [
      { chainId: `0x${Number(selectedValue).toString(16)}` },
    ]);
    let signer = provider.getSigner();
    let contractRead2 = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    let contract = contractRead2.connect(signer);
    const address = document.querySelector("#address").value;
    try {
      const tx = await contract.addParent(address);
      await tx.wait();
      await provider.send("wallet_switchEthereumChain", [
        { chainId: "0xAA36A7" },
      ]);
      const userAlice = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.STAGING,
        filter: {
          channels: [`${owner}`],
        },
        account: `${owner}`,
      });
      const addedDelegate = await userAlice.channel.delegate.add(
        `eip155:11155111:${address}`
      );
      await userAlice.channel.send(
        [`${address}`],
        {
          notification: {
            title: "Hey User",
            body: "You have been successfully added to Wallet!",
          },
        },
        toast.success("send successfully")
      );
    } catch (error) {
      toast.error(error.reason);
    }
    toast.success("Parent added Successfully");
  }

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
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
      <div className="input-group mb-1">
        <button className="btn btn-danger add-btn" onClick={addOwner}>
          Add
        </button>
      </div>
    </div>
  );
}
