require("@nomicfoundation/hardhat-toolbox");
require("hardhat-abi-exporter") 
const path = require("path");
const fs = require('fs');
//在这个文件里面只能这样Sync读取,推测是异步执行的原因
data = fs.readFileSync(__dirname+'/config.json');
const keyConfig = JSON.parse(data.toString());
// console.log(keyConfig.mumbai_url)

//使用代理
const {ProxyAgent, setGlobalDispatcher} = require("undici");
const proxyAgent = new ProxyAgent("http://127.0.0.1:7890");
setGlobalDispatcher(proxyAgent);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks:{
    mumbai:{
      url: keyConfig.mumbai_url,
      accounts: [keyConfig.account_2]
    },
    goeril:{
      url: keyConfig.goeril_url,
      accounts: [keyConfig.account_1, keyConfig.account_2]
    },
    localhost:{
      url:"http://127.0.0.1:8545/",
      accounts: [keyConfig.Hardhat_1, keyConfig.Hardhat_2]
    }
  },
  etherscan:{
    apiKey: keyConfig.etherscan_apiKey
  },
  abiExporter:{
    path: './deployments/abi',
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: true,
  },
};
