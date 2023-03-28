const { expect } = require("chai");
let myERC20Token,vault;
describe("MyERC20Token", function () {
    async function init() {
        const MyERC20Token = await ethers.getContractFactory("MyERC20Token");
        const Vault = await ethers.getContractFactory("Vault");
        myERC20Token = await MyERC20Token.deploy("Yaoqi","KPS",18,100000);
        vault = await Vault.deploy(myERC20Token.address);
        await myERC20Token.deployed();
        await vault.deployed();
    };

    before(async function () {
        await init();
    });

    it("ERC20Test1", async function () {
        const [owner] = await ethers.getSigners();
        await myERC20Token.approve(vault.address,100);
        await vault.deposit(100);
        vault.deposited(owner.address).then(console.log);
    });

    it("ERC20Test2", async function () {
        const [owner] = await ethers.getSigners();
        await myERC20Token.transferWithCallback(vault.address,100);
        vault.deposited(owner.address).then(console.log);

    });

})



