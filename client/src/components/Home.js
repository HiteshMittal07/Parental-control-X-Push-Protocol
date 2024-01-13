import { ethers } from "ethers";
import { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./Home.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ParentalContext } from "../ParentalContext";
import abi from "../contractJson/Parental.json";
import BeatLoader from "react-spinners/BeatLoader";
export const Home = () => {
  const [balance, setBalance] = useState(null);
  const [transactionCount, setTransactionCount] = useState(0);
  const { contractAddress } = useContext(ParentalContext);
  const contractABI = abi.abi;
  const [loading, setLoading] = useState(false);
  const override = {
    display: "block",
    marginTop: "200px",
  };
  const Deposit = async (event) => {
    event.preventDefault();
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    // const selectedValue = 1442;
    // await provider.send("wallet_switchEthereumChain", [
    //   { chainId: `0x${Number(selectedValue).toString(16)}` },
    // ]);
    let signer = provider.getSigner();
    let contractRead2 = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    let contract = contractRead2.connect(signer);
    contractRead2.on("Deposit", (sender, amount, event) => {
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
  const getBalance = async () => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    // const selectedValue = 1442;
    // await provider.send("wallet_switchEthereumChain", [
    //   { chainId: `0x${Number(selectedValue).toString(16)}` },
    // ]);
    let contractRead2 = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    console.log(contractRead2);
    const tx1 = await contractRead2.getBalance();
    const num = parseInt(tx1) / Math.pow(10, 18);
    setBalance(num);
  };

  const submitTx = async (event) => {
    event.preventDefault();
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    // const selectedValue = 1442;
    // await provider.send("wallet_switchEthereumChain", [
    //   { chainId: `0x${Number(selectedValue).toString(16)}` },
    // ]);
    let signer = provider.getSigner();
    let contractRead2 = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    let contract = contractRead2.connect(signer);
    contractRead2.on("SubmitTrans", (owner, txIndex, to, value, event) => {
      toast.success("Transaction submitted successfully");
      event.removeListener();
    });
    const address = document.querySelector("#subAddress").value;
    const value = document.querySelector("#subValue").value;
    const amount = ethers.utils.parseEther(value);
    const message = document.querySelector("#message").value;
    const tx2 = await contract.SubmitTransaction(address, amount, message);
    await tx2.wait();
  };

  const confirmTx = async () => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    // const selectedValue = 1442;
    // await provider.send("wallet_switchEthereumChain", [
    //   { chainId: `0x${Number(selectedValue).toString(16)}` },
    // ]);
    let signer = provider.getSigner();
    let contractRead2 = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    let contract = contractRead2.connect(signer);
    contractRead2.on("ConfirmTrans", (owner, txIndex, event) => {
      toast.success("Transaction confirmed successfully");
      event.removeListener();
    });
    const txIndex = document.querySelector("#index").value;
    try {
      const tx3 = await contract.ConfirmTransactions(txIndex);
      await tx3.wait();
    } catch (error) {
      alert(error.message);
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
                  <button onClick={getBalance} className="btn btn-primary">
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
                  <button className="btn btn-danger" onClick={Deposit}>
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
                  <button className="btn btn-danger" onClick={submitTx}>
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
                  <button className="btn btn-primary" onClick={confirmTx}>
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
