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
  const [login, setLogin] = useState(false);
  const [account, setAccount] = useState("not connected");
  const connectWallet = async () => {
    const contractAddress = "0xf4c8CDFFa21c2064A0740054965d00Ee9395d6B4";
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
      contractRead.on("login", (status) => {
        setLogin(true);
        console.log("hi");
        alert("Login Successful");
      });
      contractRead.on("Signup", (status) => {
        setLogin(true);
        console.log("hello");
        alert("Login Successful");
      });
      setState({ provider, signer, contract, contractRead });
    } catch (error) {
      alert(error);
    }
  };

  const handleLogout = () => {
    setLogin(false); // Update login state to false
  };
  return (
    <div className="App">
      <Header
        connectWallet={connectWallet}
        login={login}
        handleLogout={handleLogout}
      />
      {login ? <Router {...state} /> : <Authenication {...state} />}
    </div>
  );
}
export default App;
