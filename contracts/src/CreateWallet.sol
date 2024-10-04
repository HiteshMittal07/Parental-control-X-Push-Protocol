// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import "./Parental.sol";
contract CreateWallet{
    event created(address contractAddress);
    // stores wallet information.
    struct Wallet {
        Parental instance;
        bool exists;
        bool notify;
    }
    
    mapping(address => Wallet) users; // stores the user address mapping with thier parental wallet info.

    /** @dev : Creates new Parental wallet and owner of wallet is creator of wallet. 
     */
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

    /**
     * @dev : returns contract address of parental wallet which creator created while creating wallet.
     * @param : it's the owner address who created the wallet , user of wallet can join by providing the address of wallet of owner.
     */
    function joinWallet(address a)public view returns(address){
        Wallet memory wallet = users[a];
        require(wallet.exists,"user dont exist in system!!");
        Parental instance=wallet.instance;
        if(instance.isUser(msg.sender)){
            return address(instance);
        }
        revert("You are not User for this address");
    }
    /**
     * @dev : here wallet owner can turn on the service for notification.
     */

    function onNotification()public{
        Wallet storage wallet = users[msg.sender];
        require(wallet.exists,"You are not a Wallet owner!!");
        wallet.notify=true;
    }

    /**
     * @dev : it returns whether notification service are turned on by the wallet owner or not. 
     * @param : "a" is owner address here
     */
    function getNotifyStatus(address a)public view returns(bool){
         Wallet storage wallet = users[a];
        require(wallet.exists,"user dont exist in system!!");
        return (wallet.notify);
    }
}