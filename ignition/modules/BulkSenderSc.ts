var pkg = require('hardhat');
const { upgrades, ethers } = pkg;

async function main() {
  const BulkSender = await ethers.getContractFactory('BulkSender');

  const bulkSender = await upgrades.deployProxy(BulkSender, [
    process.env.OWNER_ADDRESS,
  ]);
  await bulkSender.waitForDeployment();
  console.log('Bulk Sender deployed to:', await bulkSender.getAddress());
}

main();
