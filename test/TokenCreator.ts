import { expect } from "chai";
import hre from "hardhat";

describe("TokenCreator", () => {
  let tokenCreator: any;
  beforeEach(async () => {
    const [owner, account1, account2, account3] = await hre.ethers.getSigners();
    tokenCreator = await hre.ethers.deployContract(
      "TokenCreator",
      [hre.ethers.parseEther("0.1"), owner.address],
      {},
    );
  });

  it("should create a token with the correct length", async () => {
    const [owner] = await hre.ethers.getSigners();

    const tx = await tokenCreator
      .connect(owner)
      .createERC20("TOS", "TSA", 12, 1000, {
        value: hre.ethers.parseEther("0.1"),
      });

    const receipt = await tx.wait();
    const event = receipt.logs.find(
      (log: any) => log.fragment && log.fragment.name === "ERC20Created",
    );

    expect(event).to.not.be.undefined;
    const tokenAddress = event.args.tokenAddress;
    console.log("Token Address:", tokenAddress);
    const token = await hre.ethers.getContractAt("ERC20Token", tokenAddress);

    const balance = await token.balanceOf(owner.address);
    expect(balance).to.equal("1000000000000000"); // Assuming 1000 is the initial supply
  });
  it("should create an ERC721 token with the correct parameters", async () => {
    await expect(
      tokenCreator.createERC721("TOS721", "TSA721", {
        value: hre.ethers.parseEther("0.1"),
      }),
    ).to.emit(tokenCreator, "ERC721Created");
  });

  it("should create an ERC1155 token with the correct parameters", async () => {
    await expect(
      tokenCreator.createERC1155("https://myuri", {
        value: hre.ethers.parseEther("0.1"),
      }),
    ).to.emit(tokenCreator, "ERC1155Created");
  });
  it("should revert if the value is less than the required amount", async () => {
    await expect(
      tokenCreator.createERC20("TOS", "TSA", 12, 1000, {
        value: hre.ethers.parseEther("0.05"),
      }),
    ).to.be.revertedWithCustomError(tokenCreator, "InsufficientFee");
  });
  //should withdraw fee test
  it("should withdraw the fee correctly", async () => {
    const [owner, account1] = await hre.ethers.getSigners();
    const initialBalance = await hre.ethers.provider.getBalance(owner.address);
    await tokenCreator.connect(account1).createERC20("TOS", "TSA", 12, 1000, {
      value: hre.ethers.parseEther("0.1"),
    });
    await tokenCreator.withdraw();

    const finalBalance = await hre.ethers.provider.getBalance(owner.address);
    expect(finalBalance).to.be.greaterThan(initialBalance);
  });
});
