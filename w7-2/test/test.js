const { expect } = require("chai");
const { ethers, network } = require("hardhat");
let myToken;
describe("UniswapV2Test", function () {
  async function init() {
    // 部署合约
    const MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy();
    await myToken.deployed();
    console.log("MyToken:" + myToken.address);
  };

  before(async function () {
    await init();
  });


  it("Test", async function () {
    const [owner, other] = await ethers.getSigners();
    for (let i = 1; i < 4; i++) {
      await myToken.rebase();
    }
    console.log("三年后应该的余额"+10000 * 0.99 ** 3);
    await myToken.balanceOf(owner.address).then(res => { console.log(ethers.utils.formatEther(res)) });
  });
})



