// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Parental is AccessControl {
    error TransactionDoesNotExist();
    error TransactionAlreadyExecuted();
    error TransactionAlreadyConfirmed();
    error ChildAlreadyExist();
    error ParentAlreadyExist();
    error InsufficientWalletBalance();
    error InsufficientRights();
    error InvalidAddress();
    error InsufficientVotes();
    error TransferFailed();
    error AlreadyHavingChildRole();
    error AlreadyHavingParentRole();
    error ParentDoesNotExist();
    error ChildDoesNotExist();
    error CannotRemoveFirstParent();
    error TransactionNotConfirmed();
    error InvalidTransactionIndex();
    struct Transaction {
        address from;
        address to;
        uint256 value;
        bool executed;
        uint256 noOfvotes;
        uint256 totalVotes;
    }
    address[] private parents; // Stores the addresses of parents(owners)
    Transaction[] private transactions;
    mapping(uint256 => mapping(address => bool)) private isConfirmed;

    uint256 private votes; // Number of votes required for a transaction to be executed
    bytes32 private constant CHILD_ROLE = keccak256("CHILD_ROLE");
    bytes32 private constant PARENT_ROLE = keccak256("PARENT_ROLE");

    event Deposit(address indexed sender, uint256 amount);
    event Withdraw(address indexed claimer, uint256 amount);
    event ConfirmTrans(address indexed parent, uint256 indexed txIndex);
    event RevokeConfirmation(address indexed parent, uint256 indexed txIndex);
    event RevokeTrans(address indexed parent, uint256 indexed txIndex);
    event ExecuteTrans(address indexed parent, uint256 indexed txIndex);
    event RemoveTrans(address indexed parent, uint256 indexed txIndex);
    event ParentAdded(address parent, address adder);
    event ChildAdded(address child, address adder);
    event ParentRemoved(address parent, address remover);
    event ChildRemoved(address child, address remover);
    event SubmitTrans(
        address indexed parent,
        uint256 indexed txIndex,
        address indexed to,
        uint256 value
    );

    // Modifier to check if a transaction exists
    modifier txExist(uint256 _txIndex) {
        if (_txIndex <= 0) {
            revert InvalidTransactionIndex();
        }
        if (!(_txIndex - 1 < transactions.length)) {
            revert TransactionDoesNotExist();
        }
        _;
    }

    // Modifier to check if a transaction has not been executed
    modifier notExecuted(uint256 _txIndex) {
        if (transactions[_txIndex - 1].executed) {
            revert TransactionAlreadyExecuted();
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
     *
     * Anyone can add deposit funds to this parental wallet.
     */
    function depositEth() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    /**
     * @dev Functionality for withdrawing funds from the Parental wallet.
     * @param _amount: amount to be withdrawn.
     *
     * Requirnments: Only the parent can withdraw funds.
     */
    function withdrawEth(
        uint256 _amount
    ) external payable onlyRole(PARENT_ROLE) {
        if (_amount > address(this).balance) {
            revert InsufficientWalletBalance();
        }
        emit Withdraw(msg.sender, _amount);
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        if (!success) {
            revert TransferFailed();
        }
    }

    /**
     * @dev Functionality for adding a child to the parental wallet
     * @param child: Address of the user being added to the parental wallet as a child
     *
     * Notice: A user with parent role can't be assigned a child role.
     */
    function addChild(address child) external onlyRole(PARENT_ROLE) {
        if (child == address(0)) {
            revert InvalidAddress();
        }
        if (hasRole(CHILD_ROLE, child)) {
            revert ChildAlreadyExist();
        }
        if (hasRole(PARENT_ROLE, child)) {
            revert AlreadyHavingParentRole();
        }
        _grantRole(CHILD_ROLE, child);
        emit ChildAdded(child, msg.sender);
    }

    /**
     * @dev Functionality for adding another parent to the parental wallet
     * @param parent Address of the user being added to the parental wallet as an parent
     *
     * Notice: A user with child role cannot be added as a parent.
     */
    function addParent(address parent) external onlyRole(PARENT_ROLE) {
        if (parent == address(0)) {
            revert InvalidAddress();
        }
        if (hasRole(PARENT_ROLE, parent)) {
            revert ParentAlreadyExist();
        }
        if (hasRole(CHILD_ROLE, parent)) {
            revert AlreadyHavingChildRole();
        }
        _grantRole(PARENT_ROLE, parent);
        parents.push(parent);
        votes = votes + 1;
        emit ParentAdded(parent, msg.sender);
    }

    /**
     * @dev Functionality for removing a parent from the parental wallet
     * @param parent : Address of the user being removed from the parental wallet as an parent
     *
     * Notice: First parent cannot be removed.
     */
    function removeParent(address parent) external onlyRole(PARENT_ROLE) {
        if (parent == address(0)) {
            revert InvalidAddress();
        }
        if (parent == parents[0]) {
            revert CannotRemoveFirstParent();
        }
        if (!hasRole(PARENT_ROLE, parent)) {
            revert ParentDoesNotExist();
        }
        uint256 parentLen = parents.length;
        for (uint256 i = 1; i < parentLen; i++) {
            if (parents[i] == parent) {
                parents[i] = parents[parentLen - 1];
            }
        }
        parents.pop();
        _revokeRole(PARENT_ROLE, parent);
        votes = votes - 1;
        emit ParentRemoved(parent, msg.sender);
    }

    /**
     * @dev Functionality for removing a child from the parental wallet.
     * @param child : Address of the user being removed from the parental wallet as a child
     */
    function removeChild(address child) external onlyRole(PARENT_ROLE) {
        if (child == address(0)) {
            revert InvalidAddress();
        }
        if (!hasRole(CHILD_ROLE, child)) {
            revert ChildDoesNotExist();
        }
        _revokeRole(CHILD_ROLE, child);
        emit ChildRemoved(child, msg.sender);
    }

    /**
     * @dev Functionality for confirming a transaction
     * @param _txIndex Index of the transaction to be confirmed
     */
    function confirmTransactions(
        uint256 _txIndex
    ) external onlyRole(PARENT_ROLE) txExist(_txIndex) notExecuted(_txIndex) {
        if (isConfirmed[_txIndex - 1][msg.sender]) {
            revert TransactionAlreadyConfirmed();
        }
        Transaction storage t = transactions[_txIndex - 1];
        if (!(t.value <= address(this).balance)) {
            revert InsufficientWalletBalance();
        }
        t.noOfvotes += 1;
        isConfirmed[_txIndex - 1][msg.sender] = true;
        emit ConfirmTrans(msg.sender, _txIndex - 1);
    }

    /**
     * @dev Functionality for revoking a confirmation
     * @param _txIndex : Index of the transaction confirmation to be revoked
     */
    function revokeConfirmation(
        uint256 _txIndex
    ) external onlyRole(PARENT_ROLE) txExist(_txIndex) notExecuted(_txIndex) {
        if (!isConfirmed[_txIndex - 1][msg.sender]) {
            revert TransactionNotConfirmed();
        }
        Transaction storage t = transactions[_txIndex - 1];
        t.noOfvotes -= 1;
        isConfirmed[_txIndex - 1][msg.sender] = false;
        emit RevokeConfirmation(msg.sender, _txIndex - 1);
    }

    /**
     * @dev Functionality for submitting a transaction
     * @param _to Recipient address
     * @param _value Amount to be sent
     *
     * Notice: Anyone with child and parent role can submit a transaction.
     */
    function submitTransaction(address _to, uint256 _value) external {
        if (
            !(hasRole(PARENT_ROLE, msg.sender) ||
                hasRole(CHILD_ROLE, msg.sender))
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
    function executeTransaction(
        uint256 _txIndex
    ) external onlyRole(PARENT_ROLE) txExist(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex - 1];
        if (!(transaction.noOfvotes == votes)) {
            revert InsufficientVotes();
        }
        transaction.executed = true;
        emit ExecuteTrans(msg.sender, _txIndex - 1);
        (bool success, ) = transaction.to.call{
            gas: 20000,
            value: transaction.value
        }("");
        if (!success) {
            revert TransferFailed();
        }
    }

    /**
     * @dev Functionality for removing a transaction from the logs
     * @param _txIndex Index of the transaction to be removed
     */
    function removeTx(
        uint256 _txIndex
    ) external onlyRole(PARENT_ROLE) txExist(_txIndex) notExecuted(_txIndex) {
        uint256 TxLen = transactions.length;
        uint256 parentLen = parents.length;
        if (TxLen == _txIndex) {
            transactions.pop();
            return;
        }
        for (uint256 i = _txIndex - 1; i < TxLen - 1; i++) {
            unchecked {
                transactions[i] = transactions[i + 1];
            }
        }
        transactions.pop();
        if (transactions[_txIndex - 1].noOfvotes > 0) {
            for (uint256 i = 0; i < parentLen; i++) {
                unchecked {
                    if (isConfirmed[_txIndex - 1][parents[i]]) {
                        isConfirmed[_txIndex - 1][parents[i]] = false;
                    }
                }
            }
        }
        emit RemoveTrans(msg.sender, _txIndex - 1);
    }

    /// Getter functions

    function getParents() external view returns (address[] memory) {
        return parents;
    }

    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }

    function getTransaction() external view returns (Transaction[] memory) {
        return transactions;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function isUser(address user) external view returns (bool) {
        return hasRole(PARENT_ROLE, user) || hasRole(CHILD_ROLE, user);
    }

    function getIsConfirmed(
        uint256 _txIndex,
        address _parent
    ) external view returns (bool) {
        if (_txIndex <= 0) {
            revert InvalidTransactionIndex();
        }
        return isConfirmed[_txIndex - 1][_parent];
    }
}
