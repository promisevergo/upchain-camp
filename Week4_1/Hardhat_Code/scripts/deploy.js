// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { Signer } = require("ethers");
const hre = require("hardhat");

let owner, otherAccount
async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = hre.ethers.utils.parseEther("0.001");

  [owner, otherAccount] = await ethers.getSigners();
  const Token = await hre.ethers.getContractFactory("TokenERC20");
  const totalSupply = hre.ethers.utils.parseEther("1000")
  const token = await Token.connect(otherAccount).deploy(totalSupply);

  await token.deployed();
  console.log(token.address);

  // const Valut = await hre.ethers.getContractFactory("Valut");
  // const valut = await Valut.connect(otherAccount).deploy();
  // await valut.deployed();
  // console.log(valut.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

