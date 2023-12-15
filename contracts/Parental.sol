// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Parental{
    event Deposit(address indexed sender,uint amount,uint balance);
    event SubmitTrans(
        address indexed owner,
        uint indexed txIndex,
        address indexed to,
        uint value
    );
    event ConfirmTrans(address indexed owner,uint indexed txIndex);
    event RevokeTrans(address indexed owner,uint indexed txIndex);
    event ExecuteTrans(address indexed owner,uint indexed txIndex);

    address[] public owners;
    mapping (address=>bool) public isOwner;
    uint public votes;

    struct Transaction{
        address to;
        uint value;
        bool executed;
        uint noOfvotes;
    }
    mapping (uint=>mapping(address=>bool)) public isConfirmed;
    Transaction[] transactions;

    modifier onlyOwner(){
        require(isOwner[msg.sender],"You don't have acesss");
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
    constructor(address[] memory _owner,uint _votes){
        require(_owner.length>0,"at least one owner is required");
        require(_votes>0 && _votes<=_owner.length,"invalid number of required confirmations");
        for(uint i=0;i<_owner.length;i++)
        {
            address owner=_owner[i];
            require(owner!=address(0),"Invalid Owner");
            require(!isOwner[owner],"owner not unique");
            isOwner[owner]=true;
            owners.push(owner);

        }
        votes=_votes;
    }
    function ConfirmTransactions(uint _txIndex) public onlyOwner txExist(_txIndex) notExecuted(_txIndex) notConfirmed(_txIndex){
        Transaction storage t=transactions[_txIndex];
        t.noOfvotes+=1;
        isConfirmed[_txIndex][msg.sender]=true;
        emit ConfirmTrans(msg.sender, _txIndex);
    }

    function SubmitTransaction(address _to,uint _value) public{
        uint txIndex=transactions.length;
        transactions.push(Transaction({
            to:_to,
            value:_value,
            executed:false,
            noOfvotes:0
        })
        );
        emit SubmitTrans(msg.sender, txIndex, _to, _value);
    }

    function DepositEth() public payable {
        (bool success,)=address(this).call{value:msg.value}("");
        require(success, "Invalid");
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }
    receive() external payable {}
    function ExecuteTransaction(uint _txIndex)public onlyOwner txExist(_txIndex) notExecuted(_txIndex){
        Transaction storage transaction=transactions[_txIndex];
        require(transaction.noOfvotes>=votes,"cannot Execute!!");
        transaction.executed=true;
        (bool success,)=transaction.to.call{gas:20000,value:transaction.value}("");
        require(success,"Transaction failer");
        emit ExecuteTrans(msg.sender, _txIndex);
    }

   function removeTx(uint256 index)public onlyOwner txExist(index) notExecuted(index) {
        require(index<transactions.length,"tx dont exist");

        for (uint i = index; i<transactions.length-1; i++){
            transactions[i] = transactions[i+1];
        }
        transactions.pop();
    }

    function getowners() public view returns(address[] memory){
        return owners;
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