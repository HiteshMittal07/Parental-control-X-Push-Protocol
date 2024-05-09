// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Parental is AccessControl {
    event Deposit(address indexed sender, uint amount);
    event SubmitTrans(
        address indexed parent,
        uint indexed txIndex,
        address indexed to,
        uint value
    );
    event ConfirmTrans(address indexed parent, uint indexed txIndex);
    event RevokeTrans(address indexed parent, uint indexed txIndex);
    event ExecuteTrans(address indexed parent, uint indexed txIndex);
    event RemoveTrans(address indexed parent, uint indexed txIndex);
    event addparent(address parent, address adder);
    event addchild(address child, address adder);


    bytes32 public constant CHILD_ROLE = keccak256("CHILD_ROLE");
    bytes32 public constant PARENT_ROLE = keccak256("PARENT_ROLE");

    address[] parents;  // Stores the addresses of parents(owners)
    address[] children;  // Stores the addresses of users who have access to this wallet as a child.
    uint public votes;  // Number of votes required for a transaction to be executed

    struct Transaction {
        address from;
        address to;
        uint value;
        bool executed;
        uint noOfvotes;
        uint totalVotes;
    }
    mapping(uint => mapping(address => bool)) public isConfirmed;
    Transaction[] public transactions;

    // Constructor to set the initial parent(creator of wallet)
    constructor(address parent) {
        parents.push(parent);
        _grantRole(PARENT_ROLE,parent);
        votes = 1;
    }

    // Modifier to check if a transaction exists
    modifier txExist(uint _txIndex) {
        require(_txIndex < transactions.length, "This transaction doesn't exist");
        _;
    }

    // Modifier to check if a transaction has not been executed
    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, "This transaction is already executed");
        _;
    }

    // Modifier to check if a transaction has not been confirmed by the sender
    modifier notConfirmed(uint _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "Transaction is already confirmed");
        _;
    }

    /**
     * @dev Functionality for adding a child to the parental wallet
     * @param child Address of the user being added to the parental wallet as a child
     */
    function addChild(address child) public onlyRole(PARENT_ROLE) {
        require(child != address(0), "Invalid child Address");
        require(!hasRole(CHILD_ROLE, child), "Child is not unique");
        children.push(child);
        _grantRole(CHILD_ROLE, child);
        emit addchild(child, msg.sender);
    }

    /**
     * @dev Functionality for adding another parent to the parental wallet
     * @param parent Address of the user being added to the parental wallet as an parent
     */
    function addParent(address parent) public onlyRole(PARENT_ROLE) {
        require(parent != address(0), "Invalid Parent Address");
        require(!hasRole(PARENT_ROLE,parent), "Parent is not unique");
        parents.push(parent);
        votes = votes + 1;
        _grantRole(PARENT_ROLE, parent);
        emit addparent(parent, msg.sender);
    }

    /**
     * @dev Functionality for confirming a transaction
     * @param _txIndex Index of the transaction to be confirmed
     */
    function ConfirmTransactions(uint _txIndex) public onlyRole(PARENT_ROLE) txExist(_txIndex-1) notExecuted(_txIndex-1) notConfirmed(_txIndex-1) {
        Transaction storage t = transactions[_txIndex-1];
        require(t.noOfvotes < votes, "Transaction already has the required number of votes");
        require(t.value <= address(this).balance, "Please add more balance to confirm");
        t.noOfvotes += 1;
        isConfirmed[_txIndex-1][msg.sender] = true;
        emit ConfirmTrans(msg.sender, _txIndex);
    }

    /**
     * @dev Functionality for submitting a transaction
     * @param _to Recipient address
     * @param _value Amount to be sent
     */
    function SubmitTransaction(address _to, uint _value) public {
        require(hasRole(PARENT_ROLE,msg.sender) || hasRole(CHILD_ROLE,msg.sender),"You don't have rights to submit transaction");
        uint txIndex = transactions.length;
        transactions.push(Transaction({
            from: msg.sender,
            to: _to,
            value: _value,
            executed: false,
            noOfvotes: 0,
            totalVotes: votes
        }));
        emit SubmitTrans(msg.sender, txIndex+1, _to, _value);
    }

    /**
     * @dev Functionality for depositing funds into the Parental wallet
     */
    function DepositEth() public payable {
        emit Deposit(msg.sender, msg.value);
    }

    // Fallback function to receive funds
    receive() external payable {}

    /**
     * @dev Functionality for executing a transaction
     * @param _txIndex Index of the transaction to be executed
     */
    function ExecuteTransaction(uint _txIndex) public onlyRole(PARENT_ROLE) txExist(_txIndex-1) notExecuted(_txIndex-1) {
        Transaction storage transaction = transactions[_txIndex-1];
        require(transaction.noOfvotes == votes, "Cannot execute transaction");
        transaction.executed = true;
        (bool success,) = transaction.to.call{gas: 20000, value: transaction.value}("");
        require(success, "Transaction execution failed");
        emit ExecuteTrans(msg.sender, _txIndex-1);
    }

    /**
     * @dev Functionality for removing a transaction from the logs
     * @param index Index of the transaction to be removed
     */
    function removeTx(uint256 index) public onlyRole(PARENT_ROLE) txExist(index-1) notExecuted(index-1) {
        require(index-1 < transactions.length, "Transaction doesn't exist");

        for (uint i = index-1; i < transactions.length - 1; i++) {
            transactions[i] = transactions[i + 1];
        }
        transactions.pop();
        for (uint i = 0; i < parents.length; i++) {
            isConfirmed[index-1][parents[i]] = false;
        }
        emit RemoveTrans(msg.sender, index);
    }

    /**
     * @dev Function to get the list of parents
     */
    function getParents() public view returns(address[] memory) {
        return parents;
    }

    /**
     * @dev Function to get the list of children
     */
    function getChildren() public view returns(address[] memory) {
        return children;
    }

    /**
     * @dev Function to get the count of transactions
     */
    function getTransactionCount() public view returns(uint) {
        return transactions.length;
    }

    /**
     * @dev Function to get all transactions
     */
    function getTransaction() public view returns(Transaction[] memory) {
        return transactions;
    }

    /**
     * @dev Function to get the contract balance
     */
    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function isUser(address user) public view returns(bool){
        return hasRole(PARENT_ROLE, user) || hasRole(CHILD_ROLE,user);
    }
}
