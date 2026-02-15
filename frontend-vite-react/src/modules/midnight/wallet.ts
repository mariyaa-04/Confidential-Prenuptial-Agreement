import { PrenupContract } from './prenup';

// Define interfaces for wallet and connector
interface WalletInstance {
    getAddresses(): Promise<string[]>;
    getBalance(): Promise<bigint>;
    signMessage(message: string): Promise<string>;
}

interface ConnectorInstance {
    connectContract(params: { address: string }): Promise<any>;
    deployContract(params: { constructorArgs: any[] }): Promise<{ address: string }>;
}

export class WalletManager {
    private wallet: WalletInstance | null = null;
    private address: string | null = null;
    private connector: ConnectorInstance | null = null;

    async connect(): Promise<string> {
        console.log('🔄 Connecting to Midnight wallet...');
        
        try {
            // ALWAYS use mock for development
            console.log('🧪 Using mock wallet (development mode)');
            
            // Create mock wallet
            this.wallet = {
                getAddresses: async () => {
                    console.log('📋 Mock: Getting addresses');
                    return ['0x' + '1'.repeat(40)];
                },
                getBalance: async () => {
                    console.log('💰 Mock: Getting balance');
                    return BigInt(1000000000000000000); // 1 ETH in wei
                },
                signMessage: async (message: string) => {
                    console.log('✍️ Mock: Signing message:', message);
                    return '0x' + '2'.repeat(130);
                }
            };

            // Get mock address
            const addresses = await this.wallet.getAddresses();
            this.address = addresses[0];
            
            // Create mock connector
            this.connector = {
                connectContract: async ({ address }: { address: string }) => {
                    console.log('📄 Mock connecting to contract:', address);
                    return {
                        query: async (field: string) => {
                            console.log('📊 Mock query:', field);
                            // Return mock data based on field
                            if (field === 'partyA') return this.address;
                            if (field === 'partyB') return '0x' + '5'.repeat(40);
                            if (field === 'isActive') return true;
                            if (field === 'marriageDate') return new Date().toISOString();
                            if (field === 'prenupCommitment') return '0x' + '6'.repeat(64);
                            return null;
                        },
                        transact: async (method: string, options: any) => {
                            console.log('📝 Mock transaction:', method, options);
                            return { 
                                txId: '0x' + '3'.repeat(64),
                                blockHeight: 12345,
                                timestamp: new Date()
                            };
                        }
                    };
                },
                deployContract: async ({ constructorArgs }: { constructorArgs: any[] }) => {
                    console.log('🚀 Mock deploying contract with args:', constructorArgs);
                    const address = '0x' + '4'.repeat(40);
                    console.log('✅ Mock contract deployed at:', address);
                    return { address };
                }
            };
            
            console.log('✅ Mock wallet connected successfully!');
            console.log('📫 Wallet address:', this.address);
            return this.address;
            
        } catch (error) {
            console.error('❌ Failed to connect wallet:', error);
            throw error;
        }
    }

    async connectToContract(contractAddress: string): Promise<PrenupContract> {
        console.log('📄 Connecting to contract at:', contractAddress);
        
        if (!this.wallet) throw new Error('Wallet not connected');
        if (!this.connector) throw new Error('Connector not initialized');
        
        try {
            const contract = await this.connector.connectContract({
                address: contractAddress
            });
            
            console.log('✅ Contract connected successfully');
            return new PrenupContract(contract, contractAddress);
            
        } catch (error) {
            console.error('❌ Failed to connect to contract:', error);
            throw error;
        }
    }

    async deployContract(commitmentHash: string, partyA: string, partyB: string): Promise<string> {
        console.log('🚀 Deploying new prenup contract...');
        console.log('📝 Party A:', partyA);
        console.log('📝 Party B:', partyB);
        console.log('🔑 Commitment hash:', commitmentHash.substring(0, 20) + '...');
        
        if (!this.wallet) throw new Error('Wallet not connected');
        if (!this.connector) throw new Error('Connector not initialized');
        
        try {
            const deployment = await this.connector.deployContract({
                constructorArgs: [commitmentHash, partyA, partyB]
            });
            
            console.log('✅ Contract deployed successfully at:', deployment.address);
            return deployment.address;
            
        } catch (error) {
            console.error('❌ Failed to deploy contract:', error);
            throw error;
        }
    }

    async getBalance(): Promise<bigint> {
        if (!this.wallet) throw new Error('Wallet not connected');
        return await this.wallet.getBalance();
    }

    async signMessage(message: string): Promise<string> {
        if (!this.wallet) throw new Error('Wallet not connected');
        return await this.wallet.signMessage(message);
    }

    getAddress(): string {
        if (!this.address) throw new Error('Wallet not connected');
        return this.address;
    }

    isConnected(): boolean {
        return !!this.address && !!this.wallet && !!this.connector;
    }

    disconnect(): void {
        this.wallet = null;
        this.address = null;
        this.connector = null;
        console.log('👋 Wallet disconnected');
    }
}

// Single instance export
export const walletManager = new WalletManager();