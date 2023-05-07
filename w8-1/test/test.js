const { expect } = require("chai");
const { ethers } = require("hardhat");
let usdc, treasury, gov;
describe("DAOdemo", function () {
  async function init() {
    const [owner, other, other2] = await ethers.getSigners();
    // 部署合约
    const USDC = await ethers.getContractFactory("USDC");
    usdc = await USDC.deploy();
    await usdc.deployed();
    const Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.deploy(usdc.address);
    await treasury.deployed();
    const Gov = await ethers.getContractFactory("Gov");
    gov = await Gov.deploy([owner.address, other.address, other2.address]);
    await gov.deployed();

    console.log("USDC:" + usdc.address);
    console.log("Treasury:" + treasury.address);
    console.log("Gov:" + gov.address);
  };

  before(async function () {
    await init();
  });

  it("Test", async function () {
    const [owner, other, other2] = await ethers.getSigners();
    let amount=ethers.utils.parseUnits("100", 18);
    // 链下获取calldata(withdraw)
    let calldata="0xf3fef3a30000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc40000000000000000000000000000000000000000000000056bc75e2d63100000";
    // 提案结束时间
    let currentTime = Math.round(new Date() / 1000);
    let endTime = currentTime + 1000 * 60 * 60 * 24;
    // 转账usdc给treasury合约
    await usdc.transfer(treasury.address,amount);
    // 提案前余额
    await usdc.balanceOf("0x5B38Da6a701c568545dCfcB03FcB875f56beddC4").then(console.log);
    await usdc.balanceOf(treasury.address).then(console.log);
    // treasury合约转移控制权给gov合约
    await treasury.transferOwnership(gov.address);
    // 发起提案(调用treasury合约的withdraw方法)
    await gov.propose(treasury.address,0,calldata,endTime,"withdraw to 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 100USDC");
    // 进行投票(三人中两人赞成，提案通过)
    await gov.vote(1,true);
    await gov.connect(other).vote(1,true);
    // 提案后余额
    await usdc.balanceOf("0x5B38Da6a701c568545dCfcB03FcB875f56beddC4").then(console.log);
    await usdc.balanceOf(treasury.address).then(console.log);
  });
})



