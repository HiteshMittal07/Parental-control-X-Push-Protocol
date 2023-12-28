import React, { useContext } from "react";
import { ParentalContext } from "../ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function CreateWallet() {
  const { state, setContractAddress, contractAddress } =
    useContext(ParentalContext);
  async function Create() {
    const { contract, contractRead } = state;
    contractRead.on("created", (contractAddress) => {
      console.log(`Created at ${contractAddress}`);
      setContractAddress(contractAddress);
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
