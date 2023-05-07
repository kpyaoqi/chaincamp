const hre = require("hardhat");

async function main() {
  // const ERC20Token= await hre.ethers.getContractFactory("ERC20Token");
  // const myERC20 = await ERC20Token.deploy("yaoqi","KPS",18,100000 );
  // await myERC20.deployed();
  // console.log("ERC20Token deployed to:", myERC20.address);

  // const Vault20= await hre.ethers.getContractFactory("Vault");
  // const vault20 = await Vault20.deploy(myERC20.address);
  // await vault20.deployed();
  // console.log("Vault20 deployed to:", vault20.address);

  const OpenERC2612Token= await hre.ethers.getContractFactory("OpenERC2612Token");
  const ERC2612Token = await OpenERC2612Token.deploy();
  await ERC2612Token.deployed();
  console.log("OpenERC2612Token deployed to:", ERC2612Token.address);

  const Vault2612= await hre.ethers.getContractFactory("Vault");
  const vault2612 = await Vault2612.deploy(ERC2612Token.address);
  await vault2612.deployed();
  console.log("Vault2612 deployed to:", vault2612.address);

  const OpenERC721Token= await hre.ethers.getContractFactory("OpenERC721Token");
  const ERC721Token = await OpenERC721Token.deploy();
  await ERC721Token.deployed();
  console.log("OpenERC721Token deployed to:", ERC721Token.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
