// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Parental} from "../../src/Parental.sol";
import {Test, console} from "forge-std/Test.sol";
import {DeployParental} from "../../script/DeployParental.s.sol";

contract ParentalTest is Test {
    Parental parental;
    address PARENT = makeAddr("parent");
    address CHILD = makeAddr("child");
    address TO = makeAddr("to");
    address THIRD_PERSON = makeAddr("thirdPerson");
    uint256 AMOUNT_TO_SEND = 1 ether;
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

    // testing depositing eth to the contract
    function testDepositEth() external {
        vm.startPrank(PARENT);
        parental.depositEth{value: 1 ether}();
        assertEq(address(parental).balance, 1 ether);
        vm.stopPrank();
    }

    // testing withdrawing eth from the contract, with different reverts.
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

        vm.stopPrank();
    }

    function testRemoveChild() external {
        vm.startPrank(PARENT);
        parental.addChild(CHILD);

        // checking if child role is revoked after removal.
        parental.removeChild(CHILD);
        assertEq(parental.hasRole(CHILD_ROLE, CHILD), false);
        
        vm.expectRevert(Parental.ChildDoesNotExist.selector);
        parental.removeChild(CHILD);

        vm.expectRevert(Parental.InvalidAddress.selector);
        parental.removeChild(address(0));
        vm.stopPrank();
    }

    // testing removing parent from contract, tested removal of first parent by other parents and expected reverts in this case.
    function testRemoveParent() external {
        vm.startPrank(PARENT);
        address PARENT2 = makeAddr("parent2");
        parental.addParent(PARENT2);

        // checking if parent2 role is revoked from removal or not.
        parental.removeParent(PARENT2);
        assertEq(parental.hasRole(PARENT_ROLE, PARENT2), false);

        // after removal of parent2, if we again try to remove parent2, it should revert.
        vm.expectRevert(Parental.ParentDoesNotExist.selector);
        parental.removeParent(PARENT2);
        assertEq(parental.hasRole(PARENT_ROLE, PARENT2), false);

        // if we try to remove to address 0, it should revert.
        vm.expectRevert(Parental.InvalidAddress.selector);
        parental.removeParent(address(0));

        parental.addParent(PARENT2);
        vm.stopPrank();

        // if parent2 tries to remove parent1, it should revert as no one can remove parent1.
        vm.startPrank(PARENT2);
        vm.expectRevert(Parental.CannotRemoveFirstParent.selector);
        parental.removeParent(PARENT);

        vm.stopPrank();
    }

    function testSubmitTransaction() external {
        vm.startPrank(PARENT);
        parental.addChild(CHILD);
        parental.depositEth{value: 2 ether}();

        vm.stopPrank();
        vm.startPrank(CHILD);
        parental.submitTransaction(TO, AMOUNT_TO_SEND);
        assertEq(parental.getTransaction().length, 1);
        vm.stopPrank();

        vm.prank(THIRD_PERSON);
        vm.expectRevert(Parental.InsufficientRights.selector);
        parental.submitTransaction(TO, AMOUNT_TO_SEND);
    }
}
