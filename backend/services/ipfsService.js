const axios = require('axios');
const FormData = require('form-data');

class IPFSService {
  constructor() {
    // Support both local IPFS and Pinata
    this.useLocalIPFS = process.env.USE_LOCAL_IPFS === 'true';

    if (this.useLocalIPFS) {
      // Local IPFS Desktop configuration
      this.ipfsApiUrl = process.env.IPFS_API_URL || 'http://127.0.0.1:5001';
      this.ipfsGatewayUrl = process.env.IPFS_GATEWAY_URL || 'http://127.0.0.1:8080';
      console.log('✅ Using local IPFS Desktop');
    } else {
      // Pinata configuration
      if (!process.env.PINATA_API_KEY) {
        throw new Error('PINATA_API_KEY environment variable is required when not using local IPFS');
      }
      if (!process.env.PINATA_SECRET_KEY) {
        throw new Error('PINATA_SECRET_KEY environment variable is required when not using local IPFS');
      }

      this.pinataApiKey = process.env.PINATA_API_KEY;
      this.pinataSecretKey = process.env.PINATA_SECRET_KEY;
      this.pinataUrl = process.env.PINATA_API_URL || 'https://api.pinata.cloud';
      this.pinataGateway = process.env.PINATA_GATEWAY_URL || 'https://gateway.pinata.cloud';
      console.log('✅ Using Pinata for IPFS');
    }
  }

  /**
   * Upload file to IPFS (local or Pinata)
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} fileName - Original file name
   * @returns {Promise<{cid: string, url: string}>}
   */
  async uploadFile(fileBuffer, fileName) {
    if (this.useLocalIPFS) {
      return this._uploadFileLocal(fileBuffer, fileName);
    } else {
      return this._uploadFilePinata(fileBuffer, fileName);
    }
  }

  /**
   * Upload file to local IPFS Desktop
   */
  async _uploadFileLocal(fileBuffer, fileName) {
    try {
      const formData = new FormData();
      formData.append('file', fileBuffer, fileName);

      const response = await axios.post(
        `${this.ipfsApiUrl}/api/v0/add`,
        formData,
        {
          headers: {
            ...formData.getHeaders()
          }
        }
      );

      const cid = response.data.Hash;
      const url = `${this.ipfsGatewayUrl}/ipfs/${cid}`;

      console.log(`✅ File uploaded to local IPFS. CID: ${cid}`);

      return { cid, url };
    } catch (error) {
      console.error('❌ Local IPFS upload error:', error.response?.data || error.message);
      throw new Error(`Failed to upload to local IPFS: ${error.message}`);
    }
  }

  /**
   * Upload file to Pinata
   */
  async _uploadFilePinata(fileBuffer, fileName) {
    try {
      const formData = new FormData();
      formData.append('file', fileBuffer, fileName);

      const metadata = JSON.stringify({
        name: fileName,
        keyvalues: {
          app: 'AuditChain',
          type: 'milestone_proof'
        }
      });
      formData.append('pinataMetadata', metadata);

      const response = await axios.post(
        `${this.pinataUrl}/pinning/pinFileToIPFS`,
        formData,
        {
          maxBodyLength: 'Infinity',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            'pinata_api_key': this.pinataApiKey,
            'pinata_secret_api_key': this.pinataSecretKey
          }
        }
      );

      const cid = response.data.IpfsHash;
      const url = `${this.pinataGateway}/ipfs/${cid}`;

      console.log(`✅ File uploaded to Pinata. CID: ${cid}`);

      return { cid, url };
    } catch (error) {
      console.error('❌ Pinata upload error:', error.response?.data || error.message);
      throw new Error(`Failed to upload to Pinata: ${error.message}`);
    }
  }

  /**
   * Upload JSON data to IPFS
   * @param {object} jsonData - JSON object to upload
   * @returns {Promise<{cid: string, url: string}>}
   */
  async uploadJSON(jsonData) {
    if (this.useLocalIPFS) {
      return this._uploadJSONLocal(jsonData);
    } else {
      return this._uploadJSONPinata(jsonData);
    }
  }

  /**
   * Upload JSON to local IPFS
   */
  async _uploadJSONLocal(jsonData) {
    try {
      const jsonString = JSON.stringify(jsonData);
      const buffer = Buffer.from(jsonString);
      
      const formData = new FormData();
      formData.append('file', buffer, 'data.json');

      const response = await axios.post(
        `${this.ipfsApiUrl}/api/v0/add`,
        formData,
        {
          headers: {
            ...formData.getHeaders()
          }
        }
      );

      const cid = response.data.Hash;
      const url = `${this.ipfsGatewayUrl}/ipfs/${cid}`;

      console.log(`✅ JSON uploaded to local IPFS. CID: ${cid}`);

      return { cid, url };
    } catch (error) {
      console.error('❌ Local IPFS JSON upload error:', error.response?.data || error.message);
      throw new Error(`Failed to upload JSON to local IPFS: ${error.message}`);
    }
  }

  /**
   * Upload JSON to Pinata
   */
  async _uploadJSONPinata(jsonData) {
    try {
      const response = await axios.post(
        `${this.pinataUrl}/pinning/pinJSONToIPFS`,
        jsonData,
        {
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': this.pinataApiKey,
            'pinata_secret_api_key': this.pinataSecretKey
          }
        }
      );

      const cid = response.data.IpfsHash;
      const url = `${this.pinataGateway}/ipfs/${cid}`;

      console.log(`✅ JSON uploaded to Pinata. CID: ${cid}`);

      return { cid, url };
    } catch (error) {
      console.error('❌ Pinata JSON upload error:', error.response?.data || error.message);
      throw new Error(`Failed to upload JSON to Pinata: ${error.message}`);
    }
  }

  /**
   * Get file from IPFS
   * @param {string} cid - IPFS CID
   * @returns {Promise<Buffer>}
   */
  async getFile(cid) {
    try {
      const url = this.useLocalIPFS 
        ? `${this.ipfsGatewayUrl}/ipfs/${cid}`
        : `${this.pinataGateway}/ipfs/${cid}`;
        
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return Buffer.from(response.data);
    } catch (error) {
      console.error('❌ IPFS get file error:', error.message);
      throw new Error(`Failed to get file from IPFS: ${error.message}`);
    }
  }
}

module.exports = new IPFSService();
