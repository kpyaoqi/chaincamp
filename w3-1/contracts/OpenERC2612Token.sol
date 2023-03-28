// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "../node_modules/@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract OpenERC2612Token is ERC20Permit {

    constructor() ERC20("yaoqi", "KPS") ERC20Permit("ERC2612Token") {
        _mint(msg.sender, 100000 * 10 ** 18);
    }

    
}