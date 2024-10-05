// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import "@openzeppelin/contracts/access/AccessControl.sol";

error TransactionDoesNotExist();
error TransactionAlreadyExecuted();
error TransactionAlreadyConfirmed();
error ChildAlreadyExist();
error ParentAlreadyExist();
error InsfficientWalletBalance();
error InsufficientRights();
error ConfirmationLimitReached();
error InvalidAddress();
error InsufficientVotes();

contract Parental is AccessControl {
    struct Transaction {
        address from;
        address to;
        uint value;
        bool executed;
        uint noOfvotes;
        uint totalVotes;
    }
    address[] private parents; // Stores the addresses of parents(owners)
    address[] private children; // Stores the addresses of users who have access to this wallet as a child.
    Transaction[] private transactions;
    mapping(uint => mapping(address => bool)) private isConfirmed;

    uint256 private votes; // Number of votes required for a transaction to be executed
    bytes32 private constant CHILD_ROLE = keccak256("CHILD_ROLE");
    bytes32 private constant PARENT_ROLE = keccak256("PARENT_ROLE");

    event Deposit(address indexed sender, uint amount);
    event ConfirmTrans(address indexed parent, uint indexed txIndex);
    event RevokeTrans(address indexed parent, uint indexed txIndex);
    event ExecuteTrans(address indexed parent, uint indexed txIndex);
    event RemoveTrans(address indexed parent, uint indexed txIndex);
    event addparent(address parent, address adder);
    event addchild(address child, address adder);
    event SubmitTrans(
        address indexed parent,
        uint indexed txIndex,
        address indexed to,
        uint value
    );

    // Modifier to check if a transaction exists
    modifier txExist(uint _txIndex) {
        if (_txIndex < transactions.length) {
            revert TransactionDoesNotExist();
        }
        _;
    }

    // Modifier to check if a transaction has not been executed
    modifier notExecuted(uint _txIndex) {
        if (!transactions[_txIndex].executed) {
            revert TransactionAlreadyExecuted();
        }
        _;
    }

    // Modifier to check if a transaction has not been confirmed by the sender
    modifier notConfirmed(uint _txIndex) {
        if (!isConfirmed[_txIndex][msg.sender]) {
            revert TransactionAlreadyConfirmed();
        }
        _;
    }

    // Constructor to set the initial parent(creator of wallet)
    constructor(address parent) {
        parents.push(parent);
        _grantRole(PARENT_ROLE, parent);
        votes = 1;
    }

    receive() external payable {}

    /**
     * @dev Functionality for depositing funds into the Parental wallet.
     */
    function DepositEth() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    /**
     * @dev Functionality for adding a child to the parental wallet
     * @param child: Address of the user being added to the parental wallet as a child
     */
    function addChild(address child) external onlyRole(PARENT_ROLE) {
        if (child != address(0)) {
            revert InvalidAddress();
        }
        if (!hasRole(CHILD_ROLE, child)) {
            revert ChildAlreadyExist();
        }
        _grantRole(CHILD_ROLE, child);
        children.push(child);
        emit addchild(child, msg.sender);
    }

    /**
     * @dev Functionality for adding another parent to the parental wallet
     * @param parent Address of the user being added to the parental wallet as an parent
     */
    function addParent(address parent) external onlyRole(PARENT_ROLE) {
        if (parent != address(0)) {
            revert InvalidAddress();
        }
        if (!hasRole(PARENT_ROLE, parent)) {
            revert ParentAlreadyExist();
        }
        _grantRole(PARENT_ROLE, parent);
        parents.push(parent);
        votes = votes + 1;
        emit addparent(parent, msg.sender);
    }

    /**
     * @dev Functionality for confirming a transaction
     * @param _txIndex Index of the transaction to be confirmed
     */
    function ConfirmTransactions(
        uint _txIndex
    )
        external
        onlyRole(PARENT_ROLE)
        txExist(_txIndex - 1)
        notExecuted(_txIndex - 1)
        notConfirmed(_txIndex - 1)
    {
        Transaction storage t = transactions[_txIndex - 1];
        if (t.noOfvotes < votes) {
            revert ConfirmationLimitReached();
        }
        if (t.value <= address(this).balance) {
            revert InsfficientWalletBalance();
        }
        t.noOfvotes += 1;
        isConfirmed[_txIndex - 1][msg.sender] = true;
        emit ConfirmTrans(msg.sender, _txIndex);
    }

    /**
     * @dev Functionality for submitting a transaction
     * @param _to Recipient address
     * @param _value Amount to be sent
     */
    function SubmitTransaction(address _to, uint _value) external {
        if (
            hasRole(PARENT_ROLE, msg.sender) || hasRole(CHILD_ROLE, msg.sender)
        ) {
            revert InsufficientRights();
        }
        transactions.push(
            Transaction({
                from: msg.sender,
                to: _to,
                value: _value,
                executed: false,
                noOfvotes: 0,
                totalVotes: votes
            })
        );
        emit SubmitTrans(msg.sender, transactions.length + 1, _to, _value);
    }

    /**
     * @dev Functionality for executing a transaction
     * @param _txIndex Index of the transaction to be executed
     */
    function ExecuteTransaction(
        uint _txIndex
    )
        external
        onlyRole(PARENT_ROLE)
        txExist(_txIndex - 1)
        notExecuted(_txIndex - 1)
    {
        Transaction storage transaction = transactions[_txIndex - 1];
        if (transaction.noOfvotes == votes) {
            revert InsufficientVotes();
        }
        transaction.executed = true;
        (bool success, ) = transaction.to.call{
            gas: 20000,
            value: transaction.value
        }("");
        require(success, "Transaction execution failed");
        emit ExecuteTrans(msg.sender, _txIndex - 1);
    }

    /**
     * @dev Functionality for removing a transaction from the logs
     * @param index Index of the transaction to be removed
     */
    function removeTx(
        uint256 index
    ) external onlyRole(PARENT_ROLE) txExist(index - 1) notExecuted(index - 1) {
        uint256 TxLen = transactions.length;
        uint256 parentLen = parents.length;
        for (uint i = index - 1; i < TxLen - 1; i++) {
            transactions[i] = transactions[i + 1];
        }
        transactions.pop();
        for (uint i = 0; i < parentLen; i++) {
            isConfirmed[index - 1][parents[i]] = false;
        }
        emit RemoveTrans(msg.sender, index);
    }

    function getParents() external view returns (address[] memory) {
        return parents;
    }

    function getChildren() external view returns (address[] memory) {
        return children;
    }

    function getTransactionCount() external view returns (uint) {
        return transactions.length;
    }

    function getTransaction() external view returns (Transaction[] memory) {
        return transactions;
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }

    function isUser(address user) external view returns (bool) {
        return hasRole(PARENT_ROLE, user) || hasRole(CHILD_ROLE, user);
    }
}