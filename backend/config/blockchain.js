// Validate required environment variables
if (!process.env.CONTRACT_ADDRESS) {
  throw new Error('CONTRACT_ADDRESS environment variable is required');
}

if (!process.env.RPC_URL) {
  throw new Error('RPC_URL environment variable is required');
}

module.exports = {
  // Contract address - deployed AuditChain.sol
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  
  // RPC URL for blockchain network
  RPC_URL: process.env.RPC_URL,
  
  // Private key for backend wallet (for gas-less txs if needed)
  PRIVATE_KEY: process.env.PRIVATE_KEY || '',
  
  // Chain ID
  CHAIN_ID: process.env.CHAIN_ID || 31337,
  
  // ABI path
  ABI_PATH: './contracts/AuditChain.json'
};
