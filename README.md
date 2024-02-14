# Parental Control

Parental Control is a decentralized application (dApp) integrated with push protocol, deployed on the PolygonZkEVM testnet. It is designed to empower parents in managing family finances. The dApp allows users to create a parental wallet, add family members or children to the wallet, submit transactions, and vote on transactions. Notifications for transactions are sent to the inbox of owners (parents) for approval.

## Technologies Used
- Solidity
- Ether.js
- React.js
- JavaScript
- Hardhat
- PolygonZkEVM testnet

## How to Use

1. **Create Wallet:**
   - To create a wallet, users need to have PolygonZkEVM testnet ETHs. 
   - Navigate to the "Create Wallet" section and follow the instructions to set up your parental wallet.

2. **Join Wallet:**
   - New users can join an existing wallet by entering the wallet's details and requesting to join.
   - Once the request is approved by the wallet owner (parent), users can participate in transactions.

3. **Submit Transaction:**
   - Users can submit transactions for approval, such as requesting funds or making purchases.

4. **Voting System:**
   - Upon transaction submission, the wallet owner (parent) receives a notification.
   - The owner can vote on whether to approve or reject the transaction.

5. **Notification System:**
   - Notifications for transactions are sent to the wallet owners' inbox.
   - Owners can review the transaction details and vote on them.

6. **Transaction Execution:**
   - Once a transaction receives the required number of votes, it is executed, and the funds are transferred accordingly.

7. **Home Page Options:**
   - The home page displays various options such as "Get Balance," "Deposit," "Submit Transaction," and "Confirm Transaction."

8. **Transaction Logs:**
   - The navbar includes a "Transaction Logs" section where all transactions are listed for easy tracking and reference.

9. **Owners Section:**
   - In the owners section, information about the wallet owner (parent) is listed, providing transparency and accountability.

10. **Notification Bell Icon:**
    - Users can manage notifications through the notification bell icon.
    - To use the notification feature, users need to have SSEPolia testnet ETHs.
    - New owners need to create a channel for notifications. If a channel is already created, users can subscribe to receive notifications in their inbox.

11. **Spam Section:**
    - Notifications that are not meant to be received will be shown in the spam section for easy identification and management.

**Note:** Ensure you have sufficient testnet ETHs on both PolygonZkEVM and SSEPolia testnets to use all the features of the dApp.
