import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CreateChannel from "./CreateChannel";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import Subscribe from "./Subscribe";
import BeatLoader from "react-spinners/BeatLoader";
import NotificationController from "../NotificationController";
import {
  getAddress,
  getContractRead,
  getWeb3Provider,
  switchNetwork,
} from "../Web3/web3";
export default function Notifications() {
  const owner = localStorage.getItem("owner");
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const override = {
    display: "block",
    marginTop: "200px",
  };
  useEffect(() => {
    const provider = getWeb3Provider();
    const contractAddress = getAddress("2442");
    const contractRead = getContractRead(provider, contractAddress);
    const switchChain = async (selectedValue) => {
      await switchNetwork(selectedValue);
    };
    const check = async () => {
      setLoading(true);
      switchChain("2442");
      const address = owner;
      console.log(address);
      try {
        const tx = await contractRead.getNotifyStatus(address);
        if (tx) {
          setStatus(true);
          localStorage.setItem("status", true);
          setLoading(false);
          console.log("set");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const check2 = async () => {
      if (localStorage.getItem("status")) {
        const provider = getWeb3Provider();
        const selectedValue = "11155111";
        await switchNetwork(selectedValue);
        const signer = provider.getSigner();
        const userAlice = await PushAPI.initialize(signer, {
          env: CONSTANTS.ENV.STAGING,
        });
        const address = await signer.getAddress();
        console.log(address);
        const aliceSubscriptions = await userAlice.notification.subscriptions();
        console.log(aliceSubscriptions);
        const isOwnerSubscribed = aliceSubscriptions.some(
          (obj) => obj.channel.toLowerCase() == owner.toLowerCase()
        );
        console.log(isOwnerSubscribed);
        localStorage.setItem("subscribe", isOwnerSubscribed);
        setLoading(false);
      } else {
        return;
      }
    };
    if (!localStorage.getItem("status")) {
      check();
    }
    if (localStorage.getItem("status") && !localStorage.getItem("subscribe")) {
      setLoading(true);
      check2();
    }
  }, [status]);
  return (
    <div className="overflow-x-hidden">
      {loading ? (
        <>
          <BeatLoader color="#ffffff" cssOverride={override} />
          <p className="text-light">fetching channel and subscription...</p>
        </>
      ) : (
        <>
          {localStorage.getItem("status") ? (
            localStorage.getItem("subscribe") ? (
              <NotificationController />
            ) : (
              <Subscribe />
            )
          ) : (
            <CreateChannel />
          )}
        </>
      )}
    </div>
  );
}
