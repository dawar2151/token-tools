import { expect } from 'chai';
import hre from 'hardhat';
import { parseEther } from 'ethers';

describe('ERC1155 Bulk Transfer', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function depolyERC1155AndERC1155BulkSender() {
    // Contracts are deployed using the first signer/account by default
    const [owner, account1, account2, account3] = await hre.ethers.getSigners();

    const erc1155Tester = await hre.ethers.deployContract(
      'ERC1155Token',
      ['baseuri'],
      {},
    );
    const erc1155BulkSender = await hre.ethers.deployContract('BulkSender', []);

    return {
      erc1155Tester,
      erc1155BulkSender,
      owner,
      account1,
      account2,
      account3,
    };
  }

  describe('Deployment', function () {
    it('Should make bulk transfer with the same value', async function () {
      const {
        erc1155Tester,
        erc1155BulkSender,
        owner,
        account1,
        account2,
        account3,
      } = await depolyERC1155AndERC1155BulkSender();
      const tokenId1 = 1;
      const tokenId2 = 2;
      const tokenId3 = 3;

      await erc1155Tester.mint(account1, BigInt(tokenId1), BigInt(100));
      await erc1155Tester.mint(account1, BigInt(tokenId2), BigInt(100));
      await erc1155Tester.mint(account1, BigInt(tokenId3), BigInt(100));

      await erc1155Tester
        .connect(account1)
        .setApprovalForAll(erc1155BulkSender, true);
      await erc1155BulkSender
        .connect(account1)
        .bulkTransferERC1155(
          erc1155Tester,
          [account2],
          [BigInt(tokenId1)],
          [BigInt(100)],
          {
            value: parseEther('0.1'),
          },
        );
      expect(await erc1155Tester.balanceOf(account2, BigInt(tokenId1))).to.eqls(
        BigInt(100),
      );
    });
  });
});
