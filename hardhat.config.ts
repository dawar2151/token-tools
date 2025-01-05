import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-ethers";
import '@openzeppelin/hardhat-upgrades';
import "hardhat-gas-reporter"

require('dotenv').config();


const privateKey = process.env.PRIVATE_KEY;
const infuraKey = process.env.INFURA_API_KEY;
const etherscanKey = process.env.ETHERSCAN_KEY
if(!privateKey){
  throw new Error("Private key missed");  
}
if(!infuraKey){
  throw new Error("Infura key missed")
}
if(!etherscanKey){
  throw new Error("Etherscan key missed")
}
const config: HardhatUserConfig = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${infuraKey}`,
      accounts: [privateKey]
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${infuraKey}`,
      accounts: [privateKey]
    },
    bsc: {
      url: `https://bsc-dataseed.binance.org/`,
      accounts: [privateKey],
      gasPrice: 1000000000
    },
  },
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
  etherscan:{
    apiKey: etherscanKey
  }
};

export default config;
