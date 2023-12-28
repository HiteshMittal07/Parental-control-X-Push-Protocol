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

    function joinWallet()public view returns(bool){
        Wallet memory wallet = users[msg.sender];
        Parental instance = wallet.instance;
        address[] memory user=instance.getUsers();
        for(uint i=0;i<user.length;i++){
            if(user[i]==msg.sender){
                return true;
            }
        }
        return false;
    }


}