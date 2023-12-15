const hre = require("hardhat");

async function main() {

  const parental = await hre.ethers.deployContract("Parental");
  // const parental = await hre.ethers.deployContract("Parental",[["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","0x70997970C51812dc3A010C7d01b50e0d17dc79C8"],2]);

  await parental.waitForDeployment();

  console.log("contract Address:",parental.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
