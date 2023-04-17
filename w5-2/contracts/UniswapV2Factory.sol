pragma solidity >=0.5.16;

import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-core/contracts/UniswapV2Pair.sol';

contract UniswapV2Factory is IUniswapV2Factory {
    // 收取手续费的地址
    address public feeTo;
    // 设置feeTo的权限者地址
    address public feeToSetter;
    // 两种token对应的交易对地址
    mapping(address => mapping(address => address)) public getPair;
    // 所有的交易对地址
    address[] public allPairs;
    // 定义交易对创建事件,返回参数tokenA地址,tokenB地址,pair地址,allPairs长度(第几个交易对)
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    constructor(address _feeToSetter) public {
        feeToSetter = _feeToSetter;
    }
    // 所有交易对的数量
    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB) external returns (address pair) {
        // 判断两个token是否一样
        require(tokenA != tokenB, 'UniswapV2: IDENTICAL_ADDRESSES'); 
        // tokenA和tokenB中的谁的地址小，谁是token0，大的是token1
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        // 判断两个token是否一样
        require(token0 != address(0), 'UniswapV2: ZERO_ADDRESS');
        // 判断是否已经有这两种token的交易对
        require(getPair[token0][token1] == address(0), 'UniswapV2: PAIR_EXISTS'); 
        // type(x).creationCode 获得包含x的合约的bytecode,是bytes类型(不能在合同本身或继承的合约中使用,因为会引起循环引用)
        bytes memory bytecode = type(UniswapV2Pair).creationCode;
        // 两个地址是确定值，salt可以通过链下计算
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        // 设置pair地址交易对的两种token
        IUniswapV2Pair(pair).initialize(token0, token1);
        // 将token0和token1的交易对地址设置到mapping中(0和1的双向交易对)
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; 
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
        return pair;
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        feeToSetter = _feeToSetter;
    }
}
