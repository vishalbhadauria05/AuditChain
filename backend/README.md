# AuditChain Backend 🚀

Backend server for AuditChain - A blockchain-based milestone verification and fund release platform.

## 🏗️ Architecture

```
Giver → creates project (Backend + MongoDB)
        ↓
Backend → sends data to Blockchain (createProject)
        ↓
Taker → uploads bill or proof (Frontend)
        ↓
File stored on IPFS → CID saved in DB
        ↓
Auditor → verifies milestone using MetaMask → Smart Contract updates
        ↓
Smart Contract → releases fund to Taker's wallet
```

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js         # MongoDB connection
│   └── blockchain.js       # Blockchain configuration
├── controllers/
│   ├── authController.js   # Authentication & user management
│   ├── projectController.js # Project creation & management
│   └── milestoneController.js # Milestone & fund release
├── middleware/
│   ├── auth.js            # JWT authentication
│   └── upload.js          # File upload (Multer)
├── models/
│   ├── User.js           # User schema
│   ├── Project.js        # Project schema
│   └── Transaction.js    # Transaction schema
├── routes/
│   ├── authRoutes.js
│   ├── projectRoutes.js
│   ├── milestoneRoutes.js
│   └── transactionRoutes.js
├── services/
│   ├── blockchainService.js  # Ethers.js integration
│   └── ipfsService.js        # Pinata IPFS integration
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## 🛠️ Tech Stack

- **Node.js** + **Express.js** - Backend framework
- **MongoDB** + **Mongoose** - Database
- **Ethers.js** - Blockchain interaction
- **IPFS (Pinata)** - Decentralized file storage
- **JWT** - Authentication
- **Multer** - File uploads

## 📦 Installation

### 1. Install Dependencies

```powershell
cd backend
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and configure:

```powershell
cp .env.example .env
```

Edit `.env` with your values:

```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/auditchain

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Blockchain (update after deploying contract)
CONTRACT_ADDRESS=0xYourContractAddress
RPC_URL=http://127.0.0.1:8545
CHAIN_ID=31337

# IPFS Pinata
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_KEY=your-pinata-secret-key
```

### 3. Start MongoDB

Make sure MongoDB is running:

```powershell
# If using MongoDB locally
mongod

# Or use MongoDB Atlas (cloud)
```

### 4. Deploy Smart Contract

Deploy `AuditChain.sol` using Hardhat/Remix and update `CONTRACT_ADDRESS` in `.env`.

### 5. Run Server

```powershell
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server runs at: `http://localhost:5000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/wallet` | Authenticate with wallet signature | ❌ |
| GET | `/api/auth/profile` | Get user profile | ✅ |
| PUT | `/api/auth/profile` | Update user profile | ✅ |
| GET | `/api/users/role/:role` | Get users by role | ✅ |

### Projects

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/projects` | Create new project | ✅ | Giver |
| GET | `/api/projects` | Get all projects | ✅ | All |
| GET | `/api/projects/:id` | Get project by ID | ✅ | All |
| POST | `/api/projects/:id/cancel` | Cancel project | ✅ | Giver |

### Milestones

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/projects/:projectId/milestones/:milestoneIndex/proof` | Upload proof | ✅ | Taker |
| POST | `/api/projects/:projectId/milestones/:milestoneIndex/verify` | Verify milestone | ✅ | Auditor |
| POST | `/api/projects/:projectId/milestones/:milestoneIndex/release` | Release funds | ✅ | All |
| GET | `/api/projects/:projectId/milestones/:milestoneIndex` | Get milestone details | ✅ | All |

### Transactions

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/projects/:projectId/transactions` | Get project transactions | ✅ |
| GET | `/api/transactions/:hash` | Get transaction by hash | ✅ |

## 🔐 Authentication Flow

1. **Frontend** requests user to sign a message with MetaMask
2. **Backend** verifies signature using `ethers.verifyMessage()`
3. **Backend** creates/finds user and returns JWT token
4. **Frontend** includes JWT in `Authorization: Bearer <token>` header

### Example: Wallet Authentication

```javascript
// Frontend (using ethers.js)
const message = "Sign this message to authenticate with AuditChain";
const signature = await signer.signMessage(message);

// Send to backend
const response = await fetch('/api/auth/wallet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    walletAddress: address,
    signature,
    message,
    name: "John Doe",
    email: "john@example.com",
    role: "giver"
  })
});

const { token } = await response.json();
```

## 🔄 Complete Workflow

### Step 1: Giver Creates Project

```javascript
POST /api/projects
Headers: { Authorization: Bearer <token> }
Body: {
  "name": "Solar Panel Installation",
  "description": "Install 10 solar panels",
  "takerAddress": "0xTakerAddress",
  "auditorAddress": "0xAuditorAddress",
  "milestones": [
    {
      "title": "Phase 1: Setup",
      "description": "Install panels",
      "amount": "1.0"
    },
    {
      "title": "Phase 2: Testing",
      "description": "Test all panels",
      "amount": "0.5"
    }
  ],
  "giverPrivateKey": "0x..." // In production, use better key management
}
```

### Step 2: Funds Locked in Smart Contract

Backend automatically calls `createProject()` on blockchain.

### Step 3: Taker Uploads Proof

```javascript
POST /api/projects/:projectId/milestones/0/proof
Headers: { Authorization: Bearer <token> }
Body: FormData with:
  - file: (image/pdf/document)
  - description: "Installation complete"
```

File uploaded to IPFS, CID saved in MongoDB.

### Step 4: Auditor Verifies Milestone

```javascript
POST /api/projects/:projectId/milestones/0/verify
Headers: { Authorization: Bearer <token> }
Body: {
  "auditorPrivateKey": "0x..."
}
```

Calls `verifyMilestone()` on smart contract.

### Step 5: Release Funds

```javascript
POST /api/projects/:projectId/milestones/0/release
Headers: { Authorization: Bearer <token> }
Body: {
  "signerPrivateKey": "0x..."
}
```

Calls `releaseFunds()` on smart contract, ETH sent to taker.

## 🔧 Configuration

### Blockchain Setup

1. Deploy `AuditChain.sol` using Hardhat:

```powershell
cd ../smartContracts
npx hardhat run scripts/deploy.js --network localhost
```

2. Copy contract address to `.env`

### IPFS Setup (Pinata)

1. Sign up at [Pinata.cloud](https://pinata.cloud)
2. Get API keys from dashboard
3. Add to `.env`

### MongoDB Setup

**Option 1: Local MongoDB**
```powershell
mongod --dbpath ./data/db
```

**Option 2: MongoDB Atlas (Cloud)**
- Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string
- Update `MONGODB_URI` in `.env`

## 🧪 Testing

### Manual Testing with cURL

```powershell
# Health check
curl http://localhost:5000/health

# Authenticate (after getting signature from frontend)
curl -X POST http://localhost:5000/api/auth/wallet `
  -H "Content-Type: application/json" `
  -d '{"walletAddress":"0x...", "signature":"0x...", "message":"...", "name":"Test", "role":"giver"}'
```

## 🚀 Deployment

### Production Checklist

- [ ] Change `JWT_SECRET` to strong random string
- [ ] Use MongoDB Atlas or secure MongoDB instance
- [ ] Deploy smart contract to testnet/mainnet
- [ ] Update `CONTRACT_ADDRESS` and `RPC_URL`
- [ ] Set up proper key management (AWS KMS, HashiCorp Vault)
- [ ] Enable HTTPS
- [ ] Set up logging and monitoring
- [ ] Add rate limiting
- [ ] Configure CORS for your frontend domain

## 📝 Notes

- **Private Key Security**: In production, NEVER send private keys from frontend. Use MetaMask for signing or implement backend wallet management.
- **Gas Fees**: Backend can sponsor gas fees for `releaseFunds()` if needed.
- **IPFS Alternatives**: Can use Infura, Web3.Storage, or your own IPFS node.

## 🐛 Troubleshooting

**MongoDB Connection Error**
```
Solution: Ensure MongoDB is running or check MONGODB_URI
```

**Blockchain Transaction Failed**
```
Solution: Check RPC_URL, CONTRACT_ADDRESS, and ensure contract is deployed
```

**IPFS Upload Failed**
```
Solution: Verify PINATA_API_KEY and PINATA_SECRET_KEY
```

## 📚 Resources

- [Express.js Docs](https://expressjs.com/)
- [Ethers.js Docs](https://docs.ethers.org/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Pinata Docs](https://docs.pinata.cloud/)

## 📄 License

MIT

---

Built with ❤️ for AuditChain
