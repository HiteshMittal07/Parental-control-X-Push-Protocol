// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Parental{
<<<<<<< HEAD
    event Deposit(address indexed sender,uint amount);
=======

    // events for every function invocations
    event Deposit(address indexed sender,uint amount,uint balance);
>>>>>>> babb6ecf041a36db3aabae3c7b31bec2557bc58d
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
<<<<<<< HEAD
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
=======
    // for every user address it store dynamic number of transactions.
    mapping(address=>Transaction[]) Txs;

    // kind of save the address of user who log in.
    mapping(address=>bool) private users;

    // stores password with user address as key
    mapping(address=>string) private data;

    // checks it for particular user , owners are selected or not.
    mapping(address=>bool) private Ownersetted;

    // contain info owners of particular user.
    mapping(address=>address[2]) private OwnerOfUsers;

    // contain if a particular address for user address is owner or not.
    mapping (address=>mapping (address=>bool)) public isOwner;

    // contain info about number of votes choosen for particular user.
    mapping(address=>uint) private votes;

    // for particular user -> particular transaction -> by particular owner -> confirmed or not
    mapping(address=>mapping (uint=>mapping(address=>bool))) public isConfirmed;

    // ensures contract balances and user balance is differ.
    mapping(address=>uint) balances;
    
    modifier onlyOwner(address a){
        require(isOwner[a][msg.sender],"You don't have acesss");
>>>>>>> babb6ecf041a36db3aabae3c7b31bec2557bc58d
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
    function setUsers(address[] memory user) public onlyOwner(){
        require(user.length>0,"At least one user is required");
        for(uint i=0;i<user.length;i++)
        {
            address user1=user[i];
            require(user1!=address(0),"Invalid Owner");
            require(!isUser[user1],"user is not unique");
            isUser[user1]=true;
            users.push(user1);

        }
    }
<<<<<<< HEAD
    function ConfirmTransactions(uint _txIndex) public onlyOwner() txExist(_txIndex) notExecuted(_txIndex) notConfirmed(_txIndex){
        Transaction storage t=transactions[_txIndex];
        require(t.value<=address(this).balance,"Please add more Balance to Confirm");
=======
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
>>>>>>> babb6ecf041a36db3aabae3c7b31bec2557bc58d
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
