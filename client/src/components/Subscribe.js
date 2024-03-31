import React, { useContext } from "react";
import { ethers } from "ethers";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { toast } from "react-toastify";
import { ParentalContext } from "../useContext/ParentalContext";
import { getWeb3Provider, switchNetwork } from "../Web3/web3";

export default function Subscribe() {
  const owner = localStorage.getItem("owner");
  async function subscribe() {
    const provider = getWeb3Provider();
    await switchNetwork(11155111);
    const signer = provider.getSigner();
    const userAlice = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.STAGING,
    });

    await userAlice.notification.subscribe(
      `eip155:11155111:${owner}` // channel address in CAIP format
    );

    toast.success("Subscribed successfully");
  }

  return (
    <div className="mt-5 justify-content-center align-content-center align-items-center">
      <h1 className="text-light">Subscribe Channel for Notifications</h1>
      <button className="btn btn-light" onClick={subscribe}>
        Subscribe
      </button>
    </div>
  );
}
