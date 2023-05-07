const Web3 = require('web3')

const UniswapV2Pair = require('../artifacts/@uniswap/v2-core/contracts/UniswapV2Pair.sol/UniswapV2Pair.json')
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))

let initCodeHash = null
let data = UniswapV2Pair.bytecode
if (!data.startsWith('0x')) data = '0x' + data
console.info('INIT_CODE_HASH:', initCodeHash = web3.utils.keccak256(data))
