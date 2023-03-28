const { ethers, upgrades } = require("hardhat");
async function main() {
  const ERC20Token = await ethers.getContractFactory("ERC20Token");
  const eRC20Token= await upgrades.deployProxy(ERC20Token, ["yaoqi", "KPS", 18, 100000], { initializer: 'init' });
  await eRC20Token.deployed();
  console.log("ERC20Token deployed to:", eRC20Token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
