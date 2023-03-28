// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./MyERC721Token.sol";
import "./MyERC20Token.sol";

contract NFTManger {
    address public nft;
    address public erc20;
    mapping(uint256 => uint256) public priceofNFT;
    mapping(address => uint256) public token;

    constructor(address MyERC721Tokenaddr, address MyERC20Tokenaddr) {
        nft = MyERC721Tokenaddr;
        erc20 = MyERC20Tokenaddr;
    }

    function NFTPrice(uint256 tokenId, uint256 price) public returns (bool) {
        require(
            MyERC721Token(nft).ownerOf(tokenId) == address(this),
            "Not NFT owns"
        );
        priceofNFT[tokenId] = price;
        return true;
    }

    function buyNFT(uint256 tokenId, uint256 price) public returns (bool) {
        require(priceofNFT[tokenId] != 0, "The NFT is not on the shelves");
        require(price == priceofNFT[tokenId], "Wrong price");
        require(
            MyERC721Token(nft).ownerOf(tokenId) != msg.sender,
            "NFT is you"
        );
        MyERC20Token(erc20)._allowance(msg.sender,MyERC721Token(nft).ownerOf(0), price);
        return true;
    }

    function NFTtransfer(address to, uint256 tokenId) public returns (bool) {
        require(
            MyERC721Token(nft).ownerOf(tokenId) == address(this),
            "Not NFT owns"
        );
        require(
            MyERC20Token(erc20).transferFrom(
                to,
                msg.sender,
                priceofNFT[tokenId]
            ),
            "transfer fail"
        );
        MyERC721Token(nft).transferFrom(address(this), to, tokenId);        
        return true;
    }
}
