import { expect } from 'chai';
import hre from 'hardhat';

describe('TokenCreator', () => {
  let tokenCreator: any;

  beforeEach(async () => {
    tokenCreator = await hre.ethers.deployContract(
      'TokenCreator',
      [hre.ethers.parseEther('0.1')],
      {},
    );
  });

  it('should create a token with the correct length', async () => {
    await expect(
      tokenCreator.createERC20('TOS', 'TSA', 12, 1000, {
        value: hre.ethers.parseEther('0.1'),
      }),
    ).to.emit(tokenCreator, 'ERC20Created');
  });
  it('should create an ERC721 token with the correct parameters', async () => {
    await expect(
      tokenCreator.createERC721('TOS721', 'TSA721', {
        value: hre.ethers.parseEther('0.1'),
      }),
    ).to.emit(tokenCreator, 'ERC721Created');
  });

  it('should create an ERC1155 token with the correct parameters', async () => {
    await expect(
      tokenCreator.createERC1155('https://myuri', {
        value: hre.ethers.parseEther('0.1'),
      }),
    ).to.emit(tokenCreator, 'ERC1155Created');
  });
});
