// SPDX-License-Identifier: MIT
pragma solidity >=0.6.6;
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/console.sol";
import "./MyToken.sol";
import "./MasterChef.sol";

contract MyTokenMarket {
    address public myToken;
    address public weth;
    address public router;
    address public masterchef;
    address public sushi;
    uint256 public deposit;

    constructor(
        address _token,
        address _router,
        address _weth,
        address _masterchef,
        address _sushi
    ) public {
        myToken = _token;
        router = _router;
        weth = _weth;
        masterchef = _masterchef;
        sushi = _sushi;
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
     * @dev 通过确切的eth购买token,完成代币兑换后，直接质押到 MasterChef 挖矿
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
        uint amount = IERC20(myToken).balanceOf(address(this));
        IERC20(myToken).approve(masterchef,amount);
        MasterChef(masterchef).deposit(0, amount);
        deposit+=amount;
    }
    /**
     * @dev 从MasterChef 提取Token 方法
     */
    function withdraw() external payable {
        MasterChef(masterchef).withdraw(0, deposit);
        IERC20(myToken).transfer(msg.sender,deposit);
        uint amount = IERC20(sushi).balanceOf(address(this));
        IERC20(sushi).transfer(msg.sender, amount);
        deposit=0;
    }


}
