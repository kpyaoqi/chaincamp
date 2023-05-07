//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Vault {
    mapping(address => uint) public deposited;
    address public immutable token;
    address owner;
    mapping(address => bool) whitelist;

    constructor(address _token) {
        token = _token;
        owner = msg.sender;
    }

    function deposit(address user, uint amount) public {
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Transfer from error"
        );
        deposited[user] += amount;
    }

    function permitDeposit(
        address user,
        uint amount,
        uint deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        IERC20Permit(token).permit(
            msg.sender,
            address(this),
            amount,
            deadline,
            v,
            r,
            s
        );
        deposit(user, amount);
    }

    function withdraw() external {
        uint amount = deposited[msg.sender];
        SafeERC20.safeTransfer(IERC20(token), msg.sender, amount);
        deposited[msg.sender] = 0;
    }

    function addWhitelist(address addr) external  {
        require(msg.sender==owner);
        whitelist[addr] = true;
    }

    function collect() external {
        if (whitelist[msg.sender]) {
            if (IERC20(token).balanceOf(address(this)) > 100e18) {
                uint256 amount = IERC20(token).balanceOf(address(this)) / 2;
                SafeERC20.safeTransfer(IERC20(token), owner, amount);
            }
        }
    }
}
