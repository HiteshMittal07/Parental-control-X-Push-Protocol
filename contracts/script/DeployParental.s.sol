// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {Parental} from "../src/Parental.sol";

contract DeployParental is Script {
    function run(address owner) external returns (Parental) {
        vm.startBroadcast();

        // Deploy CreateWallet
        Parental parental = new Parental(owner);
        vm.stopBroadcast();
        return parental;
    }
}