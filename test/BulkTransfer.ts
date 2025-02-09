import { expect } from 'chai';
import hre from 'hardhat';
import { parseGwei, parseEther } from 'viem';

describe(' Bulk Transfer', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function depolyERC20AndERC20BulkSender() {
    // Contracts are deployed using the first signer/account by default
    const [owner, account1, account2, account3] = await hre.ethers.getSigners();

    const bulkSender = await hre.ethers.deployContract('BulkSender', []);

    await bulkSender.waitForDeployment();

    await bulkSender.initialize(owner);

    return {
      bulkSender,
      owner,
      account1,
      account2,
      account3,
    };
  }

  describe('Deployment', function () {
    it('Should make bulk transfer with the same value', async function () {
      const { bulkSender, account2 } = await depolyERC20AndERC20BulkSender();
      var balance = await hre.ethers.provider.getBalance(account2);

      await bulkSender.bulkTransfer([account2], [parseEther('0.1')], {
        value: parseEther((0.1 + 0.007).toString()),
      });
      expect(await hre.ethers.provider.getBalance(account2.address)).to.eqls(
        parseEther('0.1') + balance,
      );
    });
  });
});
