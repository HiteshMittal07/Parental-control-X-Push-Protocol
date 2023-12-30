import React, { useContext } from "react";
import { ParentalContext } from "../ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abi from "../contractJson/Parental.json";
export default function JoinWallet() {
  const { state, setContractAddress, setState2, SetJoined } =
    useContext(ParentalContext);
  async function join() {
    const { contractRead, contract } = state;
    // console.log(contractRead);
    const contractABI = abi.abi;
    try {
      contractRead.on("joined", (contractAddress, event) => {
        setContractAddress(contractAddress);
        toast.success("Joined Successfully");
        let contract2 = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let contractRead2 = new ethers.Contract(
          contractAddress,
          contractABI,
          provider
        );

        contractRead2.on("", () => {});
        contractRead2.on("", () => {});
        contractRead2.on("", () => {});
        // console.log(contractRead2);
        setState2({ provider, signer, contract2, contractRead2 });
        SetJoined(true);
        event.removeListener();
      });
      let provider = new ethers.BrowserProvider(window.ethereum);
      let signer = await provider.getSigner();
      const add = document.querySelector("#addr").value;
      const tx = await contract.joinWallet(add);
      await tx.wait();
    } catch (error) {
      toast.error(error.reason);
    }
  }
  return (
    <div>
      <input type="text" placeholder="enter owner address" id="addr" />
      <button onClick={join}>Join</button>
    </div>
  );
}
