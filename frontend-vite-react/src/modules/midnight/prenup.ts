import { sha256 } from '@noble/hashes/sha256';

// Define interfaces locally to avoid import issues
export interface PrenupState {
    commitmentRoot: string;
    partyA: string;
    partyB: string;
    isActive: boolean;
    marriageDate: Date;
}

export interface ContractTransaction {
    txId: string;
    blockHeight?: number;
    timestamp?: Date;
}

// Define contract instance interface (this IS used)
interface ContractInstance {
    query(field: string, ...args: any[]): Promise<any>;
    transact(method: string, options: { args: any[] }): Promise<{
        txId: string;
        blockHeight?: number;
    }>;
}

export class PrenupContract {
    private contract: ContractInstance | null = null;
    private address: string;
    private cachedState: PrenupState | null = null;

    constructor(contract: ContractInstance, address: string) {
        this.contract = contract;
        this.address = address;
        console.log('📄 PrenupContract instance created for:', address);
    }

    static async create(provider: any, contractAddress: string): Promise<PrenupContract> {
        try {
            console.log('🔄 Creating contract instance for:', contractAddress);
            
            // Connect to existing contract
            const contract = await provider.connectContract({
                address: contractAddress
            }) as ContractInstance;
            
            if (!contract) {
                throw new Error('Failed to connect to contract - null response');
            }
            
            console.log('✅ Contract instance created successfully');
            return new PrenupContract(contract, contractAddress);
            
        } catch (error) {
            console.error('❌ Failed to create contract instance:', error);
            throw new Error(`Contract creation failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async getState(): Promise<PrenupState> {
        try {
            console.log('🔄 Fetching contract state...');
            
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }
            
            // Query public state from contract
            const commitmentRoot = await this.contract.query('prenupCommitment').catch(() => '0x0000...');
            const partyA = await this.contract.query('partyA').catch(() => '');
            const partyB = await this.contract.query('partyB').catch(() => '');
            const isActive = await this.contract.query('isActive').catch(() => false);
            const marriageDate = await this.contract.query('marriageDate').catch(() => new Date().toISOString());

            const state: PrenupState = {
                commitmentRoot: commitmentRoot || '0x0000...',
                partyA: partyA || '',
                partyB: partyB || '',
                isActive: isActive || false,
                marriageDate: marriageDate ? new Date(marriageDate) : new Date()
            };

            this.cachedState = state;
            console.log('✅ Contract state fetched successfully');
            console.log('📊 State:', {
                partyA: state.partyA ? state.partyA.substring(0, 10) + '...' : 'unknown',
                partyB: state.partyB ? state.partyB.substring(0, 10) + '...' : 'unknown',
                isActive: state.isActive,
                marriageDate: state.marriageDate.toLocaleDateString()
            });
            
            return state;
            
        } catch (error) {
            console.error('❌ Failed to get contract state:', error);
            throw new Error(`Failed to get contract state: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async addClause(
        clauseId: number | bigint,
        conditionType: string,
        conditionText: string,
        assetType: string,
        recipient: string,
        amount: number | bigint
    ): Promise<ContractTransaction> {
        try {
            console.log('🔄 Adding clause:', clauseId.toString());
            console.log('📝 Condition type:', conditionType);
            console.log('📝 Asset:', assetType, 'Amount:', amount.toString(), 'To:', recipient.substring(0, 10) + '...');
            
            // Validate inputs
            if (!conditionText || !conditionText.trim()) throw new Error('Condition text cannot be empty');
            if (!recipient || !recipient.trim()) throw new Error('Recipient address cannot be empty');
            
            const amountBigInt = typeof amount === 'bigint' ? amount : BigInt(amount);
            if (amountBigInt <= 0) throw new Error('Amount must be greater than 0');
            
            const clauseIdBigInt = typeof clauseId === 'bigint' ? clauseId : BigInt(clauseId);
            
            // Hash the condition for privacy
            const conditionHash = '0x' + Buffer.from(sha256(conditionText)).toString('hex');
            console.log('🔑 Condition hashed for privacy');
            
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }
            
            // Execute transaction
            const tx = await this.contract.transact('addClause', {
                args: [
                    clauseIdBigInt,
                    conditionType,
                    conditionHash,
                    assetType,
                    recipient,
                    amountBigInt
                ]
            });
            
            console.log('✅ Clause added successfully, tx:', tx.txId);
            
            return {
                txId: tx.txId,
                blockHeight: tx.blockHeight,
                timestamp: new Date()
            };
            
        } catch (error) {
            console.error('❌ Failed to add clause:', error);
            throw new Error(`Failed to add clause: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async executeClause(clauseId: number | bigint, proofData: string): Promise<ContractTransaction> {
        try {
            console.log('🔄 Executing clause:', clauseId.toString());
            console.log('📝 Proof data:', proofData);
            
            if (!clauseId) throw new Error('Clause ID is required');
            if (!proofData || !proofData.trim()) throw new Error('Proof data is required');
            
            const clauseIdBigInt = typeof clauseId === 'bigint' ? clauseId : BigInt(clauseId);
            
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }
            
            // Execute transaction
            const tx = await this.contract.transact('executeClause', {
                args: [clauseIdBigInt, proofData]
            });
            
            console.log('✅ Clause executed successfully, tx:', tx.txId);
            
            return {
                txId: tx.txId,
                blockHeight: tx.blockHeight,
                timestamp: new Date()
            };
            
        } catch (error) {
            console.error('❌ Failed to execute clause:', error);
            throw new Error(`Failed to execute clause: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async cancelPrenup(agreementSignature: string): Promise<ContractTransaction> {
        try {
            console.log('🔄 Cancelling prenup...');
            
            if (!agreementSignature || !agreementSignature.trim()) {
                throw new Error('Agreement signature is required');
            }
            
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }
            
            const tx = await this.contract.transact('cancelPrenup', {
                args: [agreementSignature]
            });
            
            console.log('✅ Prenup cancelled successfully, tx:', tx.txId);
            
            return {
                txId: tx.txId,
                blockHeight: tx.blockHeight,
                timestamp: new Date()
            };
            
        } catch (error) {
            console.error('❌ Failed to cancel prenup:', error);
            throw new Error(`Failed to cancel prenup: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async getClauseStatus(clauseId: number | bigint): Promise<boolean> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }
            
            const clauseIdBigInt = typeof clauseId === 'bigint' ? clauseId : BigInt(clauseId);
            const status = await this.contract.query('clauseStatus', clauseIdBigInt);
            return status || false;
        } catch (error) {
            console.error('❌ Failed to get clause status:', error);
            return false;
        }
    }

    getAddress(): string {
        return this.address;
    }

    getCachedState(): PrenupState | null {
        return this.cachedState;
    }

    async refreshState(): Promise<PrenupState> {
        return await this.getState();
    }
}