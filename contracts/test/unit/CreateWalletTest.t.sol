// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {DeployCreateWallet} from "../../script/DeployCreateWallet.s.sol";
import {CreateWallet} from "../../src/CreateWallet.sol";

contract CreateWalletTest is Test {
    CreateWallet createWallet;
    address public USER = makeAddr("USER");

    function setUp() external {
        DeployCreateWallet deployer = new DeployCreateWallet();
        createWallet = deployer.run();
    }

    function testCreateWallet() external view {
        console.log("CreateWallet deployed at: ", address(createWallet));
    }

    function testCreateParentalWallet() external {
        createWallet.createParentalWallet();
        address wallet = createWallet.getParentalWalletAddress();
        vm.expectRevert(CreateWallet.UserAlreadyExists.selector);
        createWallet.createParentalWallet();
        console.log(wallet);
    }

    function testCreateParentalWalletDos() external {
        address user = address(20);
        uint256 gasStartOne = gasleft();
        vm.prank(user);
        createWallet.createParentalWallet();
        uint256 gasEndOne = gasleft();

        uint256 gasStart = gasleft();
        for (uint160 i = 1; i < 10; i++) {
            address user_dummy = address(i);
            vm.prank(user_dummy);
            createWallet.createParentalWallet();
        }
        uint256 gasEnd = gasleft();

        uint256 gasStartTwo = gasleft();
        createWallet.createParentalWallet();
        uint256 gasEndTwo = gasleft();

        uint256 gasStartThree = gasleft();
        vm.prank(msg.sender);
        createWallet.createParentalWallet();
        uint256 gasEndThree = gasleft();

        console.log("Gas used: ", gasStartOne - gasEndOne);
        console.log("Gas used: ", gasStart - gasEnd);
        console.log("Gas used: ", gasStartTwo - gasEndTwo);
        console.log("Gas used: ", gasStartThree - gasEndThree);
    }

    function testJoinWallet() external {
        vm.expectRevert(CreateWallet.UserDoesNotExist.selector);
        createWallet.joinWallet(address(this));

        createWallet.createParentalWallet();
        createWallet.joinWallet(address(this));

        vm.startPrank(USER);
        createWallet.createParentalWallet();

        vm.expectRevert(CreateWallet.UserNotAuthorized.selector);
        createWallet.joinWallet(address(this));
        vm.stopPrank();
    }

    function testNotification() external {
        createWallet.createParentalWallet();
        createWallet.onNotification();

        vm.prank(USER);
        vm.expectRevert(CreateWallet.UserIsNotOwner.selector);
        createWallet.onNotification();

        vm.expectRevert(CreateWallet.NotifcationAlreadySet.selector);
        createWallet.onNotification();
    }

    function testNotificationStatus() external {
        vm.expectRevert(CreateWallet.UserDoesNotExist.selector);
        assertEq(createWallet.getNotifyStatus(USER), false);

        createWallet.createParentalWallet();
        createWallet.onNotification();

        assertEq(createWallet.getNotifyStatus(address(this)), true);
    }
}
