const { expect } = require("chai");
require('@openzeppelin/hardhat-upgrades');
const { ethers, upgrades } = require("hardhat");

let eRC20Token, eRC20TokenV2, vault;
describe("UPGRADE", function () {
  async function init() {
    const ERC20Token = await ethers.getContractFactory("ERC20Token");
    eRC20Token = await upgrades.deployProxy(ERC20Token, ["yaoqi", "KPS", 18, 100000], { initializer: 'init' });
    await eRC20Token.deployed();

    const Vault = await ethers.getContractFactory("Vault");
    vault = await Vault.deploy(eRC20Token.address);
    await vault.deployed();
  };

  before(async function () {
    await init();
  });

  it('not upgrade', async () => {
    const [owner] = await ethers.getSigners();
    await eRC20Token.approve(vault.address,100);
    await vault.deposit(100);
    vault.deposited(owner.address).then(console.log);

    const proxyAddress = await upgrades.erc1967.getAdminAddress(eRC20Token.address)
    console.log('MyContract proxy address:', proxyAddress)

    await eRC20Token.transferWithCallback(vault.address, 100);
  });

  it('upgrade1', async () => {
    const ERC20TokenV2 = await ethers.getContractFactory("ERC20TokenV2");
    eRC20TokenV2 = await upgrades.upgradeProxy(eRC20Token.address, ERC20TokenV2);
    expect(await eRC20Token.name()).to.equal(await eRC20TokenV2.name());
    expect(await eRC20Token.symbol()).to.equal(await eRC20TokenV2.symbol());
    expect(await eRC20Token.decimals()).to.equal(await eRC20TokenV2.decimals());
    expect(await eRC20Token.totalSupply()).to.equal(await eRC20TokenV2.totalSupply());
    expect(await eRC20Token.owner()).to.equal(await eRC20TokenV2.owner());
  });

  it('upgrade2', async () => {
    const [owner] = await ethers.getSigners();
    const ERC20TokenV2 = await ethers.getContractFactory("ERC20TokenV2");
    eRC20TokenV2 = await upgrades.upgradeProxy(eRC20Token.address, ERC20TokenV2);
    console.log("ERC20Token   address:"+eRC20Token.address);
    console.log("ERC20TokenV2 address:"+eRC20TokenV2.address);
    eRC20TokenV2.transferWithCallback(vault.address, 100);
    vault.deposited(owner.address).then(console.log);
  });



});