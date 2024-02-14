# Problem Statement

Managing family finances can be challenging, especially when multiple family members are involved. Parents often struggle to maintain oversight and control over financial transactions while ensuring that children learn responsible financial habits. Traditional banking systems lack transparency and real-time updates, making it difficult for parents to track and approve transactions promptly.

# Solution

Parental Control is a decentralized application (dApp) that solves these challenges by providing a secure and transparent platform for managing family finances. The dApp allows parents to create a parental wallet, add family members or children to the wallet, and oversee all financial transactions. Notifications are sent to parents for each transaction, allowing them to vote on whether to approve or reject it. This system promotes financial literacy among children and ensures responsible spending practices within the family. With real-time updates and transparent transaction logs, Parental Control offers a comprehensive solution for managing family finances efficiently.

# Parental Control

Parental Control is a decentralized application (dApp) integrated with push protocol, deployed on the PolygonZkEVM testnet. It is designed to empower parents in managing family finances. The dApp allows users to create a parental wallet, add family members or children to the wallet, submit transactions, and vote on transactions. Notifications for transactions are sent to the inbox of owners (parents) for approval.

## Technologies Used

- Solidity
- Ethers.js(version 5.7)
- React.js
- JavaScript
- Hardhat
- PolygonZkEVM testnet

## How to Use

1. **Create Wallet:**

   - To create a wallet, users need to have PolygonZkEVM testnet ETHs.
   - Navigate to the "Create Wallet" section and follow the instructions to set up your parental wallet.

2. **Join Wallet:**

   - To join a wallet, users can provide the owner's address associated with the wallet.
   - Users will be verified if they are associated with the provided address.
   - Once verified, users can participate in transactions.
   - Parents can add users and additional owners to the wallet after entering to the wallet.

3. **Submit Transaction:**

   - Users can submit transactions for approval, such as requesting funds or making purchases.
   - User have to provide reciepent address, amount and the message(purpose).
   - A notification will be broadcasted to the users of that particular wallet about transaction bieng submitted.

4. **Voting System:**

   - Upon transaction submission, the wallet owner (parent) receives a notification.
   - The owner can vote on home page by confirming the transaction
     or reject the transaction in the transaction logs page.

5. **Notification System:**

   - Notifications for transactions , funds deposition, confirmation and execution are broadcasted among the users of wallet.
   - This is implemented to ensure fullfilling of Emergency needs of any user.

6. **Transaction Execution:**

   - Once a transaction receives the required number of votes, it can be executed by the owner on transaction logs page,
     and the funds are transferred accordingly.

7. **Home Page Options:**

   - The home page displays various options such as "Get Balance," "Deposit," "Submit Transaction," and "Confirm Transaction."

8. **Transaction Logs:**

   - The navbar includes a "Transaction Logs" section where all transactions are listed for easy tracking and reference.

9. **Owners Section:**

   - In the owners section, information about the wallet owner (parent) is listed, providing transparency and accountability.

10. **Notification Bell Icon:**

    - Users can manage notifications through the notification bell icon.
    - To use the notification feature, users need to have SePolia testnet ETHs.
    - New owners need to create a channel for notifications. If a channel is already created, users can subscribe to receive notifications in their inbox.

11. **Spam Section:**
    - Notifications that are not meant to be received will be shown in the spam section for easy identification and management.

**Note:** Ensure you have sufficient testnet ETHs on both PolygonZkEVM and SePolia testnets to use all the features of the dApp(Use Respective Faucets).
