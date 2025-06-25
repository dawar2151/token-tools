import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const TokenCreatorModule = buildModule('TokenCreator', (m) => {
  var ownerAddress = process.env.OWNER_ADDRESS;
  if (!ownerAddress) {
    throw new Error('Owner address is not set in environment variables');
  }
  const tokenCreator = m.contract('TokenCreator', [
    ethers.parseEther('0.0001'),
    ownerAddress,
  ]);

  return { tokenCreator };
});

export default TokenCreatorModule;
