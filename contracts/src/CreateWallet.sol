// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./Parental.sol";

contract CreateWallet {
    error UserAlreadyExists();
    error UserDoesNotExist();
    error UserNotAuthorized();
    error UserIsNotOwner();
    error NotifcationAlreadySet();
    struct Wallet {
        Parental instance;
        bool exists;
        bool notify;
    }
    mapping(address => Wallet) private users;

    event Created(address contractAddress);
    event NotifcationTurnedOn(address contractAddress, address user);

    /**
     *  @dev : Creates new Parental wallet and owner of wallet is creator of wallet.
     */
    function createParentalWallet() external {
        Wallet memory wallet = users[msg.sender];
        if (wallet.exists) {
            revert UserAlreadyExists();
        }
        Parental instance = new Parental(msg.sender);
        users[msg.sender] = Wallet({
            instance: instance,
            exists: true,
            notify: false
        });
        emit Created(address(instance));
    }

    /**
     * @dev : here wallet owner can turn on the service for notification.
     */
    function onNotification() external {
        Wallet storage wallet = users[msg.sender];
        if (!wallet.exists) {
            revert UserIsNotOwner();
        } else if (wallet.notify) {
            revert NotifcationAlreadySet();
        }
        wallet.notify = true;
        emit NotifcationTurnedOn(address(wallet.instance), msg.sender);
    }

    /**
     * @dev : returns contract address of parental wallet which creator created while creating wallet.
     * @param : it's the owner address who created the wallet , user of wallet can join by providing the address of wallet of owner.
     */
    function joinWallet(address a) external view returns (address) {
        Wallet memory wallet = users[a];
        if (!wallet.exists) {
            revert UserDoesNotExist();
        }
        Parental instance = wallet.instance;
        if (instance.isUser(msg.sender)) {
            return address(instance);
        } else {
            revert UserNotAuthorized();
        }
    }

    /**
     * @dev : it returns whether notification service are turned on by the wallet owner or not.
     * @param : "a" is owner address here
     */
    function getNotifyStatus(address a) external view returns (bool) {
        Wallet memory wallet = users[a];
        if (!wallet.exists) {
            revert UserDoesNotExist();
        }
        return (wallet.notify);
    }

    function getParentalWalletAddress() external view returns (address) {
        return address(users[msg.sender].instance);
    }
}
