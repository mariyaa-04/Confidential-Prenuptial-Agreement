// counter-contract/src/config.ts
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const currentDir = __dirname;

export interface Config {
  readonly logDir: string;
  readonly contractName: string;
  readonly contractPath: string;
  readonly buildPath: string;
  readonly network: 'local' | 'testnet' | 'mainnet';
  readonly nodeUrl: string;
  readonly parties: {
    partyA: string;
    partyB: string;
    arbitrator?: string;
  };
  readonly commitmentHash: string;
  readonly marriageDate: string;
}

export class PrenupConfig implements Config {
  // Logging
  logDir = path.resolve(currentDir, '..', 'logs', 'prenup-deployment', `${new Date().toISOString()}.log`);
  
  // Contract paths
  contractName = 'confidential-prenup';
  contractPath = path.resolve(currentDir, 'managed', 'agreement.compact');
  buildPath = path.resolve(currentDir, '..', 'build');
  
  // Network
  network = (process.env.NETWORK as 'local' | 'testnet' | 'mainnet') || 'local';
  nodeUrl = process.env.MIDNIGHT_NODE_URL || 'http://localhost:8080';
  
  // Parties
  parties = {
    partyA: process.env.PARTY_A_ADDRESS || '0x0000000000000000000000000000000000000001',
    partyB: process.env.PARTY_B_ADDRESS || '0x0000000000000000000000000000000000000002',
    arbitrator: process.env.ARBITRATOR_ADDRESS
  };
  
  // Prenup specific
  commitmentHash = process.env.COMMITMENT_HASH || '0x' + '1'.repeat(64);
  marriageDate = process.env.MARRIAGE_DATE || new Date().toISOString().split('T')[0];
  
  constructor() {
    console.log('📋 Configuration loaded:', {
      network: this.network,
      contract: this.contractName,
      parties: this.parties
    });
  }
}

// Legacy config (keep for reference)
export class LogicTestingConfig implements Config {
  logDir = path.resolve(currentDir, '..', 'logs', 'logic-testing', `${new Date().toISOString()}.log`);
  contractName = 'counter';
  contractPath = path.resolve(currentDir, 'counter.compact');
  buildPath = path.resolve(currentDir, '..', 'build');
  network: 'local' | 'testnet' | 'mainnet' = 'local';
  nodeUrl = 'http://localhost:8080';
  parties = {
    partyA: '0x0001',
    partyB: '0x0002'
  };
  commitmentHash = '0x0000';
  marriageDate = new Date().toISOString().split('T')[0];
  
  constructor() {}
}

// Export default for easy switching
export default new PrenupConfig();