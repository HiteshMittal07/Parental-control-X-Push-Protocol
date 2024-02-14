import React, { useContext, useState } from "react";
import { ParentalContext } from "../ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import { LoadingContext } from "./LoadingContext";
export default function CreateWallet() {
  const { state, setContractAddress, SetCreated, connected , setOwner} =
    useContext(ParentalContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();
  async function Create() {
    if(!connected){
      toast.error("Connect Wallet!!");
      return;
    }
    const { contract, contractRead } = state;
    console.log(contract);
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer=provider.getSigner();
    let address=await signer.getAddress();
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
      navigate("/home");
      event.removeListener();
    });
    try {
      setLoading(true);
      const tx = await contract.CreateParentalWallet();
      await tx.wait();
    } catch (error) {
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
