import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TokenCreatorModule = buildModule("TokenCreator", (m) => {
  var ownerAddress = process.env.OWNER_ADDRESS;
  var tokenCreatorFee = process.env.TOKEN_CREATOR_FEE;
  if (!tokenCreatorFee) {
    throw new Error("Token creator fee is not set in environment variables");
  }
  if (!ownerAddress) {
    throw new Error("Owner address is not set in environment variables");
  }
  const tokenCreator = m.contract("TokenCreator", [
    ethers.parseEther(tokenCreatorFee),
    ownerAddress,
  ]);

  return { tokenCreator };
});

export default TokenCreatorModule;
