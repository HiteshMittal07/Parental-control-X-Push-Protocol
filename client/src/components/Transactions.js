import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";

const Transactions = (props) => {
  const [transactions, setTransactions] = useState([]);
  const { contractRead } = props;
  const { contract } = props;

  useEffect(() => {
    const fetchTransactions = async () => {
      const tx = await contractRead.getTransaction(props.user);
      setTransactions(tx);
    };
    contractRead && fetchTransactions();
  }, [contractRead]);

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
      const tx4 = await contract.removeTx(props.user, transactionIndex);
      await tx4.wait();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleExecute = async (transactionIndex) => {
    // Implement the execute logic here, for example:
    try {
      const tx5 = await contract.ExecuteTransaction(
        props.user,
        transactionIndex
      );
      await tx5.wait();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <h5 className="text-uppercase text-light">Transactions</h5>
      <div className="container-fluid">
        <table className="table">
          <thead>
            <tr>
              <th>Receiver</th>
              <th>Value</th>
              <th>Executed</th>
              <th>Votes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.to}</td>
                <td>{parseFloat(transaction.value) / Math.pow(10, 18)} ETH</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Transactions;
