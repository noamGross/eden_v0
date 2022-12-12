// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  
  const totalCreation=1000;
  [tase, mof,p1,p2] = await ethers.getSigners();

  const TIS = await hre.ethers.getContractFactory("TIS");
  const tis = await TIS.connect(tase).deploy();

  await tis.deployed();

  console.log(
    `tis with balance ${totalCreation} deployed to ${tis.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
