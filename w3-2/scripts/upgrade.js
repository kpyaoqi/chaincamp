const { ethers, upgrades } = require("hardhat");
async function main() {
    const ERC20TokenV2 = await ethers.getContractFactory("ERC20TokenV2");
    const eRC20TokenV2 = await upgrades.upgradeProxy("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", ERC20TokenV2);
    console.log("ERC20Token upgraded:" + eRC20TokenV2.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
