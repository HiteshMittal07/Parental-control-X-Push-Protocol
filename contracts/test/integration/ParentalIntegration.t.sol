// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {DeployCreateWallet} from "../../script/DeployCreateWallet.s.sol";
import {CreateWallet} from "../../src/CreateWallet.sol";

contract ParentalIntegrationTest is Test {
    CreateWallet createWallet;

    function setUp() public {
        DeployCreateWallet deployer = new DeployCreateWallet();
        createWallet = deployer.run();
    }

    function testWallet() public {
        vm.recordLogs();

        // Call the function to test
        createWallet.createParentalWallet();
        console.log(createWallet.getParentalWalletAddress());
        // Fetch the logs after the function call
        Vm.Log[] memory logs = vm.getRecordedLogs();

        // Make sure at least one log is recorded
        // assertEq(logs.length, 1, "No events were emitted");

        // Decode the first log as the 'created' event

        console.log(address(logs[0].emitter));
    }
}
