var pkg = require("hardhat");
const { upgrades, ethers } = pkg;

async function main() {
  const BulkSender = await ethers.getContractFactory("BulkSender");
  var ownerAddress = process.env.OWNER_ADDRESS;
  if (!ownerAddress) {
    throw new Error("Owner address is not set in environment variables");
  }
  var feeReceiverAddress = process.env.FEE_RECEIVER_ADDRESS;
  if (!feeReceiverAddress) {
    throw new Error("Fee receiver address is not set in environment variables");
  }
  const bulkSender = await upgrades.deployProxy(BulkSender, [
    ownerAddress,
    feeReceiverAddress,
  ]);
  await bulkSender.waitForDeployment();
  console.log("Bulk Sender deployed to:", await bulkSender.getAddress());
}

main();
