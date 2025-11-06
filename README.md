# AuditChain 🔗

**Blockchain-based milestone verification and fund release platform with complete transparency**

> A decentralized escrow system where Givers fund projects, Takers complete work, and Auditors verify milestones before automatic fund release via smart contracts.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Solidity](https://img.shields.io/badge/solidity-^0.8.17-blue)](https://soliditylang.org/)

---

## 🎯 What is AuditChain?

AuditChain solves the trust problem in freelance/contract work by using:
- **Blockchain transparency** - All transactions visible and immutable
- **Milestone verification** - Work verified before payment
- **Smart contract escrow** - Funds automatically released when approved
- **IPFS proof storage** - Immutable evidence of work completion

### The Problem
- ❌ Traditional escrow services are centralized and expensive
- ❌ No transparency in fund usage
- ❌ Payment disputes and delays
- ❌ No verifiable proof of work completion

### The Solution
✅ **AuditChain** - Decentralized, transparent, automated milestone-based payments

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB
- MetaMask
- Git

### Installation (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/vishalbhadauria05/AuditChain.git
cd AuditChain

# 2. Install backend dependencies
cd backend
npm install

# 3. Setup environment
copy .env.example .env
# Edit .env with your configuration

# 4. Start MongoDB
mongod

# 5. Deploy smart contract (in another terminal)
cd ../smartContracts
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

# 6. Start backend
cd ../backend
npm run dev
```

📖 **Detailed setup**: See [QUICKSTART.md](QUICKSTART.md)

---

## 📁 Project Structure

```
AuditChain/
├── backend/                 ✅ Complete Node.js + Express backend
│   ├── config/             # Database & blockchain configuration
│   ├── controllers/        # Business logic (auth, projects, milestones)
│   ├── middleware/         # Authentication, file upload
│   ├── models/             # MongoDB schemas (User, Project, Transaction)
│   ├── routes/             # API endpoints
│   ├── services/           # Blockchain & IPFS integration
│   └── server.js           # Main server file
│
├── smartContracts/         ✅ Complete Solidity smart contract
│   └── contracts/
│       └── AuditChain.sol  # Main escrow contract
│
├── frontend/               ⏳ Next.js app (coming soon)
│
└── docs/
    ├── API_DOCUMENTATION.md     # Complete API reference
    ├── COMPLETE_WORKFLOW.md     # System flow explanation
    ├── ARCHITECTURE.md          # System architecture diagrams
    └── QUICKSTART.md            # Setup guide
```

---

## 🔄 How It Works

### Step-by-Step Flow

```
1️⃣ Giver creates project
   → Adds milestones (e.g., "Phase 1: Setup", "Phase 2: Testing")
   → Funds locked in smart contract

2️⃣ Smart contract holds funds
   → Funds in escrow (not directly sent to Taker)
   → Transparent and auditable

3️⃣ Taker uploads proof
   → Uploads bill/image/document to IPFS
   → CID saved in database

4️⃣ Auditor verifies milestone
   → Reviews proof
   → Marks verified on blockchain (MetaMask transaction)

5️⃣ Smart contract auto-releases funds
   → ETH sent to Taker's wallet
   → Transaction recorded permanently

6️⃣ Data stored immutably
   → Blockchain: Transactions & verification
   → IPFS: Proof files
   → MongoDB: Metadata for quick queries
```

📖 **Detailed workflow**: See [COMPLETE_WORKFLOW.md](COMPLETE_WORKFLOW.md)

---

## 👥 Three Roles

### 🤝 Giver (Client/Funder)
- Creates projects with milestones
- Deposits funds into smart contract
- Can cancel and get refund for unreleased milestones

### 🛠️ Taker (Worker/Contractor)
- Completes work
- Uploads proof of milestone completion (IPFS)
- Receives funds automatically after verification

### ✅ Auditor (Verifier)
- Reviews proof of work
- Verifies milestones on blockchain
- Triggers automatic fund release

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Blockchain**: Ethers.js v6
- **Storage**: IPFS (Pinata)
- **Auth**: JWT + Wallet Signatures

### Smart Contract
- **Language**: Solidity ^0.8.17
- **Development**: Hardhat
- **Network**: Ethereum (local/testnet/mainnet)

### Frontend (Coming Soon)
- **Framework**: Next.js 14
- **Web3**: Ethers.js + MetaMask
- **Styling**: TailwindCSS

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/wallet              # Authenticate with wallet signature
GET    /api/auth/profile             # Get user profile
PUT    /api/auth/profile             # Update profile
```

### Projects
```
POST   /api/projects                 # Create project (Giver only)
GET    /api/projects                 # Get all projects
GET    /api/projects/:id             # Get project details
POST   /api/projects/:id/cancel      # Cancel project (Giver only)
```

### Milestones
```
POST   /api/projects/:id/milestones/:index/proof     # Upload proof (Taker)
POST   /api/projects/:id/milestones/:index/verify    # Verify (Auditor)
POST   /api/projects/:id/milestones/:index/release   # Release funds
GET    /api/projects/:id/milestones/:index           # Get milestone
```

📖 **Full API docs**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## 🔐 Security Features

- ✅ **Wallet signature verification** - Ensures user owns the wallet
- ✅ **Role-based access control** - Giver/Taker/Auditor permissions
- ✅ **Smart contract security** - Reentrancy guard, input validation
- ✅ **IPFS immutability** - Content-addressed storage (CID = hash)
- ✅ **Blockchain transparency** - All transactions publicly auditable

---

## 🎓 Documentation

| Document | Description |
|----------|-------------|
| [QUICKSTART.md](QUICKSTART.md) | Get started in 10 minutes |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Complete REST API reference |
| [COMPLETE_WORKFLOW.md](COMPLETE_WORKFLOW.md) | Detailed system flow with diagrams |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture & design |
| [backend/README.md](backend/README.md) | Backend-specific documentation |

---

## 🧪 Testing

```bash
# Start local blockchain
npx hardhat node

# Deploy contract
npx hardhat run scripts/deploy.js --network localhost

# Start backend
cd backend
npm run dev

# Test API
curl http://localhost:5000/health
```

📖 **Testing guide**: See [QUICKSTART.md](QUICKSTART.md#testing-the-complete-flow)

---

## 🚀 Deployment

### Backend
- Deploy to: Railway, Render, Heroku, or AWS
- MongoDB: MongoDB Atlas (recommended)
- Environment: Set all `.env` variables

### Smart Contract
- Testnet: Sepolia, Goerli
- Mainnet: Ethereum mainnet (when ready)
- Use Hardhat deployment scripts

### Frontend
- Deploy to: Vercel, Netlify
- Connect to backend API
- MetaMask integration

---

## 📊 Example Use Cases

### 1. Freelance Software Development
- **Milestone 1**: Design mockups → $500
- **Milestone 2**: Frontend implementation → $1000
- **Milestone 3**: Backend API → $1500
- **Milestone 4**: Testing & deployment → $500

### 2. Construction Projects
- **Milestone 1**: Foundation work → 10 ETH
- **Milestone 2**: Structure completion → 20 ETH
- **Milestone 3**: Finishing work → 15 ETH

### 3. Marketing Campaigns
- **Milestone 1**: Strategy document → 2 ETH
- **Milestone 2**: Content creation → 5 ETH
- **Milestone 3**: Campaign execution → 8 ETH

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔮 Roadmap

- [x] Smart contract implementation
- [x] Backend API with MongoDB
- [x] IPFS integration for proof storage
- [x] Blockchain integration with Ethers.js
- [ ] Frontend (Next.js + MetaMask)
- [ ] Multi-token support (USDC, DAI)
- [ ] Dispute resolution mechanism
- [ ] Reputation system
- [ ] Mobile app (React Native)
- [ ] Email/SMS notifications

---

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs or request features](https://github.com/vishalbhadauria05/AuditChain/issues)
- **Email**: support@auditchain.app
- **Discord**: [Join our community](#)

---

## 🙏 Acknowledgments

- OpenZeppelin for smart contract security patterns
- Hardhat for development environment
- Pinata for IPFS infrastructure
- Ethers.js for blockchain interaction

---

**Built with ❤️ for transparency and trust in digital transactions**

---

## 📸 Screenshots (Coming Soon)

- Dashboard views for all three roles
- Project creation flow
- Milestone verification interface
- Transaction history

---

**⭐ If you find this project helpful, please give it a star!**