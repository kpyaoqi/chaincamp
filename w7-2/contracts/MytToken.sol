//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./console.sol";

contract MyToken is ERC20 {
    uint256 public total;
    uint256 private supply;
    uint public k = 1;

    constructor() ERC20("yaoqi", "KPS") {
        // 初始总发行量为10000
        supply = total = 10000 * 10 ** 18; 
        _mint(msg.sender, total);
    }

    function rebase() public {
        // 每年下降1%
        supply = supply - (supply / 100); 
        k = supply % total;
    }

    function balanceOf(address addr) public view override returns (uint256) {
        return (_balances[addr] * k) / total;
    }

}
