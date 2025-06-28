import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-ignition-ethers";

require("@nomicfoundation/hardhat-chai-matchers");

require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
const infuraKey = process.env.INFURA_API_KEY;
const etherscanKey = process.env.ETHERSCAN_KEY;
if (!privateKey) {
  throw new Error("Private key missed");
}
if (!infuraKey) {
  throw new Error("Infura key missed");
}
if (!etherscanKey) {
  throw new Error("Etherscan key missed");
}

const alchemyKey = process.env.ALCHEMY_API_KEY;
const tatumKey = process.env.TATUM_API_KEY;
if (!alchemyKey) {
  throw new Error("Alchemy key missed");
}
if (!tatumKey) {
  throw new Error("Tatum key missed");
}
var networks = {
  hardhat: {},
  sepolia: {
    url: `https://eth-sepolia.api.onfinality.io/public`,
    accounts: [privateKey],
    chainId: 11155111,
  },
  mainnet: {
    url: `https://mainnet.infura.io/v3/${infuraKey}`,
    accounts: [privateKey],
  },
  avalanche: {
    url: `https://avax-mainnet.g.alchemy.com/v2/${alchemyKey}`,
    accounts: [privateKey],
  },
  uniswap: {
    url: `https://unichain-mainnet.g.alchemy.com/v2/${alchemyKey}`,
    accounts: [privateKey],
  },
  berachain: {
    url: `https://berachain-mainnet.g.alchemy.com/v2/${alchemyKey}`,
    accounts: [privateKey],
  },
  blast: {
    url: `https://blast-mainnet.g.alchemy.com/v2/${alchemyKey}`,
    accounts: [privateKey],
  },
  cronos: {
    url: `https://cro-mainnet.gateway.tatum.io/${tatumKey}`,
    accounts: [privateKey],
  },
};
const config: HardhatUserConfig = {
  defaultNetwork: "sepolia",
  networks: networks,
  solidity: {
    version: "0.8.26", // any version you want
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        details: {
          yulDetails: {
            optimizerSteps: "u",
          },
        },
      },
    },
  },
  etherscan: {
    apiKey: etherscanKey,
  },
};

export default config;
