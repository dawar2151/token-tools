import { expect } from 'chai';
import hre from 'hardhat';
import { parseEther } from 'ethers';

describe('ERC20 Bulk Transfer', function () {
  async function depolyERC20AndERC20BulkSender() {
    const [owner, account1, account2, account3] = await hre.ethers.getSigners();

    const erc20Tester = await hre.ethers.deployContract('ERC20Token', [
      'Name',
      'Symbol',
      18,
      1000000,
    ]);
    const erc20BulkSender = await hre.ethers.deployContract('BulkSender', []);
    await erc20BulkSender.waitForDeployment();
    await erc20Tester.waitForDeployment();

    return {
      erc20Tester,
      erc20BulkSender,
      owner,
      account1,
      account2,
      account3,
    };
  }

  describe('Deployment', function () {
    it('Should make bulk transfer with same value', async function () {
      const {
        erc20Tester,
        erc20BulkSender,
        owner,
        account1,
        account2,
        account3,
      } = await depolyERC20AndERC20BulkSender();

      if (!erc20BulkSender) {
        throw new Error(
          'erc20BulkSender is null. Ensure contract deployment is successful.',
        );
      }

      await erc20Tester.approve(
        erc20BulkSender.target,
        ethers.parseUnits('1000', 'gwei'),
      );
      await erc20BulkSender
        .getFunction('bulkTransferERC20(address,address[],uint256)')
        .send(
          erc20Tester.target,
          [account1],
          ethers.parseUnits('300', 'gwei'),
          {
            value: parseEther('0.1'),
          },
        );

      expect(await erc20Tester.balanceOf(account1)).to.eql(
        ethers.parseUnits('300', 'gwei'),
      );
    });

    it('Should make bulk transfer with different values', async function () {
      const {
        erc20Tester,
        erc20BulkSender,
        owner,
        account1,
        account2,
        account3,
      } = await depolyERC20AndERC20BulkSender();
      await erc20Tester.approve(
        erc20BulkSender.target,
        ethers.parseUnits('1000', 'gwei'),
      );
      await erc20BulkSender
        .getFunction('bulkTransferERC20(address,address[],uint256[])')
        .send(
          erc20Tester.target,
          [account1],
          [ethers.parseUnits('300', 'gwei')],
          {
            value: parseEther('0.1'),
          },
        );
      expect(await erc20Tester.balanceOf(account1)).to.eql(
        ethers.parseUnits('300', 'gwei'),
      );
    });
  });
});
