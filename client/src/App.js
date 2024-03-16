import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Header from "./components/Header";
import Router from "./routes/Router";
import abi from "./contractJson/CreateWallet.json";
import "./App.css";
import { ParentalContext } from "./ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sign } from "@pushprotocol/restapi/src/lib/chat/helpers";
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
    if (!window.ethereum) {
      toast.error("first install the metamask");
      window.location.href = "https://metamask.io/download/";
      return;
    }
    // const contractAddress = "0x384cc0998C42FAb018Bf622171902261A7633937";
    const contractAddress = "0xb65f926c6c420671892561334C289485faC9309E";
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

      window.ethereum.on("disconnect", (error) => {
        console.error("Disconnected from the wallet:", error);
        setConnected(false);
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
        <Router />
      </div>
    </ParentalContext.Provider>
  );
}

export default App;
