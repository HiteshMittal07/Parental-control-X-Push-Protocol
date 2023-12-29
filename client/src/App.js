import { ethers } from "ethers";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Header from "./components/Header";
import Router from "./routes/Router";
import abi from "./contractJson/CreateWallet.json";
import "./App.css";
import { ParentalContext } from "./ParentalContext";
import { toast } from "react-toastify";
import CreateWallet from "./components/CreateWallet";
import JoinWallet from "./components/JoinWallet";

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
    contractRead: null,
  });
  const [state2, setState2] = useState({
    provider: null,
    signer: null,
    contract: null,
    contractRead: null,
  });
  const [account, setAccount] = useState("not connected");
  const [contractAddress, setContractAddress] = useState(null);
  const connectWallet = async () => {
    const contractAddress = "0x47bddd760827Dd351968A3c03aAdb7A747776FF3";
    const contractABI = abi.abi;
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      let provider = new ethers.BrowserProvider(ethereum);
      let signer = await provider.getSigner();
      let contract = new ethers.Contract(contractAddress, contractABI, signer);
      let contractRead = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      window.ethereum.on("accountsChanged", async () => {
        provider = new ethers.BrowserProvider(ethereum);
        signer = await provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        contractRead = new ethers.Contract(
          contractAddress,
          contractABI,
          provider
        );
        setState({ provider, signer, contract, contractRead });
      });
      setAccount(accounts);
      setState({ provider, signer, contract, contractRead });
      toast.success("Connected successfully");
    } catch (error) {
      alert(error);
    }
  };
  return (
    <ParentalContext.Provider
      value={{
        state,
        connectWallet,
        contractAddress,
        setContractAddress,
        state2,
        setState2,
      }}
    >
      <div className="App">
        <Header />
        <CreateWallet />
        <JoinWallet />
      </div>
    </ParentalContext.Provider>
  );
}
export default App;
