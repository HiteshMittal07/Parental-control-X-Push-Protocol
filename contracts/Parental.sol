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
    event Signup(bool status);
    event login(bool status);
    event ConfirmTrans(address indexed owner,uint indexed txIndex);
    event RevokeTrans(address indexed owner,uint indexed txIndex);
    event ExecuteTrans(address indexed owner,uint indexed txIndex);

    // uint public votes;

    struct Transaction{
        address to;
        uint value;
        bool executed;
        uint noOfvotes;
    }
    // struct User{
    //     address add;
    //     string password;
    // }
    mapping(address=>bool) private users;
    mapping(address=>string) private data;
    mapping(address=>bool) private Ownersetted;
    mapping(address=>address[2]) private OwnerOfUsers;
    mapping (address=>mapping (address=>bool)) public isOwner;
    mapping(address=>uint) private votes;
    mapping (uint=>mapping(address=>bool)) public isConfirmed;
    Transaction[] transactions;

    modifier onlyOwner(address a){
        require(isOwner[a][msg.sender],"You don't have acesss");
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
    modifier userExist(address a){
        require(users[a]!=true,"User already exist");
        _;
    }
    modifier userNotExist(address a){
        require(users[a]==true,"User not exist");
        _;
    }
    modifier ownerSetted(address a){
        require(Ownersetted[a]!=true,"Owners already exists for this user");
        _;
    }
    // constructor(){
    //     require(_owner.length>0,"at least one owner is required");
    //     require(_votes>0 && _votes<=_owner.length,"invalid number of required confirmations");
    //     for(uint i=0;i<_owner.length;i++)
    //     {
    //         address owner=_owner[i];
    //         require(owner!=address(0),"Invalid Owner");
    //         require(!isOwner[owner],"owner not unique");
    //         isOwner[owner]=true;
    //         owners.push(owner);

    //     }
    //     votes=_votes;
    // }
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
        OwnerOfUsers[a][0]=father;
        OwnerOfUsers[a][1]=mother;
        votes[a]=vote;
        Ownersetted[a]=true;
        isOwner[a][father]=true;
        isOwner[a][mother]=true;
    }
    function ConfirmTransactions(address a,uint _txIndex) public onlyOwner(a) txExist(_txIndex) notExecuted(_txIndex) notConfirmed(_txIndex){
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
    function ExecuteTransaction(address a,uint _txIndex)public onlyOwner(a) txExist(_txIndex) notExecuted(_txIndex){
        Transaction storage transaction=transactions[_txIndex];
        require(transaction.noOfvotes>=votes[a],"cannot Execute!!");
        transaction.executed=true;
        (bool success,)=transaction.to.call{gas:20000,value:transaction.value}("");
        require(success,"Transaction failer");
        emit ExecuteTrans(msg.sender, _txIndex);
    }

   function removeTx(address a,uint256 index)public onlyOwner(a) txExist(index) notExecuted(index) {
        require(index<transactions.length,"tx dont exist");

        for (uint i = index; i<transactions.length-1; i++){
            transactions[i] = transactions[i+1];
        }
        transactions.pop();
    }

    // function getowners() public view returns(address[] memory){
    //     return owners;
    // }
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