import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../Styles/Info.css";
function Info() {
  return (
    <div className="container text-light">
      <h2 className="info-heading">How To Use My Project</h2>
      <div className="item1 overflow-x-hidden">
        <div className="row">
          <div className="col-md-6">
            <h3>Create Wallet</h3>

            <div className="info-box">
              <p>
                To create a wallet, users need to have PolygonZkEVM testnet
                ETHs. Navigate to the "Create Wallet" section and follow the
                instructions to set up your parental wallet.
                <br />
                To get Scroll Sepolia testnet ETHs, use the{" "}
                <a href="https://docs.scroll.io/en/user-guide/faucet/" target="_blank">
                  Scroll Sepolia
                </a>
                .
              </p>
            </div>
            <h3>Join Wallet</h3>

            <div className="info-box">
              <p>
                To join a wallet, users can provide the owner's address
                associated with the wallet. Users will be verified if they are
                associated with the provided address. Once verified, users can
                participate in transactions. Parents can add users and
                additional owners to the wallet after entering to the wallet.
              </p>
            </div>

            <h3> Submit Transaction</h3>
            <div className="info-box">
              <p>
                Users can submit transactions for approval, such as requesting
                funds or making purchases. User have to provide recipient
                address, amount, and the message (purpose). A notification will
                be broadcasted to the users of that particular wallet about the
                transaction being submitted.
              </p>
            </div>
          </div>

          <div className="col-md-6 custom-column">
            <h3>Voting System</h3>
            <div className="info-box">
              <p>
                Upon transaction submission, the wallet owner (parent) receives
                a notification. The owner can vote on the home page by
                confirming the transaction or reject the transaction in the
                transaction logs page.
              </p>
            </div>

            <h3>Notification System </h3>
            <div className="info-box">
              <p>
                Notifications for transactions, funds deposition, confirmation,
                and execution are broadcasted among the users of the wallet.
                This is implemented to ensure fulfilling of emergency needs of
                any user. To use the notification feature, owners need to have
                SePolia testnet ETHs. New owners need to create a channel for
                notifications. If a channel is already created, users can
                subscribe to receive notifications in their inbox. To get
                SePolia testnet ETHs, use the{" "}
                <a
                  href="https://www.alchemy.com/faucets/ethereum-sepolia"
                  target="_blank"
                >
                  SePolia faucet
                </a>
                .
              </p>
            </div>

            <h3>Transaction Execution</h3>

            <div className="info-box">
              <p>
                Once a transaction receives the required number of votes, it can
                be executed by the owner on the transaction logs page, and the
                funds are transferred accordingly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;
