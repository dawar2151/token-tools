import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei, parseEther } from "viem";

describe("ERC20 Bulk Transfer", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function depolyERC20AndERC20BulkSender() {


    // Contracts are deployed using the first signer/account by default
    const [owner, account1, account2, account3] = await hre.viem.getWalletClients();

    const erc20Tester = await hre.viem.deployContract("ERC20Tester", [], {
    });
    const erc20BulkSender = await hre.viem.deployContract("BulkSender", [owner.account.address]);

    const publicClient = await hre.viem.getPublicClient();

    return {
      erc20Tester,
      erc20BulkSender,
      owner,
      account1,
      account2,
      account3,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("Should make bulk transfer with the same value", async function () {
      const {
        erc20Tester,
        erc20BulkSender,
        owner,
        account1,
        account2,
        account3,
        publicClient,
      } = await loadFixture(depolyERC20AndERC20BulkSender);
      await erc20Tester.write.approve([erc20BulkSender.address, parseGwei('1000')]);
      await erc20BulkSender.write.bulkTransferERC20([erc20Tester.address,[account1.account.address], parseGwei('300')], {
        value: parseEther('0.1')
      });
      expect(await erc20Tester.read.balanceOf([account1.account.address])).to.eqls(parseGwei('300'));
    });
    it("Should make bulk transfer with different values", async function () {
      const {
        erc20Tester,
        erc20BulkSender,
        owner,
        account1,
        account2,
        account3,
        publicClient,
      } = await loadFixture(depolyERC20AndERC20BulkSender);
      await erc20Tester.write.approve([erc20BulkSender.address, parseGwei('1000')]);
      await erc20BulkSender.write.bulkTransferERC20([erc20Tester.address,[account1.account.address], [parseGwei('300')]], {
        value: parseEther('0.1')
      });
      expect(await erc20Tester.read.balanceOf([account1.account.address])).to.eqls(parseGwei('300'));
    });
  });
});
