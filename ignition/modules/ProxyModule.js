import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import hre from "hardhat";
import { encodeFunctionData } from 'viem';

const proxyModule = buildModule("ProxyModule", (m) => {
  const proxyAdminOwner = m.getAccount(0);

  const abi = [
    {
      "name": "initialize",
      "type": "function",
      "inputs": [
        { "internalType": "address", "name": "_receiverAddress", "type": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    }
  ];

  // Define the parameters for the 'initialize' function
  const params = [
    process.env.OWNER_ADDRESS
  ];

  // Encode the function data
  const data = encodeFunctionData({ abi, functionName: 'initialize', args: params });

  const bulkSender = m.contract("BulkSender");
  
  const proxy = m.contract("TransparentUpgradeableProxy", [
    bulkSender,
    proxyAdminOwner,
    data,
  ]);

  const proxyAdminAddress = m.readEventArgument(
    proxy,
    "AdminChanged",
    "newAdmin"
  );

  const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress);

  return { proxyAdmin, proxy };
});
export default proxyModule;