import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { ParentalContext } from "../ParentalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Transactions = () => {
  const { state2 } = useContext(ParentalContext);
  const { contractRead2, contract2 } = state2;
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const tx = await contractRead2.getTransaction();
      setTransactions(tx);
    };
    contractRead2 && fetchTransactions();
  }, [contractRead2]);

  const checkStatus = (stat) => {
    if (stat === "true") {
      return <span className="badge bg-success">Success</span>;
    } else {
      return <span className="badge bg-warning text-dark">Pending</span>;
    }
  };

  const handleCancel = async (transactionIndex) => {
    // Implement the cancel logic here, for example:
    try {
      const tx4 = await contract2.removeTx(transactionIndex);
      await tx4.wait();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleExecute = async (transactionIndex) => {
    // Implement the execute logic here, for example:
    try {
      const tx5 = await contract2.ExecuteTransaction(transactionIndex);
      await tx5.wait();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
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
    </>
  );
};

export default Transactions;
