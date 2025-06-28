import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import { ethers } from "hardhat";
const tokenLockerModule = buildModule("TokenLocker", (m) => {
  if (!process.env.OWNER_ADDRESS) {
    throw new Error("OWNER_ADDRESS is required");
  }
  const bulkSender = m.contract("TokenLocker", [
    ethers.parseEther("0.001"),
    process.env.OWNER_ADDRESS,
  ]);

  return { bulkSender };
});

export default tokenLockerModule;
