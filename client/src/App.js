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
import Initial from "./components/Initial";

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
    contract2: null,
    contractRead2: null,
  });
  const [created, SetCreated] = useState(null);
  const [joined, SetJoined] = useState(null);
  const [account, setAccount] = useState("not connected");
  const [contractAddress, setContractAddress] = useState(null);
  const connectWallet = async () => {
    const contractAddress = "0xf105C8fA8302e1661fA9c20916f834f13D2252EA";
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

  // async function Subscribe() {
  //   let provider = new ethers.BrowserProvider(window.ethereum);
  //   let signer = await provider.getSigner();
  //   const userAlice = await PushAPI.initialize(signer, {
  //     env: CONSTANTS.ENV.STAGING,
  //   });

  //   // List inbox notifications
  //   const inboxNotifications = await userAlice.notification.list("INBOX");

  //   // List spam notifications
  //   const spamNotifications = await userAlice.notification.list("SPAM");

  //   // Push channel address
  //   const pushChannelAdress = "0x11ae45Ab10039D1EA50A54edd2638200fa3aFaEa";

  //   // Subscribe to push channel
  //   await userAlice.notification.subscribe(
  //     `eip155:11155111:${pushChannelAdress}` // channel address in CAIP format
  //   );
  // }
  return (
    <ParentalContext.Provider
      value={{
        state,
        connectWallet,
        contractAddress,
        setContractAddress,
        state2,
        setState2,
        SetCreated,
        SetJoined,
        joined,
        created,
      }}
    >
      <div className="App">
        <Header />
        {/* <button onClick={Subscribe}>subscribe</button> */}
        {created || joined ? <Router /> : <Initial />}
      </div>
    </ParentalContext.Provider>
  );
}
export default App;
