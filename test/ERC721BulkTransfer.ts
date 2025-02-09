import { expect } from 'chai';
import hre from 'hardhat';
import { parseEther } from 'ethers';

describe('ERC721 Bulk Transfer', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function depolyERC721AndERC721BulkSender() {
    // Contracts are deployed using the first signer/account by default
    const [owner, account1, account2, account3] = await hre.ethers.getSigners();

    const erc721Tester = await hre.ethers.deployContract(
      'ERC721Token',
      ['Name', 'Symbol'],
      {},
    );
    await erc721Tester.waitForDeployment();
    const erc721BulkSender = await hre.ethers.deployContract('BulkSender', []);
    await erc721BulkSender.waitForDeployment();

    return {
      erc721Tester,
      erc721BulkSender,
      owner,
      account1,
      account2,
      account3,
    };
  }

  describe('Deployment', function () {
    it('Should make bulk transfer with the same value', async function () {
      const {
        erc721Tester,
        erc721BulkSender,
        owner,
        account1,
        account2,
        account3,
      } = await depolyERC721AndERC721BulkSender();
      const tokenId1 = 1;
      const tokenId2 = 2;
      const tokenId3 = 3;

      await erc721Tester.mint(account1, BigInt(tokenId1), { account: owner });
      await erc721Tester.mint(account1, BigInt(tokenId2), { account: owner });
      await erc721Tester.mint(account1, BigInt(tokenId3), { account: owner });

      await erc721Tester
        .connect(account1)
        .approve(erc721BulkSender.target, BigInt(tokenId1));
      await erc721BulkSender
        .connect(account1)
        .bulkTransferERC721(erc721Tester, [account2], [BigInt(tokenId1)], {
          value: parseEther('0.1'),
        });
      expect(
        (await erc721Tester.ownerOf(BigInt(tokenId1))).toUpperCase(),
      ).to.eqls(account2.address.toUpperCase());
    });
  });
});
