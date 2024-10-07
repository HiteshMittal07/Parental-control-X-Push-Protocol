// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Parental} from "../../src/Parental.sol";
import {Test, console} from "forge-std/Test.sol";
import {DeployParental} from "../../script/DeployParental.s.sol";

contract ParentalTest is Test {
    Parental parental;
    address PARENT = makeAddr("parent");
    address CHILD = makeAddr("child");
    bytes32 private constant CHILD_ROLE = keccak256("CHILD_ROLE");
    bytes32 private constant PARENT_ROLE = keccak256("PARENT_ROLE");

    function setUp() external {
        DeployParental deployer = new DeployParental();
        parental = deployer.run(PARENT);
        vm.deal(PARENT, 10 ether);
    }

    function testParentRole() external view {
        assertEq(parental.hasRole(PARENT_ROLE, PARENT), true);
    }

    function testDepositEth() external {
        vm.startPrank(PARENT);
        parental.depositEth{value: 1 ether}();
        assertEq(address(parental).balance, 1 ether);
        vm.stopPrank();
    }

    function testWithdrawEth() external {
        vm.startPrank(PARENT);
        parental.depositEth{value: 2 ether}();
        parental.withdrawEth(1 ether);
        assertEq(address(parental).balance, 1 ether);

        parental.depositEth{value: 1 ether}();
        vm.expectRevert(Parental.InsufficientWalletBalance.selector);
        parental.withdrawEth(3 ether);
        vm.stopPrank();
    }

    function testAddChild() external {
        vm.startPrank(PARENT);
        parental.addChild(CHILD);

        vm.expectRevert(Parental.ChildAlreadyExist.selector);
        parental.addChild(CHILD);

        vm.expectRevert(Parental.InvalidAddress.selector);
        parental.addChild(address(0));

        assertEq(parental.hasRole(CHILD_ROLE, CHILD), true);

        vm.expectRevert(Parental.AlreadyHavingParentRole.selector);
        parental.addChild(PARENT);
        vm.stopPrank();
    }

    function testAddParent() external {
        vm.startPrank(PARENT);
        address PARENT2 = makeAddr("parent2");
        parental.addParent(PARENT2);

        vm.expectRevert(Parental.ParentAlreadyExist.selector);
        parental.addParent(PARENT2);

        vm.expectRevert(Parental.InvalidAddress.selector);
        parental.addParent(address(0));

        parental.addChild(address(1));
        vm.expectRevert(Parental.AlreadyHavingChildRole.selector);
        parental.addParent(address(1));
    }

    function testRemoveChild() external {
        vm.startPrank(PARENT);
        parental.addChild(CHILD);

        parental.removeChild(CHILD);
        assertEq(parental.hasRole(CHILD_ROLE, CHILD), false);
    }
}
