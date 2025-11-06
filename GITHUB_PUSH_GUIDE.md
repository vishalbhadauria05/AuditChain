# GitHub Push Guide for AuditChain

This guide will help you push your **backend** and **smartContracts** code to your GitHub repository.

## ⚠️ Before You Start - Security Check

Your `.env` file contains **sensitive credentials** and is already in `.gitignore`. Let's verify it won't be pushed:

### 1. Check `.gitignore` Status
```bash
cat backend\.gitignore
```

Should show `.env` is listed (✅ Already configured)

---

## 📋 Step-by-Step Guide

### Step 1: Check Current Git Status

Open PowerShell in your project directory and run:

```powershell
cd C:\Users\visha\OneDrive\Desktop\AuditChain
git status
```

This will show you all the files that have changed.

---

### Step 2: Verify `.env` is NOT Tracked

**CRITICAL**: Make sure your `.env` file is NOT being tracked:

```powershell
git status | Select-String ".env"
```

If you see `.env` file listed, **STOP** and run:

```powershell
# Remove .env from git tracking (if accidentally added)
git rm --cached backend/.env
```

---

### Step 3: Add Your Files to Git

Add the backend and smart contracts to staging:

```powershell
# Add backend files
git add backend/

# Add smart contracts
git add smartContracts/

# Optionally add README if you want
git add README.md
```

**Alternative - Add everything except ignored files:**
```powershell
git add .
```

---

### Step 4: Check What Will Be Committed

Review the files about to be committed:

```powershell
git status
```

**Verify**:
- ✅ `backend/` files are listed
- ✅ `smartContracts/` files are listed
- ❌ `.env` file is **NOT** listed
- ❌ `node_modules/` is **NOT** listed

---

### Step 5: Commit Your Changes

Create a commit with a descriptive message:

```powershell
git commit -m "feat: Add complete backend and smart contracts

- Node.js/Express backend with MongoDB integration
- AuditChain.sol smart contract for milestone-based escrow
- IPFS integration (local Desktop + Pinata support)
- JWT authentication with wallet signatures
- Blockchain service with Ethers.js
- Complete API endpoints for projects, milestones, transactions
- Environment-based configuration
"
```

---

### Step 6: Push to GitHub

Push your code to the main branch:

```powershell
git push origin main
```

If you encounter authentication issues, you'll need a **Personal Access Token** (see troubleshooting below).

---

## 🔧 Common Issues & Solutions

### Issue 1: Authentication Failed

**Solution**: Use GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "AuditChain Repo Access"
4. Select scopes: `repo` (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

Then push using:
```powershell
git push https://<YOUR_TOKEN>@github.com/vishalbhadauria05/AuditChain.git main
```

Or configure git to remember credentials:
```powershell
git config credential.helper store
git push origin main
# Enter your GitHub username and paste the token as password
```

---

### Issue 2: `.env` File Accidentally Committed

**If you already committed .env, remove it:**

```powershell
# Remove from tracking
git rm --cached backend/.env

# Commit the removal
git commit -m "chore: Remove .env from version control"

# Push
git push origin main
```

---

### Issue 3: Merge Conflicts

If someone else pushed changes:

```powershell
# Pull latest changes first
git pull origin main --rebase

# Resolve any conflicts if they appear
# Then push
git push origin main
```

---

## 📂 What Will Be Pushed

Based on your current changes, these files will be pushed:

### Backend (~20+ files)
```
backend/
├── config/
│   ├── blockchain.js
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── milestoneController.js
│   └── projectController.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── models/
│   ├── Project.js
│   ├── Transaction.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── milestoneRoutes.js
│   ├── projectRoutes.js
│   └── transactionRoutes.js
├── services/
│   ├── blockchainService.js
│   └── ipfsService.js
├── .gitignore
├── .env.example
├── ENV_SETUP_GUIDE.md
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

### Smart Contracts
```
smartContracts/
└── contracts/
    └── AuditChain.sol
```

---

## 🛡️ Security Checklist Before Pushing

- [ ] `.env` file is in `.gitignore`
- [ ] `.env` file is **NOT** in `git status` output
- [ ] `node_modules/` is in `.gitignore`
- [ ] No hardcoded API keys in code files
- [ ] Contract address in `.env.example` is just a placeholder or the real deployed address (safe to share)
- [ ] MongoDB connection string is in `.env` only (not in code)
- [ ] JWT_SECRET is in `.env` only

---

## 🎯 Quick Command Sequence (Copy & Paste)

Once you've verified everything, here's the quick sequence:

```powershell
# Navigate to project
cd C:\Users\visha\OneDrive\Desktop\AuditChain

# Check status
git status

# Verify .env is NOT listed
git status | Select-String ".env"

# Add files
git add backend/
git add smartContracts/
git add README.md

# Check what's staged
git status

# Commit
git commit -m "feat: Add complete backend and smart contracts with IPFS and blockchain integration"

# Push
git push origin main
```

---

## 📝 After Pushing

### Update Your README on GitHub

Add a badge and deployment info to your README:

```markdown
## 🚀 Deployment

### Backend
- Deployed on: [Your hosting service]
- API Base URL: https://your-api.com

### Smart Contract
- Network: Sepolia Testnet
- Contract Address: `0x4c8e532a98edc8ae5318705b867a26ec250fece6`
- Explorer: https://sepolia.etherscan.io/address/0x4c8e532a98edc8ae5318705b867a26ec250fece6
```

---

## 🔄 Future Updates

When you make changes later:

```powershell
# Check what changed
git status

# Add changed files
git add .

# Commit with meaningful message
git commit -m "fix: Update IPFS service error handling"

# Push
git push origin main
```

---

## ❓ Need Help?

If you encounter any issues:

1. **Check GitHub Status**: https://www.githubstatus.com/
2. **View Git Logs**: `git log --oneline -10`
3. **Undo Last Commit** (if needed): `git reset --soft HEAD~1`
4. **Discard Local Changes**: `git checkout -- <file>`

---

## ✅ Success Checklist

After pushing, verify on GitHub:

- [ ] Visit: https://github.com/vishalbhadauria05/AuditChain
- [ ] Confirm `backend/` folder exists
- [ ] Confirm `smartContracts/` folder exists
- [ ] Confirm `.env` is **NOT** visible
- [ ] Check that `node_modules/` is **NOT** there
- [ ] Review recent commits in the commit history

---

**Happy Coding! 🎉**

If you see your code on GitHub without the `.env` file, you're all set! 

Next steps:
1. Test API endpoints (Postman/Thunder Client)
2. Build the frontend (Next.js)
3. Deploy to production
