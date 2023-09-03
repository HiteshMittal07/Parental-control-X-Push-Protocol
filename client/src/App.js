import {ethers} from "ethers";
import {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Header from "./components/Header";
import Router from "./routes/Router";
import abi from "./contractJson/Parental.json"
import './App.css'
function App() {
  const [state,setState]=useState({
    provider:null,
    signer:null,
    contract:null,
    contractRead:null
  })
  const[account,setAccount]=useState("not connected");
  useEffect(()=>{
    const connectWallet=async()=>{
      const contractAddress="0xd83D72db394Bd5A56461Aa86EcF116E7b4BDAe19";
      const contractABI=abi.abi;
      try{
        const {ethereum}=window;
        const accounts=await ethereum.request({method:"eth_requestAccounts",})
        window.ethereum.on("accountsChanged",()=>{
          window.location.reload()
        })
        setAccount(accounts);
        const provider=new ethers.BrowserProvider(ethereum);
        const signer=await provider.getSigner();
        const contract=new ethers.Contract(contractAddress,contractABI,signer);
        const contractRead=new ethers.Contract(contractAddress,contractABI,provider);
        setState({provider,signer,contract,contractRead});
      }catch(error){
        alert(error);
      }
    };
    connectWallet();
  },[]);
  
  return <div className="App">
      <Header/>
      <Router {...state}/>
    </div>
}
export default App;

