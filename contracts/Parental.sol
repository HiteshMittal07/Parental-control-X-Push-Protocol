// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Parental{
    // events for every function
    event Deposit(address indexed sender,uint amount);
    event SubmitTrans(
        address indexed owner,
        uint indexed txIndex,
        address indexed to,
        uint value
    );
    event ConfirmTrans(address indexed owner,uint indexed txIndex);
    event RevokeTrans(address indexed owner,uint indexed txIndex);
    event ExecuteTrans(address indexed owner,uint indexed txIndex);
    event RemoveTrans(address indexed owner, uint indexed txIndex);

    // stores the address of owners.
    address[] owners;
    // address of multiple user to whom access is granted to this wallet
    address[] users;
    mapping(address=>bool) isUser;
    mapping(address=>bool) isOwner;
    uint public votes;

    struct Transaction{
        address from;
        address to;
        uint value;
        bool executed;
        uint noOfvotes;
        string message;
        uint totalVotes;
    }
    mapping (uint=>mapping(address=>bool)) public isConfirmed;
    Transaction[] public transactions;

    // here first owner is msg.sender and second address is given by the msg.sender in the client side.
    constructor(address owner) {
        owners.push(owner);
        users.push(owner);
        isUser[owner]=true;
        isOwner[owner]=true;
        votes=1;
    }

    modifier onlyOwner(){
        require(isOwner[msg.sender],"You don't have acesss");
        _;
    }
    modifier onlyUser(){
        require(isUser[msg.sender],"You don't have acesss");
        _;
    }
    modifier txExist(uint _txIndex){
        require(_txIndex<transactions.length,"This Transaction Doesn't exist");
        _;
    }
     modifier notExecuted(uint _txIndex){
        require(!transactions[_txIndex].executed,"This transacton is already executed");
        _;
    }
    modifier notConfirmed(uint _txIndex){
        require(!isConfirmed[_txIndex][msg.sender],"transaction is already confirmed");
        _;
    }

    // provides functionality to add user for this wallet
    function addUser(address user) public onlyOwner(){
        require(user!=address(0),"Invalid Owner");
        require(!isUser[user],"user is not unique");
        isUser[user]=true;
        users.push(user);
    }
    function addOwner(address owner) public onlyOwner(){
        require(owner!=address(0),"Invalid Owner");
        require(!isOwner[owner],"user is not unique");
        isOwner[owner]=true;
        isUser[owner]=true;
        owners.push(owner);
        users.push(owner);
        votes=votes+1;
    }
    function ConfirmTransactions(uint _txIndex) public onlyOwner() txExist(_txIndex-1) notExecuted(_txIndex-1) notConfirmed(_txIndex-1){
        Transaction storage t=transactions[_txIndex-1];
        require(t.noOfvotes<votes,"Transaction already have required no of votes");
        require(t.value<=address(this).balance,"Please add more Balance to Confirm");
        t.noOfvotes+=1;
        isConfirmed[_txIndex-1][msg.sender]=true;
        emit ConfirmTrans(msg.sender, _txIndex);
    }

    function SubmitTransaction(address _to,uint _value,string memory msg1) onlyUser() public{
        uint txIndex=transactions.length;
        transactions.push(Transaction({
            from: msg.sender,
            to:_to,
            value:_value,
            executed:false,
            noOfvotes:0,
            message: msg1,
            totalVotes: votes
        })
        );
        emit SubmitTrans(msg.sender, txIndex+1, _to, _value);
    }

    function DepositEth() public payable {
        emit Deposit(msg.sender, msg.value);
    }
    receive() external payable {}
    function ExecuteTransaction(uint _txIndex)public onlyOwner() txExist(_txIndex) notExecuted(_txIndex){
        Transaction storage transaction=transactions[_txIndex-1];
        require(transaction.noOfvotes==votes,"cannot Execute!!");
        transaction.executed=true;
        (bool success,)=transaction.to.call{gas:20000,value:transaction.value}("");
        require(success,"Transaction failer");
        emit ExecuteTrans(msg.sender, _txIndex-1);
    }

   function removeTx(uint256 index)public onlyOwner() txExist(index-1) notExecuted(index-1) {
        require(index-1<transactions.length,"tx dont exist");

        for (uint i = index-1; i<transactions.length-1; i++){
            transactions[i] = transactions[i+1];
        }
        transactions.pop();
        for(uint i=0;i<owners.length;i++){
            isConfirmed[index-1][owners[i]]=false;
        }
        emit RemoveTrans(msg.sender, index);
    }
    function deleteFunds()public onlyOwner(){
        selfdestruct(payable(owners[0]));
    }

    function getOwners() public view returns(address[]memory){
        return owners;
    }
    function getUsers() public view returns(address[]memory){
        return users;
    }
    function getTransactionCount() public view returns(uint){
        return transactions.length;
    }
    function getTransaction()public view returns(Transaction[] memory) {
        return transactions;
    }
    function getBalance()public view returns(uint) {
        return address(this).balance;
    }
}