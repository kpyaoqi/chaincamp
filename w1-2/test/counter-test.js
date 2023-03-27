const { expect } = require("chai");

describe("Counter1", function () {
  it("ceshi Counter", async function () {
    const Counter = await ethers.getContractFactory("Counter");
    // 部署合约传入参数
    const counter = await Counter.deploy(1);
    await counter.deployed();
    console.log("counter:" + counter.address);
    expect(await counter.add(1));
    expect(await counter.counter()).to.equal(2);
    expect(await counter.add(2));
    expect(await counter.counter()).to.equal(4);
  });
});

describe("Counter2", function () {
  it("ceshi Counter", async function () {
    const [owner, other] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy(1);
    await counter.deployed();
    console.log("counter:" + counter.address);
    expect(await counter.add(1));
    expect(await counter.counter()).to.equal(2);
    expect(await counter.add(2));
    expect(await counter.counter()).to.equal(3);
  });
});

describe("Counter3", function () {
  it("ceshi Counter", async function () {
    const [owner, other] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy(1);
    await counter.deployed();
    console.log("counter:" + counter.address);
    expect(await counter.add(1));
    expect(await counter.connect(other).add(1));
  });
});