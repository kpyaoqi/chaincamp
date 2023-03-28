// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/Address.sol";

interface TokenRecipient {
    function tokensReceived(address sender, uint amount) external returns (bool);
}

contract OpenERC20Token is ERC20 {
    using Address for address; 

    constructor() ERC20("Yaoqi", "KPS") {
        _mint(msg.sender, 100000 * 10 ** 18);
    }

    // ERC20Callback
    function transferWithCallback(address recipient, uint256 amount) external returns (bool) {
        transfer(recipient, amount);
        if (recipient.isContract()) {
            bool res = TokenRecipient(recipient).tokensReceived(msg.sender, amount);
            require(res, "No tokensReceived");
        }
        return true;
    }
}