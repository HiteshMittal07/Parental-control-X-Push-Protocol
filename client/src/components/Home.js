import { ethers } from "ethers";
import { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./Home.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ParentalContext } from "../ParentalContext";
import abi from "../contractJson/Parental.json";
import BeatLoader from "react-spinners/BeatLoader";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
export const Home = () => {
  const [balance, setBalance] = useState(null);
  const [transactionCount, setTransactionCount] = useState(0);
  const contractABI = abi.abi;
  let contractAddress = localStorage.getItem("contractAddr");
  let owner = localStorage.getItem("owner");
  const [loading, setLoading] = useState(false);
  const override = {
    display: "block",
    marginTop: "200px",
  };
  const switchChain3 = async () => {
    window.ethereum.on("chainChanged", Deposit);

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    const selectedValue = 1442;
    // Send the chain switch request
    provider.send("wallet_switchEthereumChain", [
      { chainId: `0x${Number(selectedValue).toString(16)}` },
    ]);
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
      params: [],
    });
    if (chainId == `0x${Number(selectedValue).toString(16)}`) {
      await Deposit();
    }
    // console.log(window.ethereum.chainId);
  };
  const Deposit = async () => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = provider.getSigner();
    let contractRead2 = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    let contract = contractRead2.connect(signer);
    contractRead2.on("Deposit", async (sender, amount, event) => {
      window.ethereum.removeListener("chainChanged", Deposit);
      await provider.send("wallet_switchEthereumChain", [
        { chainId: "0xAA36A7" },
      ]);
      const userAlice = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.STAGING,
        filter: {
          channels: [`${owner}`],
        },
        account: `${owner}`,
      });
      const a = parseInt(amount) / Math.pow(10, 18);
      await userAlice.channel.send(["*"], {
        notification: {
          title: `Deposited by ${sender}`,
          body: `${a} ETH`,
        },
      });
      toast.success("Deposit successfully");
      event.removeListener();
    });
    const amount = document.querySelector("#amount").value;
    const option = { value: ethers.utils.parseEther(amount) };
    const tx = await contract.DepositEth(option);
    await tx.wait();
  };

  useEffect(() => {
    const switchChain = async () => {
      try {
        setLoading(true);
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        const selectedValue = 1442;
        await provider.send("wallet_switchEthereumChain", [
          { chainId: `0x${Number(selectedValue).toString(16)}` },
        ]);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    switchChain();
  }, []);

  const switchChain = async () => {
    window.ethereum.on("chainChanged", getBalance);

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    const selectedValue = 1442;
    // Send the chain switch request
    provider.send("wallet_switchEthereumChain", [
      { chainId: `0x${Number(selectedValue).toString(16)}` },
    ]);
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
      params: [],
    });
    if (chainId == `0x${Number(selectedValue).toString(16)}`) {
      await getBalance();
    }
  };
  const getBalance = async () => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let contractRead2 = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    console.log(contractRead2);
    const tx1 = await contractRead2.getBalance();
    window.ethereum.removeListener("chainChanged", getBalance);
    const num = parseInt(tx1) / Math.pow(10, 18);
    setBalance(num);
  };

  const owner2 = owner;
  const switchChain2 = async () => {
    window.ethereum.on("chainChanged", submitTx);

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    const selectedValue = 1442;
    // Send the chain switch request
    provider.send("wallet_switchEthereumChain", [
      { chainId: `0x${Number(selectedValue).toString(16)}` },
    ]);
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
      params: [],
    });
    if (chainId == `0x${Number(selectedValue).toString(16)}`) {
      await submitTx();
    }
  };
  const submitTx = async () => {
    // event.preventDefault();
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    const selectedValue = 1442;
    await provider.send("wallet_switchEthereumChain", [
      { chainId: `0x${Number(selectedValue).toString(16)}` },
    ]);
    let signer = provider.getSigner();
    let contractRead2 = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    let contract = contractRead2.connect(signer);
    contractRead2.on(
      "SubmitTrans",
      async (owner, txIndex, to, value, event) => {
        window.ethereum.removeListener("chainChanged", submitTx);
        await provider.send("wallet_switchEthereumChain", [
          { chainId: "0xAA36A7" },
        ]);
        const userAlice = await PushAPI.initialize(signer, {
          env: CONSTANTS.ENV.STAGING,
          filter: {
            channels: [`${owner2}`],
          },
          account: `${owner2}`,
        });
        const a = parseInt(value) / Math.pow(10, 18);
        await userAlice.channel.send(["*"], {
          notification: {
            title: `Submitted by ${owner}`,
            body: `To:${to} Value:${a}`,
          },
        });
        toast.success("Submitted successfully");
        event.removeListener();
      }
    );
    const address = document.querySelector("#subAddress").value;
    const value = document.querySelector("#subValue").value;
    const amount = ethers.utils.parseEther(value);
    const message = document.querySelector("#message").value;
    try {
      const tx2 = await contract.SubmitTransaction(address, amount, message);
      await tx2.wait();
    } catch (error) {
      toast.error(error.reason);
      // console.log(error);
    }
  };

  const switchChain4 = async () => {
    window.ethereum.on("chainChanged", confirmTx);

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    const selectedValue = 1442;
    // Send the chain switch request
    provider.send("wallet_switchEthereumChain", [
      { chainId: `0x${Number(selectedValue).toString(16)}` },
    ]);
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
      params: [],
    });
    if (chainId == `0x${Number(selectedValue).toString(16)}`) {
      await confirmTx();
    }
    // console.log(window.ethereum.chainId);
  };
  const confirmTx = async () => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = provider.getSigner();
    let contractRead2 = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    let contract = contractRead2.connect(signer);
    contractRead2.on("ConfirmTrans", async (owner, txIndex, event) => {
      window.ethereum.removeListener("chainChanged", confirmTx);
      await provider.send("wallet_switchEthereumChain", [
        { chainId: "0xAA36A7" },
      ]);
      const userAlice = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.STAGING,
        filter: {
          channels: [`${owner2}`],
        },
        account: `${owner2}`,
      });
      await userAlice.channel.send(["*"], {
        notification: {
          title: `Confirmed`,
          body: `By:${owner} Transaction Index:${txIndex}`,
        },
      });
      toast.success("Transaction confirmed successfully");
      event.removeListener();
    });
    const txIndex = document.querySelector("#index").value;
    try {
      const tx3 = await contract.ConfirmTransactions(txIndex);
      await tx3.wait();
    } catch (error) {
      toast.error(error.reason);
    }
  };

  // useEffect(() => {
  //   let provider = new ethers.providers.Web3Provider(window.ethereum);
  //       let contractRead2=new ethers.Contract(contractAddress,contractABI,provider);
  //   const fetchTransactionCount = async () => {
  //     const count = await contractRead2.getTransactionCount();
  //     setTransactionCount(parseInt(count));
  //   };
  //   contractRead2 && fetchTransactionCount();
  // }, []);

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
          style={{ backgroundColor: "rgba(196, 164, 162, 0.5)" }}
        >
          <div className="row">
            {/* Balance Checker */}
            <div className="col-md-6">
              <div
                className="balance-box"
                style={{
                  //   backgroundColor: "rgba(196, 164, 162)",
                  padding: "20px",
                  marginBottom: "20px",
                  height: "400px",
                }}
              >
                <h2 className="section-title">Balance Checker</h2>
                <div className="balance-info">
                  <h3 className="balance-text">Balance: {balance} ETH</h3>
                  <button onClick={switchChain} className="btn btn-primary">
                    Get Balance
                  </button>
                </div>
                {/* Tagline */}
                <div
                  className="tagline"
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    textAlign: "center",
                    width: "80%",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Arial, sans-serif",
                      fontSize: "19px",
                      fontStyle: "italic",
                      color: "#333",
                    }}
                  >
                    "Parental Control is a smart contract-driven system that
                    monitors and logs financial transactions initiated by
                    children. It mandates explicit parental or guardian approval
                    for any payment execution, enhancing control over minors'
                    spending. This solution offers comprehensive oversight for
                    effective management of children's financial activities."
                  </p>
                </div>
              </div>
            </div>

            {/* Deposit Amount */}
            <div className="col-md-6">
              <div
                className="deposit-box"
                style={{
                  //   backgroundColor: "rgba(196, 164, 162)",
                  padding: "20px",
                  marginBottom: "20px",
                  height: "400px",
                }}
              >
                <h2 className="section-title">Deposit Amount</h2>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    id="amount"
                    placeholder="Enter the Deposit Amount"
                    className="form-control"
                  />
                </div>
                <div className="input-group mb-3">
                  <button className="btn btn-danger" onClick={switchChain3}>
                    Deposit
                  </button>
                </div>
              </div>
            </div>

            {/* Submit a Transaction */}
            <div className="col-md-6">
              <div
                className="submit-box"
                style={{
                  //   backgroundColor: "rgba(196, 164, 162)",
                  padding: "20px",
                  marginBottom: "10px",
                  height: "400px",
                }}
              >
                <h2 className="section-title">Submit a Transaction</h2>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    id="subAddress"
                    placeholder="Enter the Address"
                    className="form-control"
                  />
                </div>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    id="subValue"
                    placeholder="Enter the Amount"
                    className="form-control"
                  />
                </div>
                <div className="input-group mb-2">
                  <textarea
                    id="message"
                    placeholder="Enter the Message"
                    className="form-control"
                    rows={3}
                    cols={50}
                  />
                </div>
                <div className="input-group mb-3">
                  <button className="btn btn-danger" onClick={switchChain2}>
                    Submit
                  </button>
                </div>
              </div>
            </div>

            {/* Confirm a Transaction */}
            <div className="col-md-6">
              <div
                className="confirm-box"
                style={{
                  //   backgroundColor: "rgba(196, 164, 162)",
                  padding: "20px",
                  marginBottom: "20px",
                  height: "400px",
                }}
              >
                <h2 className="section-title">Confirm a Transaction</h2>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    id="index"
                    placeholder="Enter the Transaction no."
                    className="form-control"
                  />
                </div>
                <div className="input-group mb-3">
                  <button className="btn btn-primary" onClick={switchChain4}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
