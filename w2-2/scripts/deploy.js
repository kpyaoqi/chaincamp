const hre = require("hardhat");
const web3=require("web3");
async function main() {
  const Score= await hre.ethers.getContractFactory("Score");
  const Teacher= await hre.ethers.getContractFactory("Teacher");

  var Chinese=web3.utils.asciiToHex("Chinese");
  var Math=web3.utils.asciiToHex("Math");
  var English=web3.utils.asciiToHex("English");

  const score = await Score.deploy([Chinese,Math,English]);
  await score.deployed();
  const teacher = await Teacher.deploy(score.address);
  await teacher.deployed();

  console.log("Score deployed to:", score.address);
  console.log("Teacher deployed to:", teacher.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

