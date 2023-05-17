//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./console.sol";

contract OptionToken is ERC20, Ownable {
    address public usdcToken;
    // 期权行权起始时间
    uint public maturityTime;
    // 期权行权结束时间
    uint public usableTime;
    uint public price;


    /**
     * @dev 创建期权Token时，确定标的的价格与行权日期
     * @param usdc:usdc的地址
     * @param swapPrice:标的价格
     * @param beginTime:行权开始日期
     * @param endTime:行权结束日期
     */
    constructor(
        address usdc,
        uint swapPrice,
        uint beginTime,
        uint endTime
    ) ERC20("OptionToken", "OPT") {
        usdcToken = usdc;
        price = swapPrice;
        maturityTime = beginTime;
        usableTime = endTime;
    }

    /**
     * @dev 根据转入的标的 (ETH) 发行期权Token;
     * @param addr:期权Token所有者
     */
    function mint(address addr) external payable onlyOwner {
        _mint(addr, msg.value);
    }

    /**
     * @dev 行权方法
     * @param amount:行权的Token数量
     */
    function exerciseOfRight(uint amount) external {
        require(
            block.timestamp >= maturityTime && block.timestamp < usableTime,
            "Not an effective time"
        );
        _burn(msg.sender, amount);
        uint needusdcAmount = price * amount;
        IERC20(usdcToken).transferFrom(
            msg.sender,
            address(this),
            needusdcAmount
        );
        (bool success, ) = (msg.sender).call{value: amount}(new bytes(0));
        require(success, "transfer failed");
    }

    /**
     * @dev 过期销毁所有期权Token 赎回标的，usdc资金
     */
    function burn() external onlyOwner {
        // require(block.timestamp >= usableTime, "It's still in the life of the option");
        uint256 usdcAmount = IERC20(usdcToken).balanceOf(address(this));
        IERC20(usdcToken).transfer(msg.sender, usdcAmount);
        uint ethAmount = address(this).balance;
        (bool success, ) = (msg.sender).call{value: ethAmount}(new bytes(0));
        require(success, "transfer failed");
    }
}
