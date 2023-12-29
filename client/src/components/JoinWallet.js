import React, { useContext } from "react";
import { ParentalContext } from "../ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abi from "../contractJson/Parental.json";
import abi2 from "../contractJson/CreateWallet.json";
export default function JoinWallet() {
  const { state, setContractAddress, setState2 } = useContext(ParentalContext);
  async function join() {
    const { contractRead } = state;
    console.log(contractRead);
    const contractABI = abi.abi;
    const contractAbi = abi2.abi;
    try {
      let provider = new ethers.BrowserProvider(window.ethereum);
      let signer = await provider.getSigner();
      const add = document.querySelector("#addr").value;
      const tx = await contractRead.joinWallet(add, signer.address);
      if (tx[1] == true) {
        setContractAddress(tx[0]);
        toast.success("Joined successfully");
      } else {
        toast.success("This User can't join the system");
        return;
      }
      let contract2 = new ethers.Contract(tx[0], contractABI, signer);
      let contractRead2 = new ethers.Contract(tx[0], contractABI, provider);
      setState2(provider, signer, contract2, contractRead2);
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
