require("@nomicfoundation/hardhat-toolbox");
require("hardhat-abi-exporter");
require("@nomiclabs/hardhat-etherscan");

let dotenv = require('dotenv')
dotenv.config({ path: "./.env" })

const privatekey = process.env.PRIVATEKEY;
const georlikey = process.env.GOERLI_API_KEY;
const mumbaikey = process.env.MUMBAI_API_KEY;
const apiKey = process.API_KEY;
module.exports = {
  solidity: {
    compilers: [{ version: "0.6.6" }, { version: "0.5.16" },{ version: "0.6.12" , settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }},
    {
      version: "0.8.17", settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
    ],
    overrides: {
      "contracts/UniswapV2Factory.sol": {
        version: "0.5.16",
        settings: {}
      },
      "contracts/UniswapV2Router02.sol": {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      "contracts/MyTokenMarket.sol": {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      "contracts/MasterChef.sol": {
        version: "0.6.12",
        settings: {}
      }
    }
  },

  networks: {
    hardhat: {
      chainId: 1337,
    },
    dev: {
      url: 'http://127.0.0.1:8545',
      chainId: 1337,
      gas: 30000000
    },
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/' + georlikey,
      accounts: [privatekey],
      chainId: 5,
    },
    mumbai: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/' + mumbaikey,
      accounts: [privatekey],
      chainId: 80001,
    }
  },

  abiExporter: {
    path: './deployments/abi',
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: true,
  },

  etherscan: {
    apiKey: apiKey
  },

};
