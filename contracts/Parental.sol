// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Parental{
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
    address[2] owners;
    address[] users;
    mapping(address=>bool) isUser;
    uint public votes;

    struct Transaction{
        address to;
        uint value;
        bool executed;
        uint noOfvotes;
        string message;
    }
    mapping (uint=>mapping(address=>bool)) public isConfirmed;
    Transaction[] public transactions;
    constructor(address father, address mother) {
        owners[0]=father;
        owners[1]=mother;
        users.push(father);
        users.push(mother);
        isUser[father]=true;
        isUser[mother]=true;
    }

    modifier onlyOwner(){
        require(msg.sender==owners[0] || msg.sender==owners[1],"You don't have acesss");
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
    function addUser(address user) public onlyOwner(){
        require(user!=address(0),"Invalid Owner");
        require(!isUser[user],"user is not unique");
        isUser[user]=true;
        users.push(user);
    }
    function ConfirmTransactions(uint _txIndex) public onlyOwner() txExist(_txIndex) notExecuted(_txIndex) notConfirmed(_txIndex){
        Transaction storage t=transactions[_txIndex];
        require(t.value<=address(this).balance,"Please add more Balance to Confirm");
        t.noOfvotes+=1;
        isConfirmed[_txIndex][msg.sender]=true;
        emit ConfirmTrans(msg.sender, _txIndex);
    }

    function SubmitTransaction(address _to,uint _value,string memory msg1) onlyUser() public{
        uint txIndex=transactions.length;
        transactions.push(Transaction({
            to:_to,
            value:_value,
            executed:false,
            noOfvotes:0,
            message: msg1
        })
        );
        emit SubmitTrans(msg.sender, txIndex, _to, _value);
    }

    function DepositEth() public payable {
        emit Deposit(msg.sender, msg.value);
    }
    receive() external payable {}
    function ExecuteTransaction(uint _txIndex)public onlyOwner() txExist(_txIndex) notExecuted(_txIndex){
        Transaction storage transaction=transactions[_txIndex];
        require(transaction.noOfvotes>=votes,"cannot Execute!!");
        transaction.executed=true;
        (bool success,)=transaction.to.call{gas:20000,value:transaction.value}("");
        require(success,"Transaction failer");
        emit ExecuteTrans(msg.sender, _txIndex);
    }

   function removeTx(uint256 index)public onlyOwner() txExist(index) notExecuted(index) {
        require(index<transactions.length,"tx dont exist");

        for (uint i = index; i<transactions.length-1; i++){
            transactions[i] = transactions[i+1];
        }
        transactions.pop();
    }
    function deleteFunds()public onlyOwner(){
        selfdestruct(payable(owners[0]));
    }

    function getOwners() public view returns(address[2]memory){
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