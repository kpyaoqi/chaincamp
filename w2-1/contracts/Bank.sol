// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Counter {
    // 合约拥有着
    address owner;
    // 一个地址映射这个地址进行转账的金额
    mapping(address => uint256) public balances;
    // 用于检查:地址是否已经存在于 balancesKey
    mapping(address => bool) public balancesInserted;
    // 所有地址
    address[] public balancesKey;
    event total(address add, uint256 amount);
    // Log事件
    event Log(string funName, address from, uint256 value, bytes data);

    // 传入初始值
    constructor() payable {
        owner = msg.sender;
        if (msg.value != 0) {
            balances[msg.sender] = msg.value;
            balancesInserted[msg.sender] = true;
            balancesKey.push(msg.sender);
        }
    }

    // 转账并添加映射
    function set() external payable {
        require(msg.value > 0, "The transfer amount shall not be greater than zero");
        if (!balancesInserted[msg.sender]) {
            balances[msg.sender] = msg.value;
            balancesInserted[msg.sender] = true;
            balancesKey.push(msg.sender);
        } else {
            balances[msg.sender] += msg.value;
        }
    }

    // 获取所有
    function getAll() external {
        require(balancesKey.length > 0, "No user transfers to the contract");
        for (uint256 index = 0; index < balancesKey.length; index++) {
            emit total(balancesKey[index], balances[balancesKey[index]]);
        }
    }

    // 将合约的所有余额提取到to地址上(只有合约拥有者才能进行)
    function withdraw(address payable to) external {
        require(msg.sender == owner, "Non-contract owner");
        require(this.getBalance() != 0, "No ether in the contract");
        to.transfer(this.getBalance());
        // 清空集合
        for (uint256 index = 0; index < balancesKey.length; index++) {
            balances[balancesKey[index]] = 0;
            balancesInserted[balancesKey[index]] = false;
        }
        delete balancesKey;
    }

    // 查询地址余额
    function balanceOf(address addr) external view returns (uint256) {
        return addr.balance;
    }

    // 查询当前合约余额
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    fallback() external payable {
        emit Log("fallback", msg.sender, msg.value, msg.data);
    }

    receive() external payable {
        emit Log("receive", msg.sender, msg.value, "");
    }
}
