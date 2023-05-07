const hre = require("hardhat");

async function main() {
    const [owner] = await ethers.getSigners();

    const WETH = await ethers.getContractFactory("WETH");
    const weth = await WETH.deploy();
    await weth.deployed();

    const MyToken = await ethers.getContractFactory("MyToken");
    const mytoken = await MyToken.deploy();
    await mytoken.deployed();

    const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
    const uniswapV2Factory = await UniswapV2Factory.deploy(owner.address);
    await uniswapV2Factory.deployed();

    const UniswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02");
    const uniswapV2Router02 = await UniswapV2Router02.deploy(uniswapV2Factory.address, weth.address);
    await uniswapV2Router02.deployed();

    const MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");
    const myTokenMarket = await MyTokenMarket.deploy(mytoken.address, weth.address, uniswapV2Router02.address);
    await myTokenMarket.deployed();

    console.log(weth.address);
    console.log(mytoken.address);
    console.log(uniswapV2Factory.address);
    console.log(uniswapV2Router02.address);
    console.log(myTokenMarket.address);

    // 创建Token和WETH的交易对
    await uniswapV2Factory.createPair(mytoken.address, weth.address);
    await uniswapV2Factory.getPair(mytoken.address, weth.address).then(res => console.log("Token和WETH的pair地址:" + res)); 
    await mytoken.approve(myTokenMarket.address, ethers.constants.MaxUint256);
    await myTokenMarket.addLiquidityY(ethers.utils.parseUnits("1000", 18), { value: ethers.utils.parseUnits("100", 18) });
    let out = await uniswapV2Router02.getAmountsOut(ethers.utils.parseUnits("2", 18), [mytoken.address]);
    console.log("2 Token  = " + ethers.utils.formatUnits(out[0], 18) + " WETH ");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
