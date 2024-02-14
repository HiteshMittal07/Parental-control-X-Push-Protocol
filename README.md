<<<<<<< HEAD
# Parental Control

![Parental Control Logo](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4qK8lZhkY1-yX0SzyR6hX5Lo6XfNVdwg7nmL44xjockVh6N3-p0q8ozIZVr8jbJuheao&usqp=CAU)

## Table of Contents

- [Description](#description)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Description

**Parental Control** is a smart contract-based parental permission system designed to control and log all financial transactions initiated by children. This system ensures that payments can only be executed with the explicit permission of the specified owner (the parent or guardian). It provides a comprehensive solution to monitor and manage children's spending while preventing unnecessary or unauthorized payments.

Key features of this project include:

- **Smart Contracts**: Utilizes Solidity to create smart contracts that enforce parental permission for all financial transactions.
- **Web Application**: A user-friendly React.js front-end interface allows parents and guardians to manage permissions, review transaction logs, and gain control over their children's spending.
- **Ethereum Integration**: Integrates with the Ethereum blockchain for secure and transparent transaction handling.
- **Bootstrap Styling**: Implements Bootstrap for a responsive and visually appealing user interface.
- **PolyZkEVM Testnet**: Utilizes the zkEVM testnet for Ethereum contract testing, development and for Less Gas cost and faster Transaction speeds.

With Parental Control, you can maintain oversight of your child's financial activities, ensuring responsible spending and enhancing financial management within your family.

---

## Technologies Used

The following technologies and tools were used in the development of this project:

- **Solidity**: Used to write the smart contracts that enforce parental permissions.
- **Hardhat**: A development environment for Ethereum smart contracts.
- **React.js**: The front-end is built using React.js for a dynamic and user-friendly interface.
- **Ether.js**: A JavaScript library for interacting with the Ethereum blockchain.
- **Bootstrap**: Used for styling and responsive design of the web application.
- **PolyZkEVM Testnet**: The zkEVM testnet is used for Ethereum contract testing and development.

---

## Installation

To get started with Parental Control, follow these installation steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/HiteshMittal07/parental-control.git

## Usage

To use the Parental Control system, follow these steps:

1. **Access the Parental Control Web Application**:
   Open a web browser and navigate to the provided URL, which is typically `http://localhost:3000`.

2. **Connect the wallet and set up the users and owners of the particular funds initially**:
   - If you already set the owners and users then on connecting the wallet you can directly be routed to home page.
   - If you don't have an account, you may need to register or create one through the application.

3. **Set Up Permissions for Your Child's Account**:
   - After logging in, you should have access to a dashboard or settings page where you can set up permissions for your child's account.
   - Define the rules and conditions under which your child can request payments.

4. **Child Requests Payments**:
   - Your child can use the application to request payments for various purposes.
   - The system will ensure that these payment requests require parental approval before processing.

5. **Parental Approval**:
   - As a parent or guardian, you will receive notifications or alerts when your child requests a payment.
   - Review the payment requests and decide whether to approve or reject them through the application's interface.

6. **Payment Execution**:
   - Once you, as a parent, approve a payment request, the system will execute the payment.
   - The approved amount will be transferred to the child's account, and the transaction will be securely processed on the Ethereum blockchain.

7. **Transaction Record**:
   - All approved payments will be recorded and stored on the Ethereum blockchain, ensuring transparency and a secure transaction history.

This process helps parents or guardians oversee and control their child's financial activities, ensuring responsible spending and financial management.

Enjoy using the Parental Control system to enhance your family's financial management and security!

---
=======
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
>>>>>>> origin/main
