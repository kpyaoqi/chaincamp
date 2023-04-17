const { expect } = require("chai");
let weth, mytoken, uniswapV2Factory, uniswapV2Router, myTokenMarket;
describe("UniswapV2Test", function () {
  async function init() {
    const [owner] = await ethers.getSigners();

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

    const MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");
    myTokenMarket = await MyTokenMarket.deploy(mytoken.address, uniswapV2Router.address, weth.address);
    await myTokenMarket.deployed();

    console.log("weth:" + weth.address);
    console.log("mytoken:" + mytoken.address);
    console.log("uniswapV2Factory:" + uniswapV2Factory.address);
    console.log("uniswapV2Router:" + uniswapV2Router.address);
    console.log("myTokenMarket:" + myTokenMarket.address);

  };

  before(async function () {
    await init();
    // 创建Token和WETH的交易对
    await uniswapV2Factory.createPair(mytoken.address, weth.address);
  });

  // 添加流动性测试
  it("AddLiquidity", async function () {
    await mytoken.approve(myTokenMarket.address, ethers.constants.MaxUint256);
    await uniswapV2Factory.getPair(mytoken.address, weth.address).then(res => console.log("Token和WETH的pair地址:" + res));
    // 添加流动性
    await myTokenMarket.addLiquidity(ethers.utils.parseUnits("1000", 18), { value: ethers.utils.parseUnits("100", 18) });
    let amount = ethers.utils.parseUnits("1", 18)
    let out = await uniswapV2Router.getAmountsOut(amount, [weth.address, mytoken.address]);
    console.log(ethers.utils.formatEther(amount) + " WETH   = " + ethers.utils.formatUnits(out[1], 18) + " Token ");
  });

  // 用确切的eth购买token测试
  it("BuyToken", async function () {
    const [owner] = await ethers.getSigners();
    await owner.getBalance().then(res => console.log( "owner当前的持有的eth数量" + ethers.utils.formatEther(res)));
    await mytoken.balanceOf(owner.address).then(res => console.log("owner当前的持有的token数量" + ethers.utils.formatEther(res)));
    await myTokenMarket.buyToken(0, [weth.address, mytoken.address], owner.address, { value: ethers.utils.parseUnits("1", 18) });
    await owner.getBalance().then(res => console.log("owner经过交易后持有的eth数量" + ethers.utils.formatEther(res)));
    await mytoken.balanceOf(owner.address).then(res => console.log("owner经过交易后持有的token数量" + ethers.utils.formatEther(res)));
  });


})
