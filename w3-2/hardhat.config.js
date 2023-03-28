require('@nomicfoundation/hardhat-toolbox');
require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
let dotenv = require('dotenv')
dotenv.config({ path: "./.env" });
const privatekey = process.env.PRIVATEKEY;
const sepoliakey = process.env.SEPOLIA_API_KEY;
const georlikey = process.env.GOERLI_API_KEY;

module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
    },
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/' + sepoliakey,
      accounts: [privatekey],
      chainId: 11155111,
    },
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/' + georlikey,
      accounts: [privatekey],
      chainId: 5,
    },
  },

  etherscan: {
    apiKey: {
      sepolia: sepoliakey,
      goerli: georlikey
    }
  },

};
