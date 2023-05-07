//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract ERC20Token is ERC20Permit {

    constructor() ERC20("yaoqi", "KPS") ERC20Permit("yoaqi") {
        _mint(msg.sender, 100000 * 10 ** 18);
    }

    
}