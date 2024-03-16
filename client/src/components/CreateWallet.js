import React, { useContext, useState } from "react";
import { ParentalContext } from "../ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import { LoadingContext } from "./LoadingContext";
import abi from "../contractJson/CreateWallet.json";
export default function CreateWallet() {
  const { state, setContractAddress, SetCreated, setOwner, connected } =
    useContext(ParentalContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();
  const contractAbi = abi.abi;
  async function Create() {
    if (!connected) {
      toast.error("Connect Wallet!!");
      return;
    }
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = provider.getSigner();
    let address = await signer.getAddress();
    const balance = await provider.getBalance(address);
    const etherBalance = ethers.utils.formatEther(balance);
    console.log(etherBalance);
    if (etherBalance == 0) {
      toast.error("Insufficient Funds!! Check Info Page");
      return;
    }
    let contractRead = new ethers.Contract(
      "0xb65f926c6c420671892561334C289485faC9309E",
      contractAbi,
      provider
    );
    let contract = contractRead.connect(signer);
    console.log(contract);
    const selectedValue = 1442;
    await provider.send("wallet_switchEthereumChain", [
      { chainId: `0x${Number(selectedValue).toString(16)}` },
    ]);
    contractRead.on("created", (contractAddress, event) => {
      console.log(`Created at ${contractAddress}`);
      toast.success("Your Parental Wallet is Created");
      setContractAddress(contractAddress);
      setOwner(address);
      SetCreated(true);
      setLoading(false);
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
    <div>
      <button className="btn btn-light" onClick={Create}>
        Create Wallet
      </button>
    </div>
  );
}
