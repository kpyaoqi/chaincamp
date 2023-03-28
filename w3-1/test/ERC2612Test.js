const { expect } = require("chai");
const yaoqi = require("../../w2-2/node_modules/ethers");
let openERC2612Token, sigUtils;
describe("TestOpenERC2612Token", function () {
    async function init() {
        const OpenERC2612Token = await ethers.getContractFactory("OpenERC2612Token");
        const SigUtils = await ethers.getContractFactory("SigUtils");
        openERC2612Token = await OpenERC2612Token.deploy();
        await openERC2612Token.deployed();
        sigUtils = await SigUtils.deploy(openERC2612Token.DOMAIN_SEPARATOR());
        await sigUtils.deployed();
    };

    before(async function () {
        await init();
    });

    it("ERC2612Test", async function () {
        const [owner, other] = await ethers.getSigners();
        openERC2612Token.connect(other).balanceOf(owner.address).then(console.log);

        let nonce = await openERC2612Token.nonces(owner.address);
        const chainId = (await ethers.provider.getNetwork()).chainId;
        const deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
        const types = {
            Permit: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }, { name: "value", type: "uint256" }, { name: "nonce", type: "uint256" }, { name: "deadline", type: "uint256" }]
        };
        const message = { owner: owner.address, spender: other.address, value: 100, nonce: nonce, deadline: deadline };
        // 唯一标识智能合约的哈希，由代币合约的名称，版本，所在的chainId以及合约部署的地址构成
        const domain = { name: 'Yaoqi', version: '1', chainId:chainId, verifyingContract: openERC2612Token.address };
        const signature = await owner._signTypedData(domain, types, message);
        const { v, r, s } = yaoqi.ethers.utils.splitSignature(signature);
        console.log(v + "  " + r + "  " + s);
        await openERC2612Token.permit(owner.address, other.address, 100, deadline, v, r, s);
        await openERC2612Token.allowance(owner.address, other.address).then(console.log);
        await openERC2612Token.connect(other).transferFrom(owner.address,other.address,100);
        await openERC2612Token.balanceOf(other.address).then(console.log);
    });



})



