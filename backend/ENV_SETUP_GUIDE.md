# Environment Variables Setup Guide

This guide will help you configure all required environment variables for the AuditChain backend.

## Quick Start

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in all the values below in your `.env` file

---

## Required Environment Variables

### 1. MongoDB Configuration

**`MONGODB_URI`** - MongoDB connection string

**How to get it:**
- **Option A: MongoDB Atlas (Cloud - Recommended)**
  1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  2. Sign up or log in
  3. Create a new cluster (free tier available)
  4. Click "Connect" → "Connect your application"
  5. Copy the connection string
  6. Replace `<password>` with your database user password
  7. Replace `<dbname>` with your database name (e.g., `auditchain`)

  **Example:**
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/auditchain?retryWrites=true&w=majority
  ```

- **Option B: Local MongoDB**
  1. Install MongoDB locally
  2. Start MongoDB service
  3. Use local connection string

  **Example:**
  ```
  MONGODB_URI=mongodb://localhost:27017/auditchain
  ```

---

### 2. JWT Secret

**`JWT_SECRET`** - Secret key for signing JWT tokens

**How to generate it:**
```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 64

# Option 3: Using PowerShell (Windows)
$bytes = New-Object byte[] 64; (New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); [Convert]::ToBase64String($bytes)
```

**Example:**
```
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

⚠️ **IMPORTANT:** Never share or commit this secret! Keep it secure.

---

### 3. Blockchain Configuration

**`RPC_URL`** - Ethereum RPC endpoint URL

**How to get it:**

- **Option A: Infura (Recommended)**
  1. Go to [Infura](https://infura.io/)
  2. Sign up for free account
  3. Create a new project
  4. Select network (Ethereum Mainnet, Sepolia, etc.)
  5. Copy the HTTPS endpoint

  **Example:**
  ```
  RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
  ```

- **Option B: Alchemy**
  1. Go to [Alchemy](https://www.alchemy.com/)
  2. Create account and new app
  3. Copy the HTTPS URL

  **Example:**
  ```
  RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
  ```

- **Option C: Local Hardhat**
  ```
  RPC_URL=http://127.0.0.1:8545
  ```

---

**`CONTRACT_ADDRESS`** - Deployed AuditChain smart contract address

**How to get it:**
1. Deploy the `AuditChain.sol` smart contract to your chosen network
2. Copy the deployed contract address (starts with `0x` followed by 40 hex characters)

**Example:**
```
CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

📝 **Note:** You need to deploy the smart contract first. See the "Smart Contract Deployment" section below.

---

### 4. IPFS (Pinata) Configuration

**`PINATA_API_KEY`** and **`PINATA_SECRET_KEY`** - Pinata API credentials

**How to get it:**
1. Go to [Pinata](https://www.pinata.cloud/)
2. Sign up for a free account
3. Go to API Keys section
4. Click "New Key"
5. Give it a name (e.g., "AuditChain Backend")
6. Enable "pinFileToIPFS" and "pinJSONToIPFS" permissions
7. Create the key
8. Copy both the API Key and Secret Key

**Example:**
```
PINATA_API_KEY=a1b2c3d4e5f6g7h8i9j0
PINATA_SECRET_KEY=k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2
```

---

**`PINATA_API_URL`** - Pinata API endpoint (usually default)

**Default value:**
```
PINATA_API_URL=https://api.pinata.cloud
```

📝 **Note:** You usually don't need to change this unless using a custom IPFS gateway.

---

**`PINATA_GATEWAY_URL`** - Pinata Gateway for accessing IPFS files

**Default value:**
```
PINATA_GATEWAY_URL=https://gateway.pinata.cloud
```

**Custom Gateway (Optional):**
If you have a dedicated gateway from Pinata:
1. Go to Pinata Dashboard → Gateways
2. Copy your dedicated gateway URL

**Example:**
```
PINATA_GATEWAY_URL=https://mygateway.mypinata.cloud
```

---

### 5. Server Configuration

**`PORT`** - Server port (optional, defaults to 5000)

**Default:**
```
PORT=5000
```

**`NODE_ENV`** - Environment mode

**Options:**
- `development` - For local development
- `production` - For production deployment

**Example:**
```
NODE_ENV=development
```

---

## Complete .env Example

Here's what your `.env` file should look like with all values filled in:

```env
# MongoDB
MONGODB_URI=mongodb+srv://auditchain_user:mySecurePassword123@cluster0.ab1cd.mongodb.net/auditchain?retryWrites=true&w=majority

# JWT Secret (64+ character random string)
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2

# Blockchain
RPC_URL=https://sepolia.infura.io/v3/1234567890abcdef1234567890abcdef
CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890

# IPFS (Pinata)
PINATA_API_KEY=abc123def456ghi789
PINATA_SECRET_KEY=xyz789uvw456rst123opq987lmn654jkl321hij098gfe765dcb432afe210bcd109
PINATA_API_URL=https://api.pinata.cloud
PINATA_GATEWAY_URL=https://gateway.pinata.cloud

# Server
PORT=5000
NODE_ENV=development
```

---

## Smart Contract Deployment

Before running the backend, you need to deploy the AuditChain smart contract:

### Option 1: Deploy to Local Hardhat Network

1. **Install Hardhat in smartContracts folder:**
   ```bash
   cd smartContracts
   npm init -y
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   npx hardhat
   ```

2. **Create deployment script (`scripts/deploy.js`):**
   ```javascript
   const hre = require("hardhat");

   async function main() {
     const AuditChain = await hre.ethers.getContractFactory("AuditChain");
     const auditChain = await AuditChain.deploy();
     await auditChain.waitForDeployment();

     console.log("AuditChain deployed to:", await auditChain.getAddress());
   }

   main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });
   ```

3. **Run deployment:**
   ```bash
   npx hardhat node  # Terminal 1 - Keep running
   npx hardhat run scripts/deploy.js --network localhost  # Terminal 2
   ```

4. **Copy the contract address to your `.env` file**

### Option 2: Deploy to Testnet (Sepolia)

1. **Update `hardhat.config.js`:**
   ```javascript
   require("@nomicfoundation/hardhat-toolbox");

   module.exports = {
     solidity: "0.8.17",
     networks: {
       sepolia: {
         url: process.env.RPC_URL,
         accounts: [process.env.DEPLOYER_PRIVATE_KEY]
       }
     }
   };
   ```

2. **Get testnet ETH:**
   - Go to [Sepolia Faucet](https://sepoliafaucet.com/)
   - Request test ETH for your wallet

3. **Deploy:**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

---

## Verification Checklist

Before starting the server, verify:

- [ ] `.env` file created and all variables filled
- [ ] MongoDB connection string is valid
- [ ] JWT_SECRET is a long random string (64+ chars)
- [ ] Pinata account created and API keys obtained
- [ ] Smart contract deployed and CONTRACT_ADDRESS updated
- [ ] RPC_URL points to correct network

## Running the Backend

Once all environment variables are configured:

```bash
cd backend
npm install
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
🔗 Health check: http://localhost:5000/health
```

## Testing the Setup

Test the health endpoint:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "AuditChain Backend",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string format
- Check if IP is whitelisted in MongoDB Atlas
- Ensure database user has correct permissions

### Blockchain Connection Issues
- Verify RPC_URL is accessible
- Check if contract address is valid (40 hex characters after `0x`)
- Ensure network is correct (mainnet vs testnet)

### IPFS Upload Failures
- Verify Pinata API keys are correct
- Check if API key has proper permissions
- Ensure file size is within Pinata limits

### Authentication Issues
- Verify JWT_SECRET is set and long enough
- Check if secret matches across all environments

---

## Security Best Practices

1. **Never commit `.env` file** - It's in `.gitignore`, keep it there
2. **Use different secrets for different environments** - Production should have different credentials than development
3. **Rotate secrets regularly** - Especially JWT_SECRET and API keys
4. **Use environment-specific MongoDB databases** - Don't use production DB for testing
5. **Keep private keys secure** - Never hardcode or commit deployer private keys

---

## Need Help?

If you encounter issues:
1. Check the console logs for specific error messages
2. Verify all environment variables are set correctly
3. Ensure all external services (MongoDB, Pinata, RPC) are accessible
4. Review the backend README.md for additional documentation
