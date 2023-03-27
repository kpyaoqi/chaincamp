// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Counter {
    uint256 public counter;
    // 默认值
    uint256 private init;

    // Log事件
    event Log(string funName, address from, uint256 value, bytes data);

    // 传入初始值
    constructor(uint256 num) {
        counter = num;
        init = num;
    }

    // 传入值与counter相加并复制给counter
    function add(uint256 x) public {
        require((type(uint256).max - counter) > x, unicode"相加后超过最大值");
        counter += x;
    }

    // 恢复默认值
    function defaultCounter() public {
        counter = init;
    }

    // 查询地址余额
    function balanceOf(address addr) public view returns (uint256) {
        return addr.balance;
    }

    // 查询当前合约余额
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    fallback() external {
        emit Log("fallback", msg.sender, 0, msg.data);
    }

    receive() external payable {
        emit Log("receive", msg.sender, msg.value, "");
    }
}