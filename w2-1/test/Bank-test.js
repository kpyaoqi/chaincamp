const { expect } = require("chai");
let bank;
describe("Bank1", function () {
  async function init() {
    const Bank = await ethers.getContractFactory("Counter");
    bank = await Bank.deploy();
    await bank.deployed();
    console.log("Bank:" + bank.address);
  };

  before(async function () {
    await init();
  });

  it("Transfer and show all", async function () {
    let overrides = { value: 1 };
    const [owner, other, other2] = await ethers.getSigners();
    // 两个账户各转账 1 wei
    expect(await bank.set(overrides));
    expect(await bank.connect(other).set(overrides));
    // 合约余额为 2 wei
    expect(await bank.getBalance()).to.equal(2);
    // 获取所有的转账信息
    expect(bank.on("total", (from, amount) => {
      console.log(from + ":" + amount);
    }));
    expect(await bank.getAll());
    // 合约拥有者提取余额(提现 2 wei 给第三个用户)
    expect(await bank.balanceOf(other2.address).then(console.log));
    expect(await bank.withdraw(other2.address));
    expect(await bank.balanceOf(other2.address).then(console.log));
  });

  it("Non-contract owner to withdraw", async function () {
    const [owner, other] = await ethers.getSigners();
    let overrides = { value: 1 };
    expect(await bank.set(overrides));
    // 其他用户提取失败
    expect(await bank.connect(other).withdraw(other.address));
  });

})



