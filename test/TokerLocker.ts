import { ethers } from "hardhat";
import { expect } from "chai";

describe.only("TokenLocker", function () {
  const lockFee = ethers.parseEther("0.01");
  const tokenAmount = ethers.parseEther("100");

  async function deployTokenLockerFixture() {
    // Get wallet signers
    const [owner, user, feeCollector] = await ethers.getSigners();

    // Deploy MockERC20 token
    const erc20Token = await ethers.deployContract("ERC20Token", ["Name", "Symbol", 18, ethers.parseUnits("1000000")]);
    await erc20Token.waitForDeployment();
    console.log("ERC20Token Address:", erc20Token.target); // Valid in Ethers.js v6
  

    // Deploy TokenLocker contract
    const TokenLocker = await ethers.getContractFactory("TokenLocker");
    const tokenLocker = await TokenLocker.deploy(lockFee, feeCollector.address);

    await tokenLocker.waitForDeployment();

    // Transfer tokens to the user
    await erc20Token.transfer(user.address, tokenAmount);

    return { erc20Token, tokenLocker, owner, user, feeCollector };
  }

  describe("lockERC20", function () {
    it("should lock ERC20 tokens successfully", async function () {
      const { erc20Token, tokenLocker, user } = await deployTokenLockerFixture();
      const lockDuration = 3600; // 1 hour
      const endLockTime = Math.floor(Date.now() / 1000) + lockDuration;

      // Approve tokens for locking
      await erc20Token.connect(user).approve(tokenLocker.target, tokenAmount);

      // Lock tokens
      await expect(
        tokenLocker.connect(user).lockERC20(erc20Token.target, tokenAmount, endLockTime, {
          value: lockFee,
        })
      )
        .to.emit(tokenLocker, "Locked")
        .withArgs(user.address, erc20Token.target, tokenAmount, endLockTime);
    });

    it("should revert if lock fee is insufficient", async function () {
      const { erc20Token, tokenLocker, user } = await deployTokenLockerFixture();
      const lockDuration = 3600; // 1 hour
      const endLockTime = Math.floor(Date.now() / 1000) + lockDuration;

      // Approve tokens for locking
      await erc20Token.connect(user).approve(tokenLocker.target, tokenAmount);

      // Attempt to lock tokens with insufficient fee
      await expect(
        tokenLocker.connect(user).lockERC20(erc20Token.target, tokenAmount, endLockTime, {
          value: lockFee - BigInt(1),
        })
      ).to.be.revertedWithCustomError(tokenLocker,"InsufficientFee");
    });
  });

  describe("unlockERC20", function () {
    it("should unlock ERC20 tokens successfully", async function () {
      const { erc20Token, tokenLocker, user } = await deployTokenLockerFixture();
      const lockDuration = 3600; // 1 hour
      const endLockTime = Math.floor(Date.now() / 1000) + lockDuration;

      // Approve tokens for locking
      await erc20Token.connect(user).approve(tokenLocker.target, tokenAmount);

      // Lock tokens
      await tokenLocker.connect(user).lockERC20(erc20Token.target, tokenAmount, endLockTime, {
        value: lockFee,
      });

      // Increase time to exceed lock period
      await ethers.provider.send("evm_increaseTime", [lockDuration + 1]);
      await ethers.provider.send("evm_mine", []);

      // Unlock tokens
      await expect(
        tokenLocker.connect(user).unlockERC20(erc20Token.target, tokenAmount)
      )
        .to.emit(tokenLocker, "Unlocked")
        .withArgs(user.address, erc20Token.target, tokenAmount);
    });

    it("should revert if unlock is attempted before lock period ends", async function () {
      const { erc20Token, tokenLocker, user } = await deployTokenLockerFixture();
      const lockDuration = 3600; // 1 hour
      const endLockTime = Math.floor(Date.now() / 1000) + lockDuration;

      // Approve tokens for locking
      await erc20Token.connect(user).approve(tokenLocker.target, tokenAmount);

      // Lock tokens
      await tokenLocker.connect(user).lockERC20(erc20Token.target, tokenAmount, Math.floor(Date.now() / 1000) + 7200, {
        value: lockFee,
      });

      // Attempt to unlock tokens before lock period ends
      await expect(
        tokenLocker.connect(user).unlockERC20(erc20Token.target, tokenAmount)
      ).to.be.revertedWithCustomError(tokenLocker,"LockPeriodHasNotEnded");
    });
  });

  describe("setLockFee", function () {
    it("should allow fee collector to update the lock fee", async function () {
      const { tokenLocker, feeCollector } = await deployTokenLockerFixture();
      const newFee = ethers.parseEther("0.02");

      // Update the lock fee
      await expect(tokenLocker.connect(feeCollector).setLockFee(newFee))
        .to.emit(tokenLocker, "LockFeeUpdated")
        .withArgs(newFee);

      // Verify the updated fee
      const updatedFee = await tokenLocker.lockFee();
      expect(updatedFee).to.equal(newFee);
    });

    it("should revert if non-fee collector tries to update the lock fee", async function () {
      const { tokenLocker, user } = await deployTokenLockerFixture();
      const newFee = ethers.parseEther("0.02");

      // Attempt to update the lock fee as a non-fee collector
      await expect(tokenLocker.connect(user).setLockFee(newFee)).to.be.revertedWithCustomError(
       tokenLocker, "OnlyFreeCollectorAllowed"
      );
    });
  });
});
