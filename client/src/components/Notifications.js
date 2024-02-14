import React, { useContext, useState, useEffect } from "react";
import { ParentalContext } from "../ParentalContext";
import { ethers } from "ethers";
import abi from "../contractJson/CreateWallet.json";
import NotificationInterface from "../NotificationInterface";
import CreateChannel from "./CreateChannel";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import Subscribe from "./Subscribe";
import BeatLoader from "react-spinners/BeatLoader";
import NotificationController from "../NotificationController";
export default function Notifications() {
  const { owner } = useContext(ParentalContext);
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
    const contractRead = new ethers.Contract(
      "0x384cc0998C42FAb018Bf622171902261A7633937",
      contractABI,
      provider
    );
    const check = async () => {
      setLoading(true);
      const selectedValue = 1442;
      await provider.send("wallet_switchEthereumChain", [
        { chainId: `0x${Number(selectedValue).toString(16)}` },
      ]);
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
        await provider.send("wallet_switchEthereumChain", [
          { chainId: "0xAA36A7" },
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
    <div>
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
