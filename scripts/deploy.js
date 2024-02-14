const hre = require("hardhat");

async function main() {
  const Create = await hre.ethers.deployContract("CreateWallet");
  await Create.waitForDeployment();

  console.log("contract Address:", Create.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
