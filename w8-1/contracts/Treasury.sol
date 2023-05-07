// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Treasury is Ownable{
    address public immutable usdc;

    constructor(address addr) {
        usdc=addr;
    }
    
    //提款方法，用户可以提取自己的存款
    function withdraw(address to,uint256 amount) public onlyOwner{
        require(IERC20(usdc).transfer(to, amount),"Transfer from error");
    }
}