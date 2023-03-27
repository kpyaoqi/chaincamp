// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract MyERC721Token is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("yaoqi", "KPS") {}

    //  QmZNFPwox146ohY93ViFD8omSThRAVYF1A96MNHbWoa2Nr
    function mint(address student, string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        _mint(student, newItemId);
        _setTokenURI(newItemId, tokenURI);

        _tokenIds.increment();
        return newItemId;
    }
}