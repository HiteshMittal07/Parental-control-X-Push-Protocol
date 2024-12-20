import { ethers } from "ethers";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../Styles/Home.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BeatLoader from "react-spinners/BeatLoader";
import AddOwner from "./AddParent";
import AddUser from "./AddChild";
import {
  getChainId,
  getParentalContractRead,
  getUser,
  getWeb3Provider,
  sendNotification,
  switchNetwork,
} from "../Web3/web3";
export const Home = () => {
  const [balance, setBalance] = useState(null);
  let contractAddress = localStorage.getItem("contractAddr");
  let owner = localStorage.getItem("owner");
  const [loading, setLoading] = useState(false);
  const override = {
    display: "block",
    marginTop: "200px",
  };
  const switchChain = async (func) => {
    window.ethereum.on("chainChanged", func);
    const selectedValue = "534351";
    const chainId = await getChainId();
    if (chainId == `0x${Number(selectedValue).toString(16)}`) {
      await func();
    } else {
      await switchNetwork(selectedValue);
    }
  };
  const Deposit = async () => {
    let provider = getWeb3Provider();
    let signer = provider.getSigner();
    let contractRead = getParentalContractRead(provider, contractAddress);
    let contract = contractRead.connect(signer);
    contractRead.on("Deposit", async (sender, amount, event) => {
      window.ethereum.removeListener("chainChanged", Deposit);
      await switchNetwork("11155111");
      const userAlice = await getUser(signer, owner);
      const a = parseInt(amount) / Math.pow(10, 18);
      const title = `Deposited by ${sender}`;
      const body = `${a} ETH`;
      await sendNotification(userAlice, title, body);
      toast.success("Deposit successfully");
      event.removeListener();
    });
    const amount = document.querySelector("#amount").value;
    if (!amount) {
      toast.error("Enter a valid amount");
      return;
    }
    const option = { value: ethers.utils.parseEther(amount) };
    try {
      const tx = await contract.depositEth(option);
      await tx.wait();
    } catch (error) {
      toast.error("Error depositing amount");
    }
  };

  const WithdrawBalance = async () => {
    let provider = getWeb3Provider();
    let signer = provider.getSigner();
    let contractRead = getParentalContractRead(provider, contractAddress);
    let contract = contractRead.connect(signer);
    contractRead.on("Withdraw", async (claimer, amount, event) => {
      window.ethereum.removeListener("chainChanged", WithdrawBalance);
      await switchNetwork("11155111");
      const userAlice = await getUser(signer, owner);
      const a = parseInt(amount) / Math.pow(10, 18);
      const title = `Withdraw by ${claimer}`;
      const body = `${a} ETH`;
      await sendNotification(userAlice, title, body);
      toast.success("Withdrawn successfully");
      event.removeListener();
    });
    const amount = document.querySelector("#amount").value;
    if (!amount) {
      toast.error("Enter a valid amount");
      return;
    }
    const option = ethers.utils.parseEther(amount);
    try {
      const tx = await contract.withdrawEth(option, { gasLimit: 3000000 });
      await tx.wait();
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  useEffect(() => {
    const switchChain_effect = async () => {
      try {
        setLoading(true);
        const selectedValue = "534351";
        await switchNetwork(selectedValue);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    switchChain_effect();
  }, []);

  const getBalance = async () => {
    let provider = getWeb3Provider();
    let contractRead = getParentalContractRead(provider, contractAddress);
    const tx1 = await contractRead.getBalance();
    window.ethereum.removeListener("chainChanged", getBalance);
    const num = parseInt(tx1) / Math.pow(10, 18);
    setBalance(num);
  };

  const owner2 = owner;
  const submitTx = async () => {
    let provider = getWeb3Provider();
    const selectedValue = "534351";
    await switchNetwork(selectedValue);
    let signer = provider.getSigner();
    let contractRead = getParentalContractRead(provider, contractAddress);
    let contract = contractRead.connect(signer);
    contractRead.on("SubmitTrans", async (owner, txIndex, to, value, event) => {
      window.ethereum.removeListener("chainChanged", submitTx);
      await switchNetwork("11155111");
      const userAlice = await getUser(signer, owner2);
      const a = parseInt(value) / Math.pow(10, 18);
      const title = `Submitted by ${owner}`;
      const body = `To:${to} Value:${a}`;
      await sendNotification(userAlice, title, body);
      toast.success("Submitted successfully");
      event.removeListener();
    });
    const address = document.querySelector("#subAddress").value;
    const value = document.querySelector("#subValue").value;
    const amount = ethers.utils.parseEther(value);
    if (!address || !value) {
      toast.error("fill the required fields");
      return;
    }
    try {
      const tx2 = await contract.SubmitTransaction(address, amount);
      await tx2.wait();
    } catch (error) {
      toast.error(error.reason);
    }
  };
  const confirmTx = async () => {
    let provider = getWeb3Provider();
    let signer = provider.getSigner();
    let contractRead = getParentalContractRead(provider, contractAddress);
    let contract = contractRead.connect(signer);
    contractRead.on("ConfirmTrans", async (owner, txIndex, event) => {
      window.ethereum.removeListener("chainChanged", confirmTx);
      await switchNetwork("11155111");
      const userAlice = await getUser(signer, owner2);
      const title = `Confirmed`;
      const body = `By:${owner} Transaction Index:${txIndex}`;
      await sendNotification(userAlice, title, body);
      toast.success("Transaction confirmed successfully");
      event.removeListener();
    });
    const txIndex = document.querySelector("#index").value;
    if (!txIndex) {
      toast.error("Enter a valid transaction index");
      return;
    }
    try {
      const tx3 = await contract.ConfirmTransactions(txIndex);
      await tx3.wait();
    } catch (error) {
      toast.error(error.reason);
    }
  };
  return (
    <div>
      {loading ? (
        <>
          <BeatLoader color="#ffffff" cssOverride={override} />
          <p className="text-light">Wait Switching Network...</p>
        </>
      ) : (
        <div
          className="home-container container mt-5"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        >
          <section className="balance-checker card">
            <div className="card-body">
              <h2>Balance Checker</h2>
              <div className="balance-info">
                <h3 className="balance-title">Balance: {balance} ETH</h3>
                <button
                  onClick={() => switchChain(getBalance)}
                  className="btn btn-primary balance-btn"
                >
                  Get Balance
                </button>
              </div>

              <h2>Deposit / Withdraw</h2>
              <div className="deposit-box">
                <div className="input-group mb-1">
                  <input
                    type="text"
                    id="amount"
                    placeholder="Enter the Amount"
                    className="form-control custom-input"
                  />
                </div>
              </div>
              <div className="input-group mb-1 d-flex justify-content-between">
                <button
                  className="btn btn-danger deposit-btn"
                  onClick={() => switchChain(Deposit)}
                >
                  Deposit
                </button>

                <button
                  className="btn btn-danger withdraw-btn"
                  onClick={() => switchChain(WithdrawBalance)}
                >
                  Withdraw
                </button>
              </div>
            </div>
          </section>

          <section className="deposit-submit card">
            <div className="card-body">
              <h2>Submit Transaction</h2>
              <div className="submit-box">
                <div className="input-group mb-2">
                  <input
                    type="text"
                    id="subAddress"
                    placeholder="Enter the Address"
                    className="form-control"
                  />
                </div>
                <div className="input-group mb-4">
                  <input
                    type="text"
                    id="subValue"
                    placeholder="Enter the Amount"
                    className="form-control"
                  />
                </div>
                <div className="input-group mb-3">
                  <button
                    className="btn btn-danger submit-btn"
                    onClick={() => switchChain(submitTx)}
                  >
                    Submit
                  </button>
                </div>
              </div>

              <h2>Confirm Transaction</h2>
              <div className="confirm-box">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    id="index"
                    placeholder="Enter the Transaction no."
                    className="form-control"
                  />
                </div>
                <div className="input-group mb-3">
                  <button
                    className="btn btn-primary confirm-btn"
                    onClick={() => switchChain(confirmTx)}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section className="add card">
            <div className="card-body">
              <div className="add-owner">
                <h2>Add / Remove Parent</h2>
                <AddOwner />
              </div>

              <div className="add-user">
                <h2>Add Child</h2>

                <AddUser />
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Home;
