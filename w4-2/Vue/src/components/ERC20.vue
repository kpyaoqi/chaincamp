<script>
import { ethers } from 'ethers';
import axios  from 'axios';

import ERC2612Abi from '../../../w3-2/deployments/abi/OpenERC2612Token.json';
import VaultAbi from '../../../w3-2/deployments/abi/Vault.json';
import ERC721Abi from '../../../w3-2/deployments/abi/OpenERC721Token.json';


let ERC2612Addr="0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
let VaultAddr="0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
let ERC721Addr="0x72f50a2E4D8dBe6e65C1f543D7e4C45b3A651400";

export default {
  data() {
    return {
      account: null,       //默认账户
      recipient: null,     //接受者
      amount: null,        //转账金额
      balance: null,       //账户token余额
      ethbalance: null,    //账户ETH余额
      name: null,          //token的名称
      decimal: null,       //token的精度
      symbol: null,        //token的符号
      supply: null,        //token的发行量
      stakeAmount: null,   //token授权金额
      valutBalance:null,   //当前账户的Vault金额
      withdrawAmount:null, //从vault提款金额
      tokenId:null,        //交易tokenId
      tokenURI:null,       //NFT的URI
      transferaddr:null,   //交易地址
      masteraddr:null,     //NFT主人
    }
  },

  methods: {
    // 点击链接钱包调用
    async connect() {
      // 初始化provider和账户
      await this.initProvider()
      await this.initAccount()
      // 如果获取到了账号,进行合约初始化，并读取合约数据
      if (this.account) {
        this.initContract()
        this.readContract();
      }
      // 开启订阅事件
      this.subscribe();
    },

    async initProvider(){
      if(window.ethereum) {
          this.provider = new ethers.providers.Web3Provider(window.ethereum);
          let network = await this.provider.getNetwork();
          this.chainId = network.chainId;
          console.log("chainId:", this.chainId);
      } else{
        console.log("Need install MetaMask")
      }
    },

    async initAccount(){
        try {
          this.accounts = await this.provider.send("eth_requestAccounts", []);
          // this.accounts = await this.provider.listAccounts();
          console.log("accounts:" + this.accounts);
          this.account = this.accounts[0];
          this.signer = this.provider.getSigner();
        } catch(error){
            console.log("User denied account access", error)
        }
    },

    async initContract() {
      this.ERC2612C = new ethers.Contract(ERC2612Addr,ERC2612Abi, this.signer);
      this.vault = new ethers.Contract(VaultAddr, VaultAbi, this.signer);
      this.ERC721 = new ethers.Contract(ERC721Addr, ERC721Abi, this.signer);
    }, 

     readContract() {
       this.ERC2612C.name().then(res => {
        this.name = res;
      });
       this.ERC2612C.symbol().then(res => {
        this.symbol = res;
      });
       this.ERC2612C.decimals().then(res => {
        this.decimal = res;
      });
       this.ERC2612C.totalSupply().then(res => {
        this.supply = ethers.utils.formatUnits(res, 18);
      });
       this.ERC2612C.balanceOf(this.account).then(res => {
        this.balance = ethers.utils.formatUnits(res, 18);
      });
       this.provider.getBalance(this.account).then(res => {
        this.ethbalance = ethers.utils.formatUnits(res, 18);
      });
       this.vault.deposited(this.account).then(res => {
        this.valutBalance = ethers.utils.formatUnits(res, 18);
      });
    },

    transfer() {
      let amount = ethers.utils.parseUnits(this.amount, 18);
      this.ERC2612C.transfer(this.recipient, amount).then(res => {
        console.log(res);  
        this.readContract();
      })
    },

    async permitDeposit() {
      let nonce = await this.ERC2612C.nonces(this.account);
      this.deadline = Math.ceil(Date.now() / 1000) + parseInt(20 * 60);
      let amount =  ethers.utils.parseUnits(this.stakeAmount).toString();
      const domain = {
          name: 'ERC2612Token',
          version: '1',
          chainId: this.chainId,
          verifyingContract: ERC2612Addr
      }
      const types = {
          Permit: [
            {name: "owner", type: "address"},
            {name: "spender", type: "address"},
            {name: "value", type: "uint256"},
            {name: "nonce", type: "uint256"},
            {name: "deadline", type: "uint256"}
          ]
      }
      const message = {
          owner: this.account,
          spender: VaultAddr,
          value: amount,
          nonce: nonce,
          deadline: this.deadline
      }
      const signature = await this.signer._signTypedData(domain, types, message);
      const {v, r, s} = ethers.utils.splitSignature(signature); 
      try {
        this.vault.permitDeposit(this.account, amount, this.deadline, v, r, s);
        this.readContract();
      } catch (e) {
        alert("Error , please check the console log:", e)
      }
    },

    withdraw(){
      let amount =  ethers.utils.parseUnits(this.withdrawAmount).toString();
      this.vault.withdraw(amount).then(res=>{
        console.log(res);
       this.readContract();
      });
    },

    async subscribe(){
      let filter=this.ERC721.filters.Transfer();
      filter.fromBlock = "latest";
      await this.provider.on(filter,log=>{
        console.log(log);
        this.saveNFT(log.topics);
      });
    },

    mintNFT(){
      this.ERC721.mint(this.masteraddr,this.tokenURI);
    },

    transferNFT(){
      this.ERC721.transferFrom(this.account,this.transferaddr,this.tokenId);
    },

    saveNFT(res){
      var product_ = JSON.stringify(res);
      let NewMusic_Param = new URLSearchParams();
      NewMusic_Param.append("data", product_);
      axios.post('http://localhost:80/nft/saveNFT', NewMusic_Param);
    }


  }
}
</script>

<template>
  <div >
    <button @click="connect"> 链接钱包 </button>
    <div>
    我的地址 : {{  account }}
  </div>
      <div>
        <br /> Token 名称 : {{ name  }}
        <br /> Token 符号 : {{  symbol }}
        <br /> Token 精度 : {{  decimal }}
        <br /> Token 发行量 : {{  supply }}
        <br /> 我的 Token 余额 : {{ balance  }}
        <br /> 我的ETH余额 : {{ ethbalance  }}
        <br /> Valut余额: {{ valutBalance }}
      </div>
      <div >
        <br />转账到:
        <input type="text" v-model="recipient" />
        <br />转账金额
        <input type="text" v-model="amount" />
        <br />
        <button @click="transfer"> 转账 </button>
      </div>
      <br />
    <div >
      <input v-model="stakeAmount" placeholder="输入质押量"/>
      <button @click="permitDeposit">离线授权存款</button>
      <br />
      <input v-model="withdrawAmount" placeholder="输入提款量"/>
      <button @click="withdraw">从Valut提款</button>
    </div>
    <br />
     <div >
      <input v-model="masteraddr" placeholder="主人地址"/>
      <input v-model="tokenURI" placeholder="tokenURI"/>
      <button @click="mintNFT">铸造NFT</button>
      <br />
      <input v-model="transferaddr" placeholder="交易地址"/>
      <input v-model="tokenId" placeholder="交易tokenId"/>
      <button @click="transferNFT">交易NFT</button>
    </div>
        


  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

div {
  font-size: 1.2rem;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
