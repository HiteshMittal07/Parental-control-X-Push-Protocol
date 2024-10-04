import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import BeatLoader from "react-spinners/BeatLoader";
import {
  getParentalContractRead,
  getWeb3Provider,
  switchNetwork,
} from "../Web3/web3";
const Transactions = () => {
  const contractAddress = localStorage.getItem("contractAddr");
  const [transactions, setTransactions] = useState([]);
  const [check, setCheck] = useState(0);
  const [loading, setLoading] = useState(false);
  const [switched, setSwitched] = useState(false);
  const override = {
    display: "block",
    marginTop: "200px",
  };

  useEffect(() => {
    let provider = getWeb3Provider();
    let contractRead = getParentalContractRead(provider, contractAddress);
    const switchChain = async () => {
      try {
        setLoading(true);
        const selectedValue = "2442";
        await switchNetwork(selectedValue);
        setSwitched(true);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchTransactions = async () => {
      try {
        if (switched) {
          const tx = await contractRead.getTransaction();
          setTransactions(tx);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    switchChain();
    fetchTransactions();
  }, [check, switched]);

  const checkStatus = (stat) => {
    if (stat === "true") {
      return <span className="badge bg-success">Success</span>;
    } else {
      return <span className="badge bg-warning text-dark">Pending</span>;
    }
  };

  const handleCancel = async (transactionIndex) => {
    try {
      let provider = getWeb3Provider();
      const selectedValue = "2442";
      await switchNetwork(selectedValue);
      let signer = provider.getSigner();
      let contractRead = getParentalContractRead(provider, contractAddress);
      let contract = contractRead.connect(signer);
      const tx4 = await contract.removeTx(transactionIndex);
      await tx4.wait();
      setCheck(check + 1);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleExecute = async (transactionIndex) => {
    try {
      let provider = getWeb3Provider();
      const selectedValue = "2442";
      await switchNetwork(selectedValue);
      let signer = provider.getSigner();
      let contractRead = getParentalContractRead(provider, contractAddress);
      let contract = contractRead.connect(signer);
      const tx5 = await contract.ExecuteTransaction(transactionIndex);
      await tx5.wait();
      setCheck(check + 1);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      {loading ? (
        <>
          <BeatLoader color="#ffffff" cssOverride={override} />
          <p className="text-light">Fetching Transactions...</p>
        </>
      ) : (
        <div>
          <h5 className="text-uppercase text-light">Transactions</h5>
          <div className="container-fluid">
            <table className="table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Value</th>
                  <th>Executed</th>
                  <th>Votes</th>
                  <th>Actions</th>
                  <th>Message</th> {/* New heading */}
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.from}</td>
                    <td>{transaction.to}</td>
                    <td>
                      {parseFloat(transaction.value) / Math.pow(10, 18)} ETH
                    </td>
                    <td>{checkStatus(transaction.executed.toString())}</td>
                    <td>{parseInt(transaction.noOfvotes)}/2</td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleExecute(index)}
                        >
                          Execute
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(index)}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                    <td>{transaction.message.toString()}</td>{" "}
                    {/* Placeholder for the message */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
