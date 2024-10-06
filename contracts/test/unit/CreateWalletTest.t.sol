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
        createWallet.CreateParentalWallet();
        address wallet = createWallet.getParentalWalletAddress();
        vm.expectRevert(CreateWallet.UserAlreadyExists.selector);
        createWallet.CreateParentalWallet();
        console.log(wallet);
    }

    function testJoinWallet() external {
        vm.expectRevert(CreateWallet.UserDoesNotExist.selector);
        createWallet.joinWallet(address(this));

        createWallet.CreateParentalWallet();
        createWallet.joinWallet(address(this));

        vm.startPrank(USER);
        createWallet.CreateParentalWallet();

        vm.expectRevert(CreateWallet.UserNotAuthorized.selector);
        createWallet.joinWallet(address(this));
        vm.stopPrank();
    }

    function testNotification() external {
        createWallet.CreateParentalWallet();
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

        createWallet.CreateParentalWallet();
        createWallet.onNotification();

        assertEq(createWallet.getNotifyStatus(address(this)), true);
    }
}
