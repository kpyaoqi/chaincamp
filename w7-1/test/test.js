const { expect } = require("chai");
const { ethers, network } = require("hardhat");
let optionToken, usdc;
describe("UniswapV2Test", function () {
  async function init() {
    let currentTime = Math.round(new Date() / 1000);
    // 模拟一天内有效
    let beginTime = currentTime;
    let endTime = currentTime + 1000 * 60 * 60 * 24;;
    // 部署合约
    const USDC = await ethers.getContractFactory("USDC");
    usdc = await USDC.deploy();
    await usdc.deployed();
    const OptionToken = await ethers.getContractFactory("OptionToken");
    optionToken = await OptionToken.deploy(usdc.address, 100, beginTime, endTime);
    await optionToken.deployed();
    console.log("optionToken:" + optionToken.address);
    console.log("USDC:" + usdc.address);
  };

  before(async function () {
    await init();
  });

  // 行权方法测试
  it("Exercise", async function () {
    const [owner, other] = await ethers.getSigners();
    await usdc.transfer(other.address, ethers.utils.parseUnits("1000", 18));
    await usdc.connect(other).approve(optionToken.address, ethers.constants.MaxUint256);
    let amount = ethers.utils.parseUnits("1", 18);
    // 给other用户铸造期权Token(可以通过uniswap创建与USDC交易对进行购买期权Token)
    await optionToken.mint(other.address, { value: amount });
    // 行权前的other用户的USDC和ETH和期权Token的余额
    await optionToken.balanceOf(other.address).then(res=>{console.log("行权前期权Token:"+ethers.utils.formatEther (res))});
    await usdc.balanceOf(other.address).then(res=>{console.log("行权前USDC:"+ethers.utils.formatEther (res))});
    await ethers.provider.getBalance(other.address).then(res=>{console.log("行权前ETH:"+ethers.utils.formatEther (res))});
    // 行权
    await optionToken.connect(other).exerciseOfRight(amount);
    // 行权后的other用户的USDC和ETH和期权Token的余额
    await optionToken.balanceOf(other.address).then(res=>{console.log("行权后期权Token:"+ethers.utils.formatEther (res))});
    await usdc.balanceOf(other.address).then(res=>{console.log("行权后USDC:"+ethers.utils.formatEther (res))});
    await ethers.provider.getBalance(other.address).then(res=>{console.log("行权后ETH:"+ethers.utils.formatEther (res))});
  });

  // 过期销毁测试
  it("Expire", async function () {
    const [owner, other] = await ethers.getSigners();
    let amount = ethers.utils.parseUnits("1", 18);
    // 给other用户铸造期权Token
    await optionToken.mint(other.address, { value: amount });
    // 销毁前的owner用户的ETH余额
    await ethers.provider.getBalance(owner.address).then(res=>{console.log(ethers.utils.formatEther (res))});
    // 销毁期权Token
    await optionToken.burn();
    // 销毁后的owner用户的ETH余额
    await ethers.provider.getBalance(owner.address).then(res=>{console.log(ethers.utils.formatEther (res))});
  });
})



