// import * as PushSDK from "@pushprotocol/restapi";
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";

import "bootstrap/dist/css/bootstrap.css";
import Header from "./components/Header";
import Router from "./routes/Router";
import abi from "./contractJson/CreateWallet.json";
import abi2 from "./contractJson/push.json";
import "./App.css";
import { ParentalContext } from "./ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationInterface from "./NotificationInterface";
import CreateWallet from "./components/CreateWallet";
import JoinWallet from "./components/JoinWallet";
import Initial from "./components/Initial";
function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
    contractRead: null,
  });

  const [created, SetCreated] = useState(null);
  const [connected, setConnected] = useState(false);
  const [joined, SetJoined] = useState(null);
  const [account, setAccount] = useState("not connected");
  const [contractAddress, setContractAddress] = useState(null);
  const [owner, setOwner] = useState(null);
  const selectedValue = 1442;
  const chainId = `0x${Number(selectedValue).toString(16)}`; // Chain ID of the network you want to add
  const rpcUrl = "https://rpc.public.zkevm-test.net/"; // RPC URL of the network
  const networkParams = {
    chainId: chainId,
    chainName: "Polygon zkEVM Testnet", // Network name
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [rpcUrl],
    blockExplorerUrls: ["https://explorer.public.zkevm-test.net/"], // Block explorer URL
  };
  const connectWallet = async () => {
    const contractAddress = "0x384cc0998C42FAb018Bf622171902261A7633937";
    const contractABI = abi.abi;
    try {
      const { ethereum } = window;
      ethereum
        .request({
          method: "wallet_addEthereumChain",
          params: [networkParams],
        })
        .then(() => {
          console.log("Custom network added to MetaMask");
        })
        .catch((error) => {
          console.error("Failed to add custom network to MetaMask:", error);
        });
      let provider = new ethers.providers.Web3Provider(ethereum);
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      let signer = provider.getSigner();
      let contract = new ethers.Contract(contractAddress, contractABI, signer);
      let contractRead = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      ethereum.on("accountsChanged", async () => {
        const updatedAccounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(updatedAccounts);
        provider = new ethers.providers.Web3Provider(ethereum);
        signer = provider.getSigner();
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
      setConnected(true);
      toast.success("Connected successfully");
    } catch (error) {
      alert(error);
    }
  };
  return (
    <ParentalContext.Provider
      value={{
        state,
        setState,
        connectWallet,
        contractAddress,
        setContractAddress,
        SetCreated,
        SetJoined,
        joined,
        created,
        connected,
        owner,
        setOwner,
      }}
    >
      <div className="App">
        <Header />
        {/* <button onClick={send}>send</button> */}
        <Router />
      </div>
    </ParentalContext.Provider>
  );
}

export default App;
