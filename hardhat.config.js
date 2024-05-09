require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

const GOERLI_URL = process.env.GOERLI_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.6",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/006a677fe90346f9bf6cb52a2a6b340b",
      accounts: [PRIVATE_KEY],
    },
    hardhat: {
      chainId: 31337,
    },
    zkEVM: {
      url: "https://rpc.cardona.zkevm-rpc.com",
      accounts: [PRIVATE_KEY],
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io/",
      accounts: [PRIVATE_KEY],
    },
    BNB_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: [PRIVATE_KEY],
    },
  },
};
