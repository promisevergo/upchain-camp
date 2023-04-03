<script>
import { ethers } from 'ethers'

import TokenERC20_Abi from '../../deployments/abi/TokenERC20.json'
import TokenERC20_Addr from "../../deployments/dev/TokenERC20.json"
import Valut_Abi from '../../deployments/abi/Valut.json'
import Valut_Addr from "../../deployments/dev/Valut.json"

export default {

    name: 'erc20',

    data() {
        return {
        account: null,
        recipient: null,
        amount: null,
        balance: null,
        ethbalance: null,

        name: null,
        decimal: null,
        symbol: null,
        supply: null,
        allowance: null,

        stakeAmount: null,
        }
    },
    async created() {
    },

    methods: {
        async connect() {
            await this.initProvider();
            await this.initAccount();

            //如果获取到了账号，进行合约初始化，并读取合约数据
            if (this.account){
                console.log("连接metamask成功,账户地址：" + this.account);
                this.initContract();
                this.readContract();
            }
        },

        async initProvider(){
            if(window.ethereum) {
                this.provider = new ethers.providers.Web3Provider(window.ethereum);
                let network = await this.provider.getNetwork()
                this.chainId = network.chainId;
                console.log("chainId:", network.chainId);
            } else{
                console.log("Need install MetaMask")
            }
        },
        
        async initAccount(){
            try {
                this.accounts = await this.provider.send("eth_requestAccounts", []);
                this.account = this.accounts[0];

                this.signer = this.provider.getSigner();
            } catch(error){
                console.log("User denied account access", error)
            }
        },

        async initContract(){
            this.tokenERC20 = new ethers.Contract(TokenERC20_Addr.address, TokenERC20_Abi, this.signer);

            this.valut = new ethers.Contract(Valut_Addr.address, Valut_Abi, this.signer);
        },

        readContract() {
            this.provider.getBalance(this.account).then((balance) => {
                this.ethbalance = ethers.utils.formatEther(balance, 18);
                console.log("ETH余额: " + this.ethbalance);
            });
            this.tokenERC20.name().then((r) => {
                this.name = r
            });
            this.tokenERC20.decimals().then((r) => {
                this.decimal = r
            });
            this.tokenERC20.symbol().then((r) => {
                this.symbol = r;
            });
            this.tokenERC20.totalSupply().then((r) => {
                this.supply = ethers.utils.formatEther(r, 18);
            });
            this.tokenERC20.balanceOf(this.account).then((r) => {
                this.balance = ethers.utils.formatEther(r, 18);
                console.log("我的token余额：" + this.balance)
            });
            this.tokenERC20.allowance(this.account, Valut_Addr.address).then((r) => {
                this.allowance = ethers.utils.formatEther(r, 18);
            });
        },
        approve() {
            let amount = ethers.utils.parseUnits("9999999999999999", 18);
            this.tokenERC20.approve(Valut_Addr.address, amount).then((r) =>{
                console.log(r);     //返回值不是true
                this.readContract();
            })
        },


        async deposit() {
            let amount = ethers.utils.parseUnits(this.amount, 18);

            // this.valut.deposit(TokenERC20_Addr.address, amount).then((r) =>{
            //     console.log(r);     //返回值不是true
            //     this.readContract();
            // })
            try {
                let tx = await this.valut.deposit(TokenERC20_Addr.address, amount);
                let receipt = await tx.wait();
                console.log("质押token成功", receipt);
                this.readContract();
            } catch (e) {
                console.log("质押token失败，Error: ", e);
                this.readContract();
            }
        },

        withdraw() {
            let amount = ethers.utils.parseUnits(this.amount, 18);
            this.valut.withdraw(TokenERC20_Addr.address, amount).then((r) =>{
                console.log(r);     //返回值不是true
                this.readContract();
            })
        },

        async permitDeposit() {
            let  nonce = await this.tokenERC20.nonces(this.account);
            this.deadline = Math.ceil(Date.now() / 1000) + parseInt(20*60);

            let amount = ethers.utils.parseUnits(this.stakeAmount).toString();

            const domain = {
                name: 'ERC20',
                version: '1',
                chainId: this.chainId,
                verifyingContract: tokenERC20.address
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
                spender: Valut_Addr.address,
                valut: amount,
                nonce: nonce,
                deadline: this.deadline
            }

            const signature = await this.signer._signTypedData(domain, types, message);
            console.log("signer: ", signer);

            const {v, r, s} = ethers.utils.splitSignature(signature);

            try{
                // let tx = await this.valut.permitDeposit(this.account, amount, this.deadline, v, r, s);
                // let receip = await tx.wait();
                this.readContract();
            } catch (e) {
                alert("Error, please check the console log: ", e)
            }
        },

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
          <br /> 授权valut合约的数量 : {{ allowance  }}
        </div>
  
        <div >
          <button @click="approve"> 授权 </button>

          <br />存入{{ name }}代币的数量
          <input type="text" v-model="amount" />
          <br />
          <button @click="deposit"> 存入 </button>

          <br />提款{{ name }}代币的数量
          <input type="text" v-model="amount" />
          <br />
          <button @click="withdraw"> 取出 </button>
        </div>
  
      <div >
        <input v-model="stakeAmount" placeholder="输入质押量"/>
        <button @click="permitDeposit">离线授权存款</button>
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
