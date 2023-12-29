// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import "./Parental.sol";
contract CreateWallet{
    event created(address contractAddress);
    struct Wallet {
        Parental instance;
        bool exists;
    }

    mapping(address => Wallet) users;
    function CreateParentalWallet(address user2)public{
        Parental instance=new Parental(msg.sender,user2);
        
        users[msg.sender]=Wallet({
            instance: instance,
            exists: true
        });
        emit created(address(instance));
    }

    function joinWallet(address a,address b)public view returns(address,bool){
        Wallet memory wallet = users[a];
        require(wallet.exists,"user dont exist in system!!");
        Parental instance=wallet.instance;
        address[] memory user=instance.getUsers();
        for(uint i=0;i<user.length;i++){
            if(user[i]==b){
                return(address(instance),true);
            }
        }
        return(address(0),false);
    }


}