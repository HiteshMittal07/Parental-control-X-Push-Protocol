import React, { useContext, useState, useEffect } from "react";
import { ParentalContext } from "../useContext/ParentalContext";
import { ethers } from "ethers";
import abi from "../contractJson/CreateWallet.json";
import NotificationInterface from "../NotificationInterface";
import CreateChannel from "./CreateChannel";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import Subscribe from "./Subscribe";
import BeatLoader from "react-spinners/BeatLoader";
import NotificationController from "../NotificationController";
export default function Notifications() {
  const owner = localStorage.getItem("owner");
  const [status, setStatus] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const contractABI = abi.abi;
  const [loading, setLoading] = useState(false);
  const override = {
    display: "block",
    marginTop: "200px",
  };
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractABI = abi.abi;
    const contractRead = new ethers.Contract(
      "0xb65f926c6c420671892561334C289485faC9309E",
      contractABI,
      provider
    );
    const switchChain = async (selectedValue) => {
      await provider.send("wallet_switchEthereumChain", [
        { chainId: `0x${Number(selectedValue).toString(16)}` },
      ]);
    };
    const check = async () => {
      setLoading(true);
      switchChain(1442);
      const address = owner;
      console.log(address);
      try {
        const tx = await contractRead.getNotifyStatus(address);
        if (tx) {
          setStatus(true);
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
      if (status == true) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const selectedValue = 11155111;
        await provider.send("wallet_switchEthereumChain", [
          { chainId: `0x${Number(selectedValue).toString(16)}` },
        ]);
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
        setSubscribed(isOwnerSubscribed);
        setLoading(false);
      } else {
        return;
      }
    };
    if (status == false) {
      check();
    }
    if (status == true && subscribed == false) {
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
          {status ? (
            subscribed ? (
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
