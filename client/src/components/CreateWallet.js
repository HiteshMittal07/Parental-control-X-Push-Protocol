import React, { useContext, useState } from "react";
import { ParentalContext } from "../useContext/ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import { LoadingContext } from "../useContext/LoadingContext";
import "../Styles/initial.css";
import {
  getAddress,
  getContractRead,
  getWeb3Provider,
  switchNetwork,
} from "../Web3/web3";
export default function CreateWallet() {
  const { connected } = useContext(ParentalContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();
  async function Create() {
    if (!connected) {
      toast.error("Connect Wallet!!");
      return;
    }
    let provider = getWeb3Provider();
    let signer = provider.getSigner();
    let address = await signer.getAddress();
    const balance = await provider.getBalance(address);
    const etherBalance = ethers.utils.formatEther(balance);
    console.log(etherBalance);
    if (etherBalance == 0) {
      toast.error("Insufficient Funds!! Check Info Page");
      return;
    }
    const contractAddress = getAddress("1442");
    let contractRead = getContractRead(provider, contractAddress);
    let contract = contractRead.connect(signer);
    const selectedValue = 1442;
    await switchNetwork(selectedValue);
    contractRead.on("created", (contractAddress, event) => {
      console.log(`Created at ${contractAddress}`);
      toast.success("Your Parental Wallet is Created");
      localStorage.setItem("owner", address);
      localStorage.setItem("enter", "true");
      localStorage.setItem("contractAddr", contractAddress);
      navigate("/home");
      event.removeListener();
    });
    try {
      setLoading(true);
      const tx = await contract.CreateParentalWallet();
      await tx.wait();
    } catch (error) {
      setLoading(false);
      toast.error(error.reason);
    }
  }
  return (
    <div className="col-6">
      <button className="btn btn-outline-secondary custom-btn" onClick={Create}>
        Create Wallet
      </button>
    </div>
  );
}
