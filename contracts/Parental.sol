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
    event SetOwner(bool status);
    event Signup(bool status);
    event login(bool status);
    event ConfirmTrans(address indexed owner,uint indexed txIndex);
    event RevokeTrans(address indexed owner,uint indexed txIndex);
    event ExecuteTrans(address indexed owner,uint indexed txIndex);

    struct Transaction{
        address to;
        uint value;
        bool executed;
        uint noOfvotes;
        string message;
    }
    mapping(address=>Transaction[]) Txs;
    mapping(address=>bool) private users;
    mapping(address=>string) private data;
    mapping(address=>bool) private Ownersetted;
    mapping(address=>address[2]) private OwnerOfUsers;
    mapping (address=>mapping (address=>bool)) public isOwner;
    mapping(address=>uint) private votes;
    mapping(address=>mapping (uint=>mapping(address=>bool))) public isConfirmed;
    // Transaction[] transactions;

    modifier onlyOwner(address a){
        require(isOwner[a][msg.sender],"You don't have acesss");
        _;
    }
    modifier txExist(address a,uint _txIndex){
        require(_txIndex<Txs[a].length,"This Transaction Doesn't exist");
        _;
    }
    modifier notExecuted(address a,uint _txIndex){
        require(!Txs[a][_txIndex].executed,"This transacton is already executed");
        _;
    }
    modifier notConfirmed(address a,uint _txIndex){
        require(!isConfirmed[a][_txIndex][msg.sender],"transaction is already confirmed");
        _;
    }
    modifier userExist(address a){
        require(users[a]!=true,"User already exist");
        _;
    }
    modifier userNotExist(address a){
        require(users[a]==true,"User not exist");
        _;
    }
    mapping(address=>uint) balances;
    modifier ownerSetted(address a){
        require(Ownersetted[a]!=true,"Owners already exists for this user");
        _;
    }
    function SignUp(address a,string memory SetPassword) public userExist(a) {
        users[a]=true;
        data[a]=SetPassword;
        emit Signup(true);
    }
    function Login(address a,string memory password) public userNotExist(a){
        require(keccak256(abi.encodePacked(password))==keccak256(abi.encodePacked(data[a])),"password not correct");
        emit login(true);
    }
    function setOwners(address a,address father, address mother,uint vote) public ownerSetted(a){
        require(vote<=2,"maximum limit of votes is 2");
        OwnerOfUsers[a][0]=father;
        OwnerOfUsers[a][1]=mother;
        votes[a]=vote;
        Ownersetted[a]=true;
        isOwner[a][father]=true;
        isOwner[a][mother]=true;
        emit SetOwner(true);
    }
    function ConfirmTransactions(address a,uint _txIndex) public onlyOwner(a) txExist(a,_txIndex) notExecuted(a,_txIndex) notConfirmed(a,_txIndex){
        Transaction storage t=Txs[a][_txIndex];
        t.noOfvotes+=1;
        isConfirmed[a][_txIndex][msg.sender]=true;
        emit ConfirmTrans(msg.sender, _txIndex);
    }

    function SubmitTransaction(address a,address _to,uint _value,string memory msg1) public{
        uint txIndex=Txs[a].length;
        Txs[a].push(Transaction({
            to:_to,
            value:_value,
            executed:false,
            noOfvotes:0,
            message: msg1
        })
        );
        emit SubmitTrans(msg.sender, txIndex, _to, _value);
    }

    function DepositEth(address a) public payable {
        balances[a]+=msg.value;
        emit Deposit(msg.sender, msg.value, balances[a]);
    }
    receive() external payable {}
    function ExecuteTransaction(address a,uint _txIndex)public onlyOwner(a) txExist(a,_txIndex) notExecuted(a,_txIndex){
        Transaction storage transaction=Txs[a][_txIndex];
        require(transaction.noOfvotes>=votes[a],"cannot Execute!!");
        transaction.executed=true;
        (bool success,)=transaction.to.call{gas:20000,value:transaction.value}("");
        require(success,"Transaction failer");
        emit ExecuteTrans(msg.sender, _txIndex);
    }

   function removeTx(address a,uint256 index)public onlyOwner(a) txExist(a,index) notExecuted(a,index) {
        require(index<Txs[a].length,"tx dont exist");

        for (uint i = index; i<Txs[a].length-1; i++){
            Txs[a][i] = Txs[a][i+1];
        }
        Txs[a].pop();
    }

    function getowners(address a) public view returns(address[2]memory){
        return OwnerOfUsers[a];
    }
    function getTransactionCount(address a) public view returns(uint){
        return Txs[a].length;
    }
    function getTransaction(address a)public view returns(Transaction[] memory) {
        return Txs[a];
    }
    function getBalance(address a)public view returns(uint) {
        return balances[a];
    }
}