// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./Address.sol";
import "./ERC20.sol";

interface TokenRecipient {
    function tokensReceived(
        address sender,
        uint amount
    ) external returns (bool);
}

contract ERC20TokenV2 is ERC20 {
    // 状态变量
    string public name;
    string public symbol;
    uint8 public decimals;
    // 不增加总量
    // uint256 public immutable totalSupply;
    uint256 public totalSupply; // 总价总量

    address public owner;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    using Address for address;

    // 函数修改器
    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    // 初始化
    function init(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _totalSupply
    ) external  returns (bool) {
        owner = msg.sender;
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        balanceOf[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
        return true;
    }

    // 1个授权
    function approve(address spender, uint256 amount) external returns (bool) {
        require(spender != address(0), "spender is the zero address");
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function _allowance(
        address sender,
        address spender,
        uint256 amount
    ) external returns (bool) {
        allowance[sender][spender] = amount;
        return true;
    }

    // 增加授权
    function increaseAllowance(
        address spender,
        uint256 amount
    ) external returns (bool) {
        require(spender != address(0), "spender is the zero address");
        allowance[msg.sender][spender] += amount;
        emit Approval(msg.sender, spender, allowance[msg.sender][spender]);
        return true;
    }

    // 降低授权
    function decreaseAllowance(
        address spender,
        uint256 amount
    ) external returns (bool) {
        require(spender != address(0), "spender is the zero address");
        require(
            allowance[msg.sender][spender] >= amount,
            "spender is the zero address"
        );
        allowance[msg.sender][spender] -= amount;
        emit Approval(msg.sender, spender, allowance[msg.sender][spender]);
        return true;
    }

    // 2个交易
    function transfer(address recipient, uint256 amount) public returns (bool) {
        require(recipient != address(0), "Recipient is the zero address");
        require(balanceOf[msg.sender] >= amount, "Amount exceeds balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    // ERC20Callback减少一步授权
    function transferWithCallback(
        address recipient,
        uint256 amount
    ) external returns (bool) {
        transfer(recipient, amount);
        if (recipient.isContract()) {
            bool res = TokenRecipient(recipient).tokensReceived(
                msg.sender,
                amount
            );
            require(res, "No tokensReceived");
        }
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool) {
        require(sender != address(0), "Sender is the zero address");
        require(recipient != address(0), "Recipient is the zero address");
        require(
            balanceOf[sender] >= amount,
            "The authorizer does not have sufficient balance"
        );
        require(
            allowance[sender][msg.sender] >= amount,
            "Exceed the authorized limit"
        );
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    // 铸币
    function mint(uint256 amount) external onlyOwner returns (bool) {
        totalSupply += amount;
        balanceOf[owner] += amount;
        emit Transfer(address(0), owner, amount);
        return true;
    }

    // 销毁币
    function burn(uint256 amount) external onlyOwner returns (bool) {
        totalSupply -= amount;
        balanceOf[owner] -= amount;
        emit Transfer(owner, address(0), amount);
        return true;
    }
}
