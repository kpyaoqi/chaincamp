const { expect } = require("chai");
const { ethers, network } = require("hardhat");
let weth, mytoken, uniswapV2Factory, uniswapV2Router, myTokenMarket, sushiToken, masterChef, provider;
describe("UniswapV2Test", function () {
  async function init() {
    const [owner] = await ethers.getSigners();
    provider = new ethers.providers.JsonRpcProvider();

    const WETH = await ethers.getContractFactory("WETH");
    weth = await WETH.deploy();
    await weth.deployed();

    const MyToken = await ethers.getContractFactory("MyToken");
    mytoken = await MyToken.deploy();
    await mytoken.deployed();

    const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
    uniswapV2Factory = await UniswapV2Factory.deploy(owner.address);
    await uniswapV2Factory.deployed();

    const UniswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02");
    uniswapV2Router = await UniswapV2Router02.deploy(uniswapV2Factory.address, weth.address);
    await uniswapV2Router.deployed();

    const SushiToken = await ethers.getContractFactory("SushiToken");
    sushiToken = await SushiToken.deploy();
    await sushiToken.deployed();

    const MasterChef = await ethers.getContractFactory("MasterChef");
    masterChef = await MasterChef.deploy(sushiToken.address, owner.address, ethers.utils.parseUnits("40", 18), 0, 0);
    await masterChef.deployed();

    const MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");
    myTokenMarket = await MyTokenMarket.deploy(mytoken.address, uniswapV2Router.address, weth.address, masterChef.address, sushiToken.address);
    await myTokenMarket.deployed();

    console.log("weth:" + weth.address);
    console.log("mytoken:" + mytoken.address);
    console.log("uniswapV2Factory:" + uniswapV2Factory.address);
    console.log("uniswapV2Router:" + uniswapV2Router.address);
    console.log("sushiToken:" + sushiToken.address);
    console.log("masterChef:" + masterChef.address);
    console.log("myTokenMarket:" + myTokenMarket.address);
  };

  before(async function () {
    await init();
    // 创建Token和WETH的交易对
    await uniswapV2Factory.createPair(mytoken.address, weth.address);
    // 添加质押池
    await masterChef.add(10, mytoken.address, true);
  });

  // 添加流动性测试
  it("AddLiquidity", async function () {
    await mytoken.approve(myTokenMarket.address, ethers.constants.MaxUint256);
    await uniswapV2Factory.getPair(mytoken.address, weth.address).then(res => console.log("Token和WETH的pair地址:" + res));
    // 添加流动性
    await myTokenMarket.addLiquidity(ethers.utils.parseUnits("1000", 18), { value: ethers.utils.parseUnits("100", 18) });
    let amount = ethers.utils.parseUnits("1", 18)
    // 测试交换比例
    let out = await uniswapV2Router.getAmountsOut(amount, [weth.address, mytoken.address]);
    console.log(ethers.utils.formatEther(amount) + " WETH   = " + ethers.utils.formatUnits(out[1], 18) + " Token ");
  });

  // 用确切的eth购买token测试
  it("BuyToken", async function () {
    const [owner] = await ethers.getSigners();
    await sushiToken.transferOwnership(masterChef.address);
    await owner.getBalance().then(res => console.log("owner当前的持有的eth数量" + ethers.utils.formatEther(res)));
    await mytoken.balanceOf(owner.address).then(res => console.log("owner当前的持有的token数量" + ethers.utils.formatEther(res)));
    await sushiToken.balanceOf(owner.address).then(res => { console.log("未质押token时的SushiToken的数量" + ethers.utils.formatUnits(res, 18)) });
    // 完成代币兑换后，直接质押到 MasterChef 挖矿
    await myTokenMarket.buyToken(0, [weth.address, mytoken.address], myTokenMarket.address, { value: ethers.utils.parseUnits("2", 18) });
    // await owner.getBalance().then(res => console.log("owner经过交易后持有的eth数量" + ethers.utils.formatEther(res)));
    // await mytoken.balanceOf(owner.address).then(res => console.log("owner经过交易后持有的token数量" + ethers.utils.formatEther(res)));
    // 经过两个区块
    for (i = 0; i < 2; i++) {
      await network.provider.send("evm_mine");
    }
    // 查看用户质押收益
    await masterChef.pendingSushi(0, myTokenMarket.address).then(res => { console.log(ethers.utils.formatUnits(res, 18)) });
    // 从MasterChef 提取Token 
    await myTokenMarket.withdraw();
    await owner.getBalance().then(res => console.log("owner经过交易后持有的eth数量" + ethers.utils.formatEther(res)));
    await mytoken.balanceOf(owner.address).then(res => console.log("owner经过交易后持有的token数量" + ethers.utils.formatEther(res)));
    await sushiToken.balanceOf(owner.address).then(res => { console.log("质押token,过了三个区块后获得的SushiToken的数量" + ethers.utils.formatUnits(res, 18)) });
  });
  // 在质押池中有两个用户进行质押相同数量的token
  it("AddUser", async function () {
    const [owner, other] = await ethers.getSigners();

    let amount = ethers.utils.parseUnits("10", 18);
    await mytoken.transfer(other.address, amount);
    await mytoken.connect(other).approve(masterChef.address, amount);
    await mytoken.approve(masterChef.address, amount);
    // 参与质押
    await masterChef.deposit(0, amount);
    await masterChef.connect(other).deposit(0, amount);
    await network.provider.send("evm_mine");
    // 查看用户质押收益
    await masterChef.pendingSushi(0, owner.address).then(res => { console.log(ethers.utils.formatUnits(res, 18)) });
    await masterChef.pendingSushi(0, other.address).then(res => { console.log(ethers.utils.formatUnits(res, 18)) });
  });

  // 添加了一个新的质押池
  it("AddPool", async function () {
    // 添加质押池
    await masterChef.add(10, weth.address, true);
    const [owner, other] = await ethers.getSigners();
    let amount = ethers.utils.parseUnits("10", 18);
    // 在质押池中有两个用户进行质押相同数量的token
    await weth.deposit({ value: amount });
    await weth.connect(other).deposit({ value: amount });
    await weth.approve(masterChef.address, amount);
    await weth.connect(other).approve(masterChef.address, amount);
    // 参与质押
    await masterChef.deposit(1, amount);
    await masterChef.connect(other).deposit(1, amount);
    await network.provider.send("evm_mine");
    // 查看用户质押收益
    await masterChef.pendingSushi(1, owner.address).then(res => { console.log(ethers.utils.formatUnits(res, 18)) });
    await masterChef.pendingSushi(1, other.address).then(res => { console.log(ethers.utils.formatUnits(res, 18)) });
  });
})



