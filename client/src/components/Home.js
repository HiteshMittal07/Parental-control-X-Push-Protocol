// import { ethers } from "ethers";
// import { useState } from "react";
// import 'bootstrap/dist/css/bootstrap.css';
// import './Home.css';

// export const Home = (props) => {
//     const [status, setStatus] = useState("Pending...");
//     const [balance, setBalance] = useState(null);

//     const Deposit = async (event) => {
//         event.preventDefault();
//         const { contract } = props;
//         const amount = document.querySelector('#amount').value;
//         const option = { value: ethers.parseEther(amount) };
//         const tx = await contract.DepositEth(option);
//         await tx.wait();
//     }

//     const getBalance = async () => {
//         const { contractRead } = props;
//         const tx1 = await contractRead.getBalance();
//         const num = parseInt(tx1) / Math.pow(10, 18);
//         setBalance(num);
//     }

//     const submitTx = async (event) => {
//         event.preventDefault();
//         const { contract } = props;
//         const address = document.querySelector('#subAddress').value;
//         const value = document.querySelector('#subValue').value;
//         const amount = ethers.parseEther(value);
//         const tx2 = await contract.SubmitTransaction(address, amount);
//         await tx2.wait();
//     }

//     const confirmTx = async () => {
//         const { contract } = props;
//         const txIndex = document.querySelector('#index').value;
//         try {
//             const tx3 = await contract.ConfirmTransactions(txIndex);
//             await tx3.wait();
//         } catch (error) {
//             alert(error.message);
//         }
//     }

//     const executeTx = async () => {
//         const { contract } = props;
//         const txIndex = document.querySelector('#index1').value;
//         try {
//             const tx4 = await contract.ExecuteTransaction(txIndex);
//             await tx4.wait();
//         } catch (error) {
//             alert(error.message);
//         }
//         setStatus("Success");
//     }

//     return (
//       <div className="home-container container mt-5" style={{ backgroundColor:"	rgb(196, 164, 162,0.5)" }} >
//             <div className="row">
//                 <div className="col-md-6">
//                     <h2 className="section-title">Balance Checker</h2>
//                     <button onClick={getBalance} className="btn btn-primary mb-3">Get Balance</button>
//                     <h3 className="balance-text">Balance: {balance} ETH</h3>

//                     <div className="input-group mb-3">
//                         <input type="text" id="amount" placeholder='Enter the Amount' className='form-control' />
//                         <button className='btn btn-danger' onClick={Deposit}>Deposit</button>
//                     </div>
//                 </div>
//                 <div className="col-md-6">
//                     <h2 className="section-title">Transaction Management</h2>
//                     <div className="input-group mb-3">
//                         <input type="text" id="subAddress" placeholder='Enter the Address' className='form-control' />
//                         <input type="text" id="subValue" placeholder='Enter the Amount' className='form-control' />
//                         <button className='btn btn-danger' onClick={submitTx}>Submit</button>
//                     </div>

//                     <div className="input-group mb-3">
//                         <input type="text" id="index" placeholder='Enter the Transaction no.' className='form-control' />
//                         <button className="btn btn-primary" onClick={confirmTx}>Confirm</button>
//                     </div>

//                     <div className="input-group mb-3">
//                         <input type="text" id="index1" placeholder='Enter the Transaction no.' className='form-control' />
//                         <button className="btn btn-primary" onClick={executeTx}>Execute</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Home;
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./Home.css";

export const Home = (props) => {
  const [balance, setBalance] = useState(null);
  const [transactionCount, setTransactionCount] = useState(0);

  const Deposit = async (event) => {
    event.preventDefault();
    const { contract } = props;
    const amount = document.querySelector("#amount").value;
    const option = { value: ethers.parseEther(amount) };
    const tx = await contract.DepositEth(props.user, option);
    await tx.wait();
  };

  const getBalance = async () => {
    const { contractRead } = props;
    const tx1 = await contractRead.getBalance(props.user);
    const num = parseInt(tx1) / Math.pow(10, 18);
    setBalance(num);
  };

  const submitTx = async (event) => {
    event.preventDefault();
    const { contract } = props;
    const address = document.querySelector("#subAddress").value;
    const value = document.querySelector("#subValue").value;
    const amount = ethers.parseEther(value);
    const tx2 = await contract.SubmitTransaction(props.user, address, amount);
    await tx2.wait();
  };

  const confirmTx = async () => {
    const { contract } = props;
    const txIndex = document.querySelector("#index").value;
    try {
      const tx3 = await contract.ConfirmTransactions(props.user, txIndex);
      await tx3.wait();
    } catch (error) {
      alert(error.message);
    }
  };

  const { contractRead } = props;
  useEffect(() => {
    const fetchTransactionCount = async () => {
      const count = await contractRead.getTransactionCount(props.user);
      setTransactionCount(parseInt(count));
    };
    contractRead && fetchTransactionCount();
  }, [contractRead]);

  return (
    <div
      className="home-container container mt-5"
      style={{ backgroundColor: "rgb(196, 164, 162, 0.5)" }}
    >
      <div className="row">
        <div className="col-md-6">
          <h2 className="section-title">Balance Checker</h2>
          <button onClick={getBalance} className="btn btn-primary mb-3">
            Get Balance
          </button>
          <h3 className="balance-text">Balance: {balance} ETH</h3>

          <div className="input-group mb-3">
            <input
              type="text"
              id="amount"
              placeholder="Enter the Amount"
              className="form-control"
            />
            <button className="btn btn-danger" onClick={Deposit}>
              Deposit
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="section-title">Transaction Management</h2>
          <div className="input-group mb-3">
            <input
              type="text"
              id="subAddress"
              placeholder="Enter the Address"
              className="form-control"
            />
            <input
              type="text"
              id="subValue"
              placeholder="Enter the Amount"
              className="form-control"
            />
            <button className="btn btn-danger" onClick={submitTx}>
              Submit
            </button>
          </div>

          <div className="input-group mb-3">
            <input
              type="text"
              id="index"
              placeholder="Enter the Transaction no."
              className="form-control"
            />
            <button className="btn btn-primary" onClick={confirmTx}>
              Confirm
            </button>
          </div>
          <div>
            <p className="transaction-count">
              Number of Transactions: {transactionCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
