import React from "react";
import "bootstrap/dist/css/bootstrap.css";

function Info() {
  return (
    <div className="container mt-5 text-light">
      <h2 className="mb-4">How to Use My Project</h2>
      <div className="row">
        <div className="col-md-6">
          <h3>1) Create Wallet:</h3>
          <p>
            To create a wallet, users need to have PolygonZkEVM testnet ETHs.
            Navigate to the "Create Wallet" section and follow the instructions
            to set up your parental wallet.
          </p>
          <p>
            To get PolygonZkEVM testnet ETHs, use the{" "}
            <a href="https://faucet.polygon.technology/" target="_blank">
              PolygonZkEVM faucet
            </a>
            .
          </p>
          <h3>2) Join Wallet:</h3>
          <p>
            To join a wallet, users can provide the owner's address associated
            with the wallet. Users will be verified if they are associated with
            the provided address. Once verified, users can participate in
            transactions. Parents can add users and additional owners to the
            wallet after entering to the wallet.
          </p>
          <h3>3) Submit Transaction:</h3>
          <p>
            Users can submit transactions for approval, such as requesting funds
            or making purchases. User have to provide recipient address, amount,
            and the message (purpose). A notification will be broadcasted to the
            users of that particular wallet about the transaction being
            submitted.
          </p>
        </div>
        <div className="col-md-6">
          <h3>4) Voting System:</h3>
          <p>
            Upon transaction submission, the wallet owner (parent) receives a
            notification. The owner can vote on the home page by confirming the
            transaction or reject the transaction in the transaction logs page.
          </p>
          <h3>5) Notification System:</h3>
          <p>
            Notifications for transactions, funds deposition, confirmation, and
            execution are broadcasted among the users of the wallet. This is
            implemented to ensure fulfilling of Emergency needs of any user.
          </p>
          <p>
            To use the notification feature, owners need to have SePolia testnet
            ETHs. New owners need to create a channel for notifications. If a
            channel is already created, users can subscribe to receive
            notifications in their inbox. To get SePolia testnet ETHs, use the{" "}
            <a
              href="https://www.alchemy.com/faucets/ethereum-sepolia"
              target="_blank"
            >
              SePolia faucet
            </a>
            .
          </p>
          <h3>6) Transaction Execution:</h3>
          <p>
            Once a transaction receives the required number of votes, it can be
            executed by the owner on the transaction logs page, and the funds
            are transferred accordingly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Info;
