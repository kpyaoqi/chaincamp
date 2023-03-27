## 通过Hardhat部署合约：

sepolia交易哈希：0xd7a23acb0c12e0999abc986d6838bcb4dd9c9892ddf26cadd8e9d81ea45bc379

goerli交易哈希：0xf9bc7e08138b23800c3897ee949ae9cd196dfc91c8adb4fc162fdec638575c69

sepolia测试网合约地址：https://sepolia.etherscan.io/address/0x8A96937304F2FfDBA6Fa4BDe7B760814c18902fE#code 

goerli测试网合约地址：https://goerli.etherscan.io/address/0x72f50a2E4D8dBe6e65C1f543D7e4C45b3A651400#code



## 通过MetaMask给合约转账(0.001ETH)：

![b12b9d6615b0baae0a9e4a73fe02df4](./img/b12b9d6615b0baae0a9e4a73fe02df4.png) 

交易哈希：0x4f1785d5dee34583b7dba6eaf8252e06e9e31b79c491a13dc1853818812a87b6

合约金额：0.001ETH

![8ec8568c29f6b1bc273ff2e774f9a34](./img/8ec8568c29f6b1bc273ff2e774f9a34.png) 

## 测试

![66b36a18060b5e844467b4ca664af29](./img/66b36a18060b5e844467b4ca664af29.png) 

一：通过两个账户转账 1 wei，然后合约拥有者提取到第三个账户上，看到多了 2 wei，并打印出了转账人的所有信息.
二：先转账 1 wei，合约余额不为空，然后另一个用户提取失败.

## 事件说明：

1. 调用的函数： receive
2. 来自谁的转账：0x8B5B88cC81439CbB14eF9017AbC9F7E62635fb31
3. 金额：1000000000000000 wei
4. 数据：空

![2edd467cb6107910ced925c76e7b170](./img/2edd467cb6107910ced925c76e7b170.png)

 
