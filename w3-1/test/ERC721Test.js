const { expect } = require("chai");
let myERC721Token,myERC20Token,nftManger;
describe("MyERC721Token", function () {
    async function init() {
        const MyERC20Token = await ethers.getContractFactory("MyERC20Token");
        myERC20Token = await MyERC20Token.deploy("Yaoqi","KPS",18,100000);
        await myERC20Token.deployed();

        const MyERC721Token = await ethers.getContractFactory("MyERC721Token");
        myERC721Token = await MyERC721Token.deploy();
        await myERC721Token.deployed();

        const NFTManger = await ethers.getContractFactory("NFTManger");
        nftManger = await NFTManger.deploy(myERC721Token.address,myERC20Token.address);
        await nftManger.deployed();
    };

    before(async function () {
        await init();
    });

    it("BuyNFT", async function () {
        const [owner] = await ethers.getSigners();
        await myERC721Token.mint(nftManger.address,"ipfs://QmdBWDEeY4rdrXb2K8WTX1bVTTCCqogRcF6FzqqygRwaUN");
        // 查看NFT 持有者
        await myERC721Token.ownerOf(0).then(console.log);
        await nftManger.NFTPrice(0,100);
        await nftManger.priceofNFT(0).then(console.log);
        await nftManger.buyNFT(0,100);
        await nftManger.NFTtransfer(owner.address,0);
        // 查看NFT 持有者
        await myERC721Token.ownerOf(0).then(console.log);
    });


})



