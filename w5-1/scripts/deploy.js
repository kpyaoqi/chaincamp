const hre = require("hardhat");

async function main() {
  const ERC20Token= await hre.ethers.getContractFactory("ERC20Token");
  const erc20Token = await ERC20Token.deploy();
  await erc20Token.deployed();
  console.log("ERC20Token deployed to:", erc20Token.address);

  const Vault= await hre.ethers.getContractFactory("Vault");
  const vault = await Vault.deploy(erc20Token.address);
  await vault.deployed();
  console.log("Vault deployed to:", vault.address);

  const AutoCollectUpKeep= await hre.ethers.getContractFactory("AutoCollectUpKeep");
  const autoCollectUpKeep = await AutoCollectUpKeep.deploy(erc20Token.address,vault.address);
  await autoCollectUpKeep.deployed();
  console.log("AutoCollectUpKeep deployed to:", autoCollectUpKeep.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

