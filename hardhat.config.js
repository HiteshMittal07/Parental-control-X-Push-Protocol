require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

const GOERLI_URL = process.env.GOERLI_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.6",
  networks: {
    sepolia: {
      url: GOERLI_URL,
      accounts: [PRIVATE_KEY],
    },
    hardhat: {
      chainId: 31337,
    },
    zkEVM: {
      url: "https://rpc.public.zkevm-test.net",
      accounts: [PRIVATE_KEY],
    },
  },
};
