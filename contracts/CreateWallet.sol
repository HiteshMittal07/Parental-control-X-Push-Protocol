// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import "./Parental.sol";
contract CreateWallet{
    event created(address contractAddress);
    event joined(address contractAddress);
    // stores a wallet exist for particular user.
    struct Wallet {
        Parental instance;
        bool exists;
        bool notify;
    }
    mapping(address => Wallet) users;

    // Here you can create Parental Wallet,
    // you have to provide address of other owner of your wallet
    function CreateParentalWallet()public{
        Wallet memory wallet = users[msg.sender];
        require(!wallet.exists,"user already exist in system!!");
        Parental instance=new Parental(msg.sender);
        users[msg.sender]=Wallet({
            instance: instance,
            exists: true,
            notify: false
        });
        emit created(address(instance));
    }

    // Here while joining the wallet user have to give the owner address,
    // this will check whether this user is assosiated with the wallet of given owner address.
    function joinWallet(address a)public view returns(address){
        Wallet memory wallet = users[a];
        require(wallet.exists,"user dont exist in system!!");
        Parental instance=wallet.instance;
        address[] memory user=instance.getUsers();
        for(uint i=0;i<user.length;i++){
            if(user[i]==msg.sender){
                // emit joined(address(instance));
                return address(instance);
            }
        }
        revert("You are not User for this address");
    }

    // use to store whether a local channel for push notification is created by owner or not.
    function onNotification()public{
        Wallet storage wallet = users[msg.sender];
        require(wallet.exists,"You are not a Wallet owner!!");
        wallet.notify=true;
    }

    // return the status of notification , whether they are on or off.
    function getNotifyStatus(address a)public view returns(bool){
         Wallet storage wallet = users[a];
        require(wallet.exists,"user dont exist in system!!");
        return (wallet.notify);
    }
}