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
    uint256 DEPOSIT_AMOUNT = 2 ether;
    uint256 VALID_INDEX = 1;
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
        console.log(address(parental).balance);
        parental.depositEth{value: DEPOSIT_AMOUNT}();
        assertEq(address(parental).balance, DEPOSIT_AMOUNT);
        vm.stopPrank();
    }

    // testing withdrawing eth from the contract, with different reverts.
    function testWithdrawEth() external {
        vm.startPrank(PARENT);
        parental.depositEth{value: DEPOSIT_AMOUNT}();
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
        parental.depositEth{value: DEPOSIT_AMOUNT}();

        vm.stopPrank();
        vm.startPrank(CHILD);
        parental.submitTransaction(TO, AMOUNT_TO_SEND);
        assertEq(parental.getTransaction().length, 1);
        vm.stopPrank();

        vm.prank(THIRD_PERSON);
        vm.expectRevert(Parental.InsufficientRights.selector);
        parental.submitTransaction(TO, AMOUNT_TO_SEND);
    }

    function testConfirmTransaction() external {
        vm.startPrank(PARENT);
        parental.addChild(CHILD);
        address PARENT2 = makeAddr("parent2");
        parental.addParent(PARENT2);
        parental.depositEth{value: 1 ether}();
        parental.submitTransaction(TO, AMOUNT_TO_SEND);
        parental.confirmTransactions(1);
        assertEq(parental.getTransaction()[0].noOfvotes, 1);

        // reverting if transaction is already confirmed by a parent
        vm.expectRevert(Parental.TransactionAlreadyConfirmed.selector);
        parental.confirmTransactions(1);

        // reverting if transaction index is invalid or we can if it is less than 0;
        vm.expectRevert(Parental.InvalidTransactionIndex.selector);
        parental.confirmTransactions(0);
        vm.stopPrank();

        // confirmation by other parents also
        vm.startPrank(PARENT2);
        parental.confirmTransactions(1);
        assertEq(parental.getTransaction()[0].noOfvotes, 2);
        vm.stopPrank();

        // reverting on confirmation try by child
        vm.startPrank(CHILD);
        vm.expectRevert();
        parental.confirmTransactions(0);

        parental.submitTransaction(TO, 2 ether);
        vm.stopPrank();

        vm.prank(PARENT);
        vm.expectRevert(Parental.InsufficientWalletBalance.selector);
        parental.confirmTransactions(2);
    }

    function testRevokeConfirmations() external {
        vm.startPrank(PARENT);
        parental.depositEth{value: DEPOSIT_AMOUNT}();
        parental.submitTransaction(TO, AMOUNT_TO_SEND);
        parental.confirmTransactions(VALID_INDEX);

        parental.revokeConfirmation(VALID_INDEX);
        assertEq(parental.getIsConfirmed(VALID_INDEX, PARENT), false);

        parental.submitTransaction(TO, AMOUNT_TO_SEND);
        vm.expectRevert(Parental.TransactionNotConfirmed.selector);
        parental.revokeConfirmation(VALID_INDEX + 1);
    }

    function testExecuteConfirmations() external {
        vm.startPrank(PARENT);
        parental.depositEth{value: DEPOSIT_AMOUNT}();
        parental.addChild(CHILD);
        parental.submitTransaction(TO, AMOUNT_TO_SEND);
        parental.confirmTransactions(VALID_INDEX);

        parental.executeTransaction(VALID_INDEX);
        assertEq(parental.getTransaction()[0].executed, true);
        vm.expectRevert(Parental.TransactionAlreadyExecuted.selector);
        parental.executeTransaction(VALID_INDEX);
        assertEq(address(parental).balance, DEPOSIT_AMOUNT - AMOUNT_TO_SEND);
        assertEq(address(TO).balance, AMOUNT_TO_SEND);
        vm.stopPrank();

        vm.prank(CHILD);
        parental.submitTransaction(TO, AMOUNT_TO_SEND);

        vm.startPrank(PARENT);
        vm.expectRevert(Parental.InsufficientVotes.selector);
        parental.executeTransaction(VALID_INDEX + 1);
    }

    function testRemoveTransactions() external {
        vm.startPrank(PARENT);
        parental.depositEth{value: DEPOSIT_AMOUNT}();
        parental.addChild(CHILD);
        parental.submitTransaction(TO, AMOUNT_TO_SEND);
        parental.confirmTransactions(VALID_INDEX);
        parental.removeTx(VALID_INDEX);
        assertEq(parental.getTransaction().length, 0);

        parental.submitTransaction(TO, AMOUNT_TO_SEND);
        parental.submitTransaction(TO, AMOUNT_TO_SEND);

        parental.removeTx(VALID_INDEX);
        assertEq(parental.getTransactionCount(), 1);

        vm.stopPrank();
    }

    function testRemoveTransactionsForGas() external {
        vm.startPrank(PARENT);
        for (uint256 i = 0; i < 100; i++) {
            parental.submitTransaction(TO, AMOUNT_TO_SEND);
        }
        uint256 gasStart = gasleft();
        parental.removeTx(VALID_INDEX);
        uint256 gasEnd = gasleft();
        console.log("Gas used for removeTx: ", gasStart - gasEnd);
    }
}
