const hre = require("hardhat");

async function main() {
  const MyERC721Token= await hre.ethers.getContractFactory("MyERC721Token");
  const myERC721Token = await MyERC721Token.deploy();
  await myERC721Token.deployed();
  console.log("myERC721Token deployed to:", myERC721Token.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

