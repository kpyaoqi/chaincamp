// SPDX-License-Identifier: MIT
pragma solidity =0.6.6;
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IERC20.sol";

contract MyTokenMarket {
    address public myToken;
    address public weth;
    address public router;
    address public owner;

    constructor(address _token, address _router, address _weth) public {
        myToken = _token;
        router = _router;
        weth = _weth;
        owner = msg.sender;
    }

    /**
     * @dev 添加weth和token交易对的流动性
     * @param tokenAmount:传入token的数量
     */
    function addLiquidity(uint tokenAmount) public payable {
        require(
            IERC20(myToken).transferFrom(
                msg.sender,
                address(this),
                tokenAmount
            ),
            "transfer fail"
        );
        require(IERC20(myToken).approve(router, tokenAmount), "approve fail");
        IUniswapV2Router02(payable(router)).addLiquidityETH{value: msg.value}(
            myToken,
            tokenAmount,
            0,
            0,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @dev 通过确切的eth购买token
     * @param minTokenAmount:需要获取最小的token数量
     * @param path:token交易路径
     * @param to:通过交易获得token的地址
     */
    function buyToken(
        uint minTokenAmount,
        address[] calldata path,
        address to
    ) external payable {
        IUniswapV2Router02(payable(router)).swapExactETHForTokens{
            value: msg.value
        }(minTokenAmount, path, to, block.timestamp);
    }
}
