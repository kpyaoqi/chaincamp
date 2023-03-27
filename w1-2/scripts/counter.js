const hre = require("hardhat");

async function main() {
  const  Counter= await hre.ethers.getContractFactory("Counter");
  // 定义初始值
  const argumnet=10;
  const count = await Counter.deploy(argumnet);

  await count.deployed();

  console.log("Counter deployed to:", count.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
