import { ethers } from "ethers";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Header from "./components/Header";
import Router from "./routes/Router";
import abi from "./contractJson/CreateWallet.json";
import abi2 from "./contractJson/Parental.json";
import "./App.css";
import { ParentalContext } from "./ParentalContext";
function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
    contractRead: null,
  });
  const [account, setAccount] = useState("not connected");
  const [contractAddress, setContractAddress] = useState(null);
  const connectWallet = async () => {
    const contractAddress = "0x8C05cf4cF1ED1f3bC9a12E74D3e5BF336e69e5A1";
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
    } catch (error) {
      alert(error);
    }
  };
  return (
    <ParentalContext.Provider
      value={{ state, connectWallet, contractAddress, setContractAddress }}
    >
      <div className="App">
        <Header />
      </div>
    </ParentalContext.Provider>
  );
}
export default App;
