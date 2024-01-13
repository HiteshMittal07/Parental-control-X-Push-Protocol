// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import "./Parental.sol";
contract CreateWallet{
    event created(address contractAddress);
    event joined(address contractAddress);
    struct Wallet {
        Parental instance;
        bool exists;
    }
    mapping(address => Wallet) users;
    function CreateParentalWallet(address user2)public{
<<<<<<< HEAD
        Parental instance=new Parental(msg.sender,user2);
        
=======
        Wallet memory wallet = users[msg.sender];
        require(!wallet.exists,"user already exist in system!!");
        Parental instance=new Parental(msg.sender,user2);
>>>>>>> 09d64b6 (adding push notifications)
        users[msg.sender]=Wallet({
            instance: instance,
            exists: true
        });
        emit created(address(instance));
    }

    function joinWallet(address a)public{
        Wallet memory wallet = users[a];
        require(wallet.exists,"user dont exist in system!!");
        Parental instance=wallet.instance;
        address[] memory user=instance.getUsers();
        for(uint i=0;i<user.length;i++){
            if(user[i]==msg.sender){
                emit joined(address(instance));
                return;
            }
        }
        revert("You are not User for this address");
    }
}