// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = hre.ethers.utils.parseEther("0.001");

  const Token = await hre.ethers.getContractFactory("TokenERC20");
  const token = await Token.deploy(1000, {value: lockedAmount});

  const Valut = await hre.ethers.getContractFactory("Valut");
  const valut = await Valut.deploy();

  await token.deployed();

  console.log(token.address);
  console.log(valut.address)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

