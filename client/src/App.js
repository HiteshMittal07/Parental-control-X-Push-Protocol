<<<<<<< HEAD
import { ethers } from "ethers";
import { useState, useEffect } from "react";
=======
// import * as PushSDK from "@pushprotocol/restapi";
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";

>>>>>>> 09d64b6 (adding push notifications)
import "bootstrap/dist/css/bootstrap.css";
import Header from "./components/Header";
import Router from "./routes/Router";
import abi from "./contractJson/CreateWallet.json";
<<<<<<< HEAD
import "./App.css";
import { ParentalContext } from "./ParentalContext";
import { toast } from "react-toastify";
import CreateWallet from "./components/CreateWallet";
import JoinWallet from "./components/JoinWallet";
import Initial from "./components/Initial";

=======
import abi2 from "./contractJson/push.json";
import "./App.css";
import { ParentalContext } from "./ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationInterface from "./NotificationInterface";
import CreateWallet from "./components/CreateWallet";
import JoinWallet from "./components/JoinWallet";
import Initial from "./components/Initial";
>>>>>>> 09d64b6 (adding push notifications)
function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
    contractRead: null,
  });
<<<<<<< HEAD
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
=======
  const [created, SetCreated] = useState(null);
  const [connected, setConnected] = useState(false);
  const [joined, SetJoined] = useState(null);
  const [account, setAccount] = useState("not connected");
  const [contractAddress, setContractAddress] = useState(null);

  const connectWallet = async () => {
    const contractAddress = "0x35895eCD2Cf81F0f9ccc5B621d465484149D026D";
    const contractABI = abi.abi;
    try {
      const { ethereum } = window;
      let provider = new ethers.providers.Web3Provider(ethereum);
      const selectedValue = 1442;
      await provider.send("wallet_switchEthereumChain", [
        { chainId: `0x${Number(selectedValue).toString(16)}` },
      ]);
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      let signer = provider.getSigner();
>>>>>>> 09d64b6 (adding push notifications)
      let contract = new ethers.Contract(contractAddress, contractABI, signer);
      let contractRead = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
<<<<<<< HEAD
      window.ethereum.on("accountsChanged", async () => {
        provider = new ethers.BrowserProvider(ethereum);
        signer = await provider.getSigner();
=======

      ethereum.on("accountsChanged", async () => {
        const updatedAccounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(updatedAccounts);
        provider = new ethers.providers.Web3Provider(ethereum);
        signer = provider.getSigner();
>>>>>>> 09d64b6 (adding push notifications)
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        contractRead = new ethers.Contract(
          contractAddress,
          contractABI,
          provider
        );
        setState({ provider, signer, contract, contractRead });
      });
<<<<<<< HEAD
      setAccount(accounts);
      setState({ provider, signer, contract, contractRead });
=======

      setAccount(accounts);
      setState({ provider, signer, contract, contractRead });
      setConnected(true);
>>>>>>> 09d64b6 (adding push notifications)
      toast.success("Connected successfully");
    } catch (error) {
      alert(error);
    }
  };

<<<<<<< HEAD
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
=======
  async function send() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userAlice = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.STAGING,
    });
    // const pushChannelAddress = "0x031476AA8fca4F61f9383D14a631AAdb5f530982";
    // await userAlice.channel.send(
    //   ["*"],
    //   {
    //     notification: {
    //       title: "Hey there",
    //       body: "Web3 native notification!",
    //     },
    //   },
    //   toast.success("send successfully")
    // );
    // console.log(userAlice.channel);
    const info = await userAlice.channel.info();
  }
  const sendNotificationWithDelegate = async () => {
    // const delegateAddress = 'eip155:11155111:0xA1897451FC8A83aaF66d5303729C6220cf415a2c';
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const delegateSigner = provider.getSigner();
    console.log(delegateSigner);
    const userAlice = await PushAPI.initialize(delegateSigner, {
      env: CONSTANTS.ENV.STAGING,
      filter: {
        channels: ["0x11ae45Ab10039D1EA50A54edd2638200fa3aFaEa"],
      },
      account: "0x11ae45Ab10039D1EA50A54edd2638200fa3aFaEa",
    });
    // console.log(userAlice.channel);
    //   const info=await userAlice.channel.info();
    // console.log(info);
    const sendNotificationResponse = await userAlice.channel.send(
      ["0x11ae45Ab10039D1EA50A54edd2638200fa3aFaEa"],
      {
        notification: {
          title: "Hey there",
          body: "Web3 native notification!",
        },
      }
    );
    const inboxNotifications = await userAlice.notification.list("INBOX");
    console.log(inboxNotifications);
    // console.log('Notification sent successfully:', sendNotificationResponse);
  };

>>>>>>> 09d64b6 (adding push notifications)
  return (
    <ParentalContext.Provider
      value={{
        state,
<<<<<<< HEAD
        connectWallet,
        contractAddress,
        setContractAddress,
        state2,
        setState2,
=======
        setState,
        connectWallet,
        contractAddress,
        setContractAddress,
>>>>>>> 09d64b6 (adding push notifications)
        SetCreated,
        SetJoined,
        joined,
        created,
<<<<<<< HEAD
=======
        connected,
>>>>>>> 09d64b6 (adding push notifications)
      }}
    >
      <div className="App">
        <Header />
<<<<<<< HEAD
        {/* <button onClick={Subscribe}>subscribe</button> */}
        {created || joined ? <Router /> : <Initial />}
=======
        <Router />
>>>>>>> 09d64b6 (adding push notifications)
      </div>
    </ParentalContext.Provider>
  );
}
<<<<<<< HEAD
=======

>>>>>>> 09d64b6 (adding push notifications)
export default App;
