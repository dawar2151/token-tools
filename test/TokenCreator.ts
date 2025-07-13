import { expect } from "chai";
import { AddressLike } from "ethers";
import hre from "hardhat";

describe("TokenCreator", () => {
  let tokenCreator: any;
  let fee = hre.ethers.parseEther("0.1");
  let ownerAddress: AddressLike;
  let creatorAddress: AddressLike;
  let creatorAccount: any;

  beforeEach(async () => {
    const [owner, account1] = await hre.ethers.getSigners();
    creatorAccount = account1;
    ownerAddress = owner.address;
    creatorAddress = account1.address;

    tokenCreator = await hre.ethers.deployContract("TokenCreator", [fee, ownerAddress]);
  });

  const extractTokenAddressFromEvent = async (
    tx: any,
    eventName: string
  ): Promise<string> => {
    const receipt = await tx.wait();
    const eventSignature = hre.ethers.id(`${eventName}(address)`);
    const log = receipt.logs.find((log: any) => log.topics[0] === eventSignature);

    expect(log, `${eventName} event not found`).to.not.be.undefined;

    return hre.ethers.getAddress(log.data.slice(26));
  };

  describe("Creation Events", () => {
    it("should emit ERC20Created", async () => {
      await expect(
        tokenCreator.createERC20("TOS", "TSA", 12, 1000, { value: fee })
      ).to.emit(tokenCreator, "ERC20Created");
    });

    it("should emit ERC721Created", async () => {
      await expect(
        tokenCreator.createERC721("TOS721", "TSA721", { value: fee })
      ).to.emit(tokenCreator, "ERC721Created");
    });

    it("should emit ERC1155Created", async () => {
      await expect(
        tokenCreator.createERC1155("https://myuri", { value: fee })
      ).to.emit(tokenCreator, "ERC1155Created");
    });
  });

  describe("Fee Handling", () => {
    it("should revert if the value is less than required", async () => {
      await expect(
        tokenCreator.createERC20("TOS", "TSA", 12, 1000, {
          value: hre.ethers.parseEther("0.05"),
        })
      ).to.be.revertedWithCustomError(tokenCreator, "InsufficientFee");
    });

    const checkOwnerBalanceIncrease = async (createFn: () => Promise<void>) => {
      const initial = await hre.ethers.provider.getBalance(ownerAddress);
      await createFn();
      const final = await hre.ethers.provider.getBalance(ownerAddress);
      expect(final).to.equal(initial + fee);
    };

    it("should transfer the fee when creating an ERC20 token", async () => {
      await checkOwnerBalanceIncrease(() =>
        tokenCreator.connect(creatorAccount).createERC20("TOS", "TSA", 12, 1000, { value: fee })
      );
    });

    it("should transfer the fee when creating an ERC721 token", async () => {
      await checkOwnerBalanceIncrease(() =>
        tokenCreator.connect(creatorAccount).createERC721("TOS721", "TSA721", { value: fee })
      );
    });

    it("should transfer the fee when creating an ERC1155 token", async () => {
      await checkOwnerBalanceIncrease(() =>
        tokenCreator.connect(creatorAccount).createERC1155("https://myuri", { value: fee })
      );
    });
  });

  describe("Ownership Assignment", () => {
    it("should assign ERC20 token ownership to the creator", async () => {
      const tx = await tokenCreator.connect(creatorAccount).createERC20("TOS", "TSA", 12, 1000, {
        value: fee,
      });

      const tokenAddress = await extractTokenAddressFromEvent(tx, "ERC20Created");
      const erc20 = await hre.ethers.getContractAt("ERC20Token", tokenAddress);
      expect(await erc20.owner()).to.equal(creatorAccount.address);
    });

    it("should assign ERC721 token ownership to the creator", async () => {
      const tx = await tokenCreator.connect(creatorAccount).createERC721("TOS721", "TSA721", {
        value: fee,
      });

      const tokenAddress = await extractTokenAddressFromEvent(tx, "ERC721Created");
      const erc721 = await hre.ethers.getContractAt("ERC721Token", tokenAddress);
      expect(await erc721.owner()).to.equal(creatorAccount.address);
    });

    it("should assign ERC1155 token ownership to the creator", async () => {
      const tx = await tokenCreator.connect(creatorAccount).createERC1155("https://myuri", {
        value: fee,
      });

      const tokenAddress = await extractTokenAddressFromEvent(tx, "ERC1155Created");
      const erc1155 = await hre.ethers.getContractAt("ERC1155Token", tokenAddress);
      expect(await erc1155.owner()).to.equal(creatorAccount.address);
    });
  });
});
