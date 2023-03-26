const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

let owner, otherAccount, token, valut, TokenTotalSupply;
describe("ERC20Token", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployToken() {


    // Contracts are deployed using the first signer/account by default
    [owner, otherAccount] = await ethers.getSigners();
    TokenTotalSupply = 1000;

    console.log('owner:'+ owner.address);
    console.log('otherAccount:'+ otherAccount.address);

    const Token = await ethers.getContractFactory("TokenERC20");
    token = await Token.deploy(1000, {gasPrice: ethers.utils.parseUnits("200", "gwei")});
    const Valut = await ethers.getContractFactory("Valut");
    valut = await Valut.deploy({gasPrice: ethers.utils.parseUnits("200", "gwei")});

    await token.deployed();
    await valut.deployed();

    console.log('token address: '+token.address);
    console.log('valut address: '+valut.address);
    // return { token, valut, TokenTotalSupply, owner, otherAccount };
  }

  before(async function() {
    await deployToken();
  })

  it("transfer to other acount", async function () {
    // ({ token, valut, TokenTotalSupply, otherAccount} = await loadFixture(deployToken));
    await token.transfer(otherAccount.address, TokenTotalSupply*0.5, {gasPrice: ethers.utils.parseUnits("100", "gwei")});
    console.log('transfer token to otherAccount:'+TokenTotalSupply*0.5);
    const tokenNum = await token.balanceOf(otherAccount.address);
    console.log("otherAccount's token num:"+ tokenNum.toString());
    expect(await token.balanceOf(otherAccount.address)).to.equal(TokenTotalSupply*0.5);
  });

  it("approve valut contract", async function(){
    await expect(token.connect(otherAccount).approve(valut.address, TokenTotalSupply,)).to.emit(token, "Approval");
    allowance_num = await token.allowance(otherAccount.address, valut.address)
    console.log("otherAccount's allowance to valut:"+ allowance_num.toString());
  });

  it("deposit token to valut", async function(){
    expect(valut.connect(otherAccount).deposit(token.address, 100)).to.emit(token, "Transfer");
  });

  // describe("Test", function () {
  //   let token, valut, TokenTotalSupply, otherAccount;
  //   it("transfer other acount", async function () {
  //     ({ token, valut, TokenTotalSupply, otherAccount} = await loadFixture(deployToken));

  //     await token.transfer(otherAccount.address, TokenTotalSupply*0.5, {gasPrice: ethers.utils.parseUnits("100", "gwei")});
  //     console.log("transfer token to otherAccount ${TokenTotalSupply*0.5}");
  //     expect(await token.balanceOf(otherAccount.address)).to.equal(TokenTotalSupply*0.5);
  //   });

  //   it("otheracount approve token to valut ", async function () {
  //     await token.connect(otherAccount).approve(valut.address, TokenTotalSupply, {gasPrice: ethers.utils.parseUnits("100", "gwei")});
  //     console.log("otheracount approve token to valut ${TokenTotalSupply}");
  //     expect(await token.allowance(otherAccount.address, valut.address)).to.equal(
  //       TokenTotalSupply
  //     );
  //   });


  //   it("despoit valut token", async function () {
  //     await valut.connect(otherAccount).deposit(token.address, 100, {gasPrice: ethers.utils.parseUnits("100", "gwei")});
  //     const num = await token.balanceOf(valut.address);
  //     console.log("despoit token to valut ${num}");
  //     expect(await token.balanceOf(valut.address)).to.equal(100);
  //   });

  //   it("withdrawal token", async function (){
  //     await valut.connect(otherAccount).withdraw(token.address, 100, {gasPrice: ethers.utils.parseUnits("100", "gwei")});

  //     expect(await token.balanceOf(valut.address)).to.equal(0);
  //   });
    
    // it("Should fail if the unlockTime is not in the future", async function () {
    //   // We don't use the fixture here because we want a different deployment
    //   const latestTime = await time.latest();
    //   const Lock = await ethers.getContractFactory("Lock");
    //   await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
    //     "Unlock time should be in the future"
    //   );
    // });
  });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  // });
// });
