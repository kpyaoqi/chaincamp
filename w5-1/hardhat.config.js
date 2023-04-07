require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
// const { ProxyAgent, setGlobalDispatcher } = require("undici");
// const proxyAgent = new ProxyAgent("http://127.0.0.1:33210");
// setGlobalDispatcher(proxyAgent);
let dotenv = require('dotenv')
dotenv.config({ path: "./.env" })

const privatekey = process.env.PRIVATEKEY;
const georlikey = process.env.GOERLI_API_KEY;
const mumbaikey = process.env.MUMBAI_API_KEY;


module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
    },
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/' + georlikey,
      accounts: [privatekey],
      chainId: 5,
    },
    mumbai:{
      url: 'https://polygon-mumbai.g.alchemy.com/v2/' + mumbaikey,
      accounts: [privatekey],
      chainId: 80001,
    }
  },
  
  etherscan: {
    apiKey: "IM2118XRDM38NN8SKTVDZQG47UCUR4CC5Q"
  },

};
