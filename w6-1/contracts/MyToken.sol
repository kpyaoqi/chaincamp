// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract MyToken is ERC20 {
    using Address for address; 

    constructor() ERC20("yaoqi", "KPS") public{
        _mint(msg.sender, 100000 * 10 ** 18);
    }
}