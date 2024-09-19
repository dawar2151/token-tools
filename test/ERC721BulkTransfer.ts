import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
  import { expect } from "chai";
  import hre from "hardhat";
  import { parseEther } from "viem";
  
  describe("ERC721 Bulk Transfer", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function depolyERC721AndERC721BulkSender() {
  
  
      // Contracts are deployed using the first signer/account by default
      const [owner, account1, account2, account3] = await hre.viem.getWalletClients();
  
      const erc721Tester = await hre.viem.deployContract("ERC721Tester", [], {
      });
      const erc721BulkSender = await hre.viem.deployContract("BulkSender", [owner.account.address]);
  
      const publicClient = await hre.viem.getPublicClient();
  
      return {
        erc721Tester,
        erc721BulkSender,
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
          erc721Tester,
          erc721BulkSender,
          owner,
          account1,
          account2,
          account3,
          publicClient,
        } = await loadFixture(depolyERC721AndERC721BulkSender);
        const tokenId1 = 1;
        const tokenId2 = 2;
        const tokenId3 = 3;

        await erc721Tester.write.mint([account1.account.address, BigInt(tokenId1)],{account: owner.account.address});
        await erc721Tester.write.mint([account1.account.address, BigInt(tokenId2)], {account: owner.account.address});
        await erc721Tester.write.mint([account1.account.address, BigInt(tokenId3)], {account: owner.account.address});

        await erc721Tester.write.approve([erc721BulkSender.address, BigInt(tokenId1)], {account: account1.account.address});
        await erc721BulkSender.write.bulkTransferERC721([erc721Tester.address,[account2.account.address], [BigInt(tokenId1)]], {
          value: parseEther('0.1'),
          account: account1.account.address
        });
        expect((await erc721Tester.read.ownerOf([BigInt(tokenId1)])).toUpperCase()).to.eqls(account2.account.address.toUpperCase());
      });
    });
  });
  