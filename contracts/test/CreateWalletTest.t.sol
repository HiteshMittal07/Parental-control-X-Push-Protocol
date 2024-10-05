// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {DeployCreateWallet} from "../script/DeployCreateWallet.s.sol";
import {CreateWallet} from "../src/CreateWallet.sol";

contract CreateWalletTest is Test {
    CreateWallet createWallet;

    function setUp() external {
        DeployCreateWallet deployer = new DeployCreateWallet();
        createWallet = deployer.run();
    }

    function testCreateWallet() external {
        console.log("CreateWallet deployed at: ", address(createWallet));
    }
}
