const { ethers } = require('ethers');
const config = require('../config/blockchain');
const Transaction = require('../models/Transaction');

// AuditChain contract ABI (add complete ABI after compilation)
const ABI = [
  "function projectCount() view returns (uint256)",
  "function createProject(address taker, address auditor, uint256[] amounts) payable returns (uint256)",
  "function verifyMilestone(uint256 projectId, uint256 milestoneIndex)",
  "function releaseFunds(uint256 projectId, uint256 milestoneIndex)",
  "function cancelProject(uint256 projectId)",
  "function getMilestone(uint256 projectId, uint256 milestoneIndex) view returns (uint256 amount, bool verified, bool released)",
  "function getProject(uint256 projectId) view returns (address giver, address taker, address auditor, uint256 total, uint256 milestoneCount, uint256 releasedCount, bool active)",
  "event ProjectCreated(uint256 indexed projectId, address indexed giver, address indexed taker, address auditor, uint256 total)",
  "event MilestoneVerified(uint256 indexed projectId, uint256 indexed milestoneIndex, address indexed auditor)",
  "event FundsReleased(uint256 indexed projectId, uint256 indexed milestoneIndex, address indexed taker, uint256 amount)",
  "event ProjectCancelled(uint256 indexed projectId, address indexed giver, uint256 refund)"
];

class BlockchainService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.RPC_URL);
    this.contract = new ethers.Contract(config.CONTRACT_ADDRESS, ABI, this.provider);
  }

  /**
   * Get contract instance with signer (for write operations)
   */
  getContractWithSigner(privateKey) {
    const wallet = new ethers.Wallet(privateKey, this.provider);
    return new ethers.Contract(config.CONTRACT_ADDRESS, ABI, wallet);
  }

  /**
   * Create a project on blockchain
   * @param {string} giverPrivateKey - Giver's private key
   * @param {string} takerAddress - Taker's wallet address
   * @param {string} auditorAddress - Auditor's wallet address
   * @param {string[]} amounts - Array of milestone amounts in wei
   * @returns {Promise<{projectId: number, txHash: string, receipt: object}>}
   */
  async createProject(giverPrivateKey, takerAddress, auditorAddress, amounts) {
    try {
      const contract = this.getContractWithSigner(giverPrivateKey);
      
      // Calculate total amount
      const total = amounts.reduce((sum, amt) => sum + BigInt(amt), BigInt(0));
      
      // Send transaction
      const tx = await contract.createProject(takerAddress, auditorAddress, amounts, {
        value: total
      });
      
      console.log(`⏳ Creating project on blockchain... TX: ${tx.hash}`);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      // Parse event to get projectId
      const event = receipt.logs.find(log => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed.name === 'ProjectCreated';
        } catch (e) {
          return false;
        }
      });
      
      const parsedEvent = contract.interface.parseLog(event);
      const projectId = Number(parsedEvent.args.projectId);
      
      console.log(`✅ Project created on blockchain. ID: ${projectId}`);
      
      return {
        projectId,
        txHash: tx.hash,
        receipt
      };
    } catch (error) {
      console.error('❌ Blockchain createProject error:', error);
      throw new Error(`Failed to create project on blockchain: ${error.message}`);
    }
  }

  /**
   * Verify a milestone on blockchain
   * @param {string} auditorPrivateKey - Auditor's private key
   * @param {number} projectId - Blockchain project ID
   * @param {number} milestoneIndex - Milestone index
   * @returns {Promise<{txHash: string, receipt: object}>}
   */
  async verifyMilestone(auditorPrivateKey, projectId, milestoneIndex) {
    try {
      const contract = this.getContractWithSigner(auditorPrivateKey);
      
      const tx = await contract.verifyMilestone(projectId, milestoneIndex);
      console.log(`⏳ Verifying milestone... TX: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`✅ Milestone ${milestoneIndex} verified for project ${projectId}`);
      
      return {
        txHash: tx.hash,
        receipt
      };
    } catch (error) {
      console.error('❌ Blockchain verifyMilestone error:', error);
      throw new Error(`Failed to verify milestone: ${error.message}`);
    }
  }

  /**
   * Release funds for a milestone
   * @param {string} signerPrivateKey - Private key of caller (can be anyone)
   * @param {number} projectId - Blockchain project ID
   * @param {number} milestoneIndex - Milestone index
   * @returns {Promise<{txHash: string, receipt: object}>}
   */
  async releaseFunds(signerPrivateKey, projectId, milestoneIndex) {
    try {
      const contract = this.getContractWithSigner(signerPrivateKey);
      
      const tx = await contract.releaseFunds(projectId, milestoneIndex);
      console.log(`⏳ Releasing funds... TX: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`✅ Funds released for milestone ${milestoneIndex} of project ${projectId}`);
      
      return {
        txHash: tx.hash,
        receipt
      };
    } catch (error) {
      console.error('❌ Blockchain releaseFunds error:', error);
      throw new Error(`Failed to release funds: ${error.message}`);
    }
  }

  /**
   * Cancel a project and refund
   * @param {string} giverPrivateKey - Giver's private key
   * @param {number} projectId - Blockchain project ID
   * @returns {Promise<{txHash: string, receipt: object}>}
   */
  async cancelProject(giverPrivateKey, projectId) {
    try {
      const contract = this.getContractWithSigner(giverPrivateKey);
      
      const tx = await contract.cancelProject(projectId);
      console.log(`⏳ Cancelling project... TX: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`✅ Project ${projectId} cancelled`);
      
      return {
        txHash: tx.hash,
        receipt
      };
    } catch (error) {
      console.error('❌ Blockchain cancelProject error:', error);
      throw new Error(`Failed to cancel project: ${error.message}`);
    }
  }

  /**
   * Get project details from blockchain
   * @param {number} projectId - Blockchain project ID
   */
  async getProject(projectId) {
    try {
      const result = await this.contract.getProject(projectId);
      return {
        giver: result[0],
        taker: result[1],
        auditor: result[2],
        total: result[3].toString(),
        milestoneCount: Number(result[4]),
        releasedCount: Number(result[5]),
        active: result[6]
      };
    } catch (error) {
      console.error('❌ Blockchain getProject error:', error);
      throw new Error(`Failed to get project: ${error.message}`);
    }
  }

  /**
   * Get milestone details from blockchain
   * @param {number} projectId - Blockchain project ID
   * @param {number} milestoneIndex - Milestone index
   */
  async getMilestone(projectId, milestoneIndex) {
    try {
      const result = await this.contract.getMilestone(projectId, milestoneIndex);
      return {
        amount: result[0].toString(),
        verified: result[1],
        released: result[2]
      };
    } catch (error) {
      console.error('❌ Blockchain getMilestone error:', error);
      throw new Error(`Failed to get milestone: ${error.message}`);
    }
  }

  /**
   * Save transaction to database
   */
  async saveTransaction(data) {
    try {
      const transaction = new Transaction(data);
      await transaction.save();
      return transaction;
    } catch (error) {
      console.error('❌ Error saving transaction:', error);
    }
  }
}

module.exports = new BlockchainService();
