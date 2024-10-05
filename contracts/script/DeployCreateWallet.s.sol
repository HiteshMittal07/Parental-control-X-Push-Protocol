// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {CreateWallet} from "../src/CreateWallet.sol";

contract DeployCreateWallet is Script {
    function run() external returns (CreateWallet) {
        vm.startBroadcast();

        // Deploy CreateWallet
        CreateWallet createWallet = new CreateWallet();

        vm.stopBroadcast();
        return createWallet;
    }
}
