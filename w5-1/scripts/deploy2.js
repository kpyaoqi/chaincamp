const hre = require("hardhat");

async function main() {
  const VaultResolver= await hre.ethers.getContractFactory("VaultResolver");
  const vaultResolver = await VaultResolver.deploy("0x6266da7ddb994c607AEfF1Ed97E468746321d4C4","0xd32bd093AE1aA65b27717cf64c35D8Ca464E0f26");
  await vaultResolver.deployed();
  console.log("vaultResolver deployed to:", vaultResolver.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

