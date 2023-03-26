const path = require("path");
const fs = require('fs');
// console.log(__dirname+'/config.json')

// fs.readFile(__dirname+'/config.json', {encoding:'utf-8', flag:'r'}, (err, data) => {
//   if (err) {
//       throw err;
//   }
//   // parse JSON object
//   const keyConfig = JSON.parse(data.toString());
//   console.log(keyConfig.mumbai_url);
// });
// console.log(keyConfig)
//在这个文件里面只能这样Sync读取,推测是异步执行的原因
data = fs.readFileSync(__dirname+'/config.json');
const keyConfig = JSON.parse(data.toString());
// console.log(keyConfig.mumbai_url)

//使用代理
const {ProxyAgent, setGlobalDispatcher} = require("undici");
const proxyAgent = new ProxyAgent("http://127.0.0.1:7890");
setGlobalDispatcher(proxyAgent);


require("@nomicfoundation/hardhat-toolbox");
const { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } = require("hardhat/builtin-tasks/task-names");
const { config } = require("process");

subtask(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD, async (args, hre, runSuper) => {
  if (args.solcVersion === "0.8.18") {
    const compilerPath = path.join(__dirname, "node_modules/solc/soljson.js");

    return {
      compilerPath,
      isSolcJs: true, // if you are using a native compiler, set this to false
      version: args.solcVersion,
      // this is used as extra information in the build-info files, but other than
      // that is not important
      longVersion: "0.8.5-nightly.2021.5.12+commit.98e2b4e5"
    }
  }

  // we just use the default subtask if the version is not 0.8.5
  return runSuper();
})

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
      accounts: [keyConfig.account_2, keyConfig.account_1]
    },
    localhost:{
      url:"http://127.0.0.1:8545/",
      accounts: [keyConfig.Hardhat_1, keyConfig.Hardhat_2]
    }
  },
  etherscan:{
    apiKey: keyConfig.etherscan_apiKey
  }
};
