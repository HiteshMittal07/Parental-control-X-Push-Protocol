import React, { useContext } from "react";
import { ParentalContext } from "../ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abi2 from "../contractJson/Parental.json";
export default function CreateWallet() {
  const { state, setContractAddress, setState2, SetCreated } =
    useContext(ParentalContext);
  async function Create() {
    const contractABI = abi2.abi;
    const { contract, contractRead } = state;
    console.log(contract);
    contractRead.on("created", async (contractAddress, event) => {
      console.log(`Created at ${contractAddress}`);
      setContractAddress(contractAddress);
      let provider = new ethers.BrowserProvider(window.ethereum);
      let signer = await provider.getSigner();
      let contract2 = new ethers.Contract(contractAddress, contractABI, signer);
      let contractRead2 = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      setState2({ provider, signer, contract2, contractRead2 });
      SetCreated(true);
      event.removeListener();
    });
    const address = document.querySelector("#address").value;
    const tx = await contract.CreateParentalWallet(address);
    await tx.wait();
    toast.success("Your Parental Wallet is Created");
  }

  return (
    <div>
      <h2>Create Parental Wallet</h2>
      <input type="text" placeholder="enter other owner address" id="address" />
      <button onClick={Create}>Create</button>
    </div>
  );
}
