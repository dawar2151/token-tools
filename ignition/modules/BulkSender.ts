import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const BulkSenderModule = buildModule('BulkSender', (m) => {
  if (!process.env.OWNER_ADDRESS) {
    throw new Error('OWNER_ADDRESS is required');
  }
  const bulkSender = m.contract('BulkSender', [process.env.OWNER_ADDRESS]);

  return { bulkSender };
});

export default BulkSenderModule;
