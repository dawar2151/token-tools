import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";


const BulkSenderModule = buildModule("BulkSender", (m) => {

  const bulkSender = m.contract("BulkSender", ["0xa0BfF9CA8aF0649eB056cA1a902b559Da97FFde9"]);

  return { bulkSender };
});

export default BulkSenderModule;
