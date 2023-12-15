import { ethers } from "ethers";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Header from "./components/Header";
import Router from "./routes/Router";
import abi from "./contractJson/Parental.json";
import "./App.css";
import { Authenication } from "./components/Authenication";
function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
    contractRead: null,
  });
  const [account, setAccount] = useState("not connected");
  const connectWallet = async () => {
    const contractAddress = "0x792A9Fd227C690f02beB23678a52BF766849DFc0";
    const contractABI = abi.abi;
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
      setAccount(accounts);
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const contractRead = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      setState({ provider, signer, contract, contractRead });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="App">
      <Header connectWallet={connectWallet} />
      {/* <Router {...state} />
       */}
      <Authenication {...state} />
    </div>
  );
}
export default App;
