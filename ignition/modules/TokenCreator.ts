import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const TokenCreatorModule = buildModule('TokenCreator', (m) => {

  const tokenCreator = m.contract('TokenCreator', [ethers.parseEther('0.00001')]);
  
  return { tokenCreator };
});

export default TokenCreatorModule;

