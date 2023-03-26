const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");

//   var owner, counter, otherAccount;
  describe("Counter", function () {
    async function init(){
        const [owner, otherAccount] = await ethers.getSigners();
        const Counter = await ethers.getContractFactory("Counter");
        counter = await Counter.deploy(1);
        console.log("counter:" + counter.address);
        return {counter, owner, otherAccount };
    };
    // 也可以直接在后面
    // before(async function(){
    //     await init();
    // });
    // it("init equal 1", async function () {
    //     expect(await counter.counter()).to.equal(1);
    // });
    //官网推荐的写法，这样写因为使用的const，所以合约都重新部署了一次，每个it里面的都要执行完整的步骤
    describe("test", function(){
        it("init equal 1", async function () {
            const{counter, owner} = await loadFixture(init);
            expect(await counter.counter()).to.equal(1);
        });
        it("add 1 equal 2", async function () {
            const{counter, owner} = await loadFixture(init);
            await counter.count();
            expect(await counter.counter()).to.equal(2);
        });
        it("add 1 equal 3", async function () {
            const{counter, owner} = await loadFixture(init);
            await counter.count();
            await counter.count();
            expect(await counter.counter()).to.equal(3);
        });
        //使用其他帐户执行
        it("test otherAccount can't add", async function(){
            const{counter, otherAccount} = await loadFixture(init);
            //助教小白说判断revert信息需要在expect前面加await，但是ai说要用try catch
            await expect(counter.connect(otherAccount).count()).to.be.revertedWith("Only owner can increment");
        });
    });
})
  
