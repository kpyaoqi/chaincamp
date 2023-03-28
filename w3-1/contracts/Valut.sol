// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./MyERC20Token.sol";

contract Vault is TokenRecipient{
    mapping(address => uint) public deposited;
    address public immutable token;

    constructor(address addr) {
        token=addr;
    }

     // 存款方法，用户先批准额度，再调用此方法存入
    function deposit(uint256 amount) public {
        require(MyERC20Token(token).transferFrom(msg.sender, address(this), amount),"Transfer from error");
        deposited[msg.sender]+=amount;  
    }
    
    //提款方法，用户可以提取自己的存款
    function withdraw(uint256 amount) public {
        require(deposited[msg.sender] >= amount, "There is not enough balance");
        require(MyERC20Token(token).transfer(msg.sender, amount),"Transfer from error");
        deposited[msg.sender]-=amount;
    }

    // 收款时被回调
    function tokensReceived(address sender, uint amount) external returns (bool) {
        require(msg.sender == token, "invalid");
        deposited[sender] += amount;
        return true;
    }

}