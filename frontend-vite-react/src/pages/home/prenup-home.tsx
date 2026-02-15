import React, { useState, useEffect, useRef } from 'react';
import { walletManager } from '../../modules/midnight/wallet';
import { PrenupContract } from '../../modules/midnight/prenup';
import { WalletConnect } from '../../components/wallet-connect';
import { CreatePrenup } from '../../components/create-prenup';
import { AddClause } from '../../components/add-clause';
import { ExecuteClause } from '../../components/execute-clause';
import { PrenupStatus } from '../../components/prenup-status';

export const PrenupHome: React.FC = () => {
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [contract, setContract] = useState<PrenupContract | null>(null);
    const [contractAddress, setContractAddress] = useState<string>(
        import.meta.env?.VITE_CONTRACT_ADDRESS || ''
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isParty, setIsParty] = useState<{a: boolean, b: boolean}>({a: false, b: false});
    
    // Use refs to prevent infinite loops
    const isInitialMount = useRef(true);
    const isCheckingParty = useRef(false);

    // Log render
    console.log('🎨 Rendering PrenupHome - loading:', loading, 'wallet:', !!walletAddress);

    // Separate useEffect for initial contract connection
    useEffect(() => {
        // Skip on initial mount if no contract address
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Only run if we have wallet and contract address but no contract instance
        if (walletAddress && contractAddress && !contract && !isCheckingParty.current) {
            connectToExistingContract();
        }
    }, [walletAddress, contractAddress]);

    const connectToExistingContract = async () => {
        if (isCheckingParty.current) return;
        
        isCheckingParty.current = true;
        console.log('📄 Connecting to existing contract...');
        
        try {
            const prenup = await walletManager.connectToContract(contractAddress);
            setContract(prenup);
            
            // Check party status after connecting
            const state = await prenup.getState();
            setIsParty({
                a: state.partyA.toLowerCase() === walletAddress.toLowerCase(),
                b: state.partyB.toLowerCase() === walletAddress.toLowerCase()
            });
        } catch (err) {
            console.error('❌ Failed to connect to contract:', err);
        } finally {
            isCheckingParty.current = false;
        }
    };

    const handleConnect = async () => {
        console.log('🔌 ===== CONNECT BUTTON CLICKED =====');
        
        setLoading(true);
        setError(null);
        
        try {
            console.log('⏳ Calling walletManager.connect()...');
            const address = await walletManager.connect();
            
            console.log('✅ walletManager.connect() returned:', address);
            setWalletAddress(address);
            
        } catch (err: any) {
            console.error('❌ ERROR in handleConnect:', err);
            
            // FOR DEVELOPMENT: Set mock address even on error
            console.log('🧪 Setting mock wallet for development despite error');
            const mockAddress = '0x' + '1'.repeat(40);
            setWalletAddress(mockAddress);
            setError(err.message || 'Connection failed - using mock mode');
        } finally {
            console.log('✅ FINALLY - setting loading to false');
            setLoading(false);
        }
    };

    const handleDeploy = (address: string) => {
        console.log('🚀 Contract deployed at:', address);
        setContractAddress(address);
        localStorage.setItem('prenup-contract-address', address);
        
        // Connect to the newly deployed contract
        setTimeout(async () => {
            try {
                const prenup = await walletManager.connectToContract(address);
                setContract(prenup);
            } catch (err) {
                console.error('Failed to connect to new contract:', err);
            }
        }, 100);
    };

    // Log what we're rendering
    if (loading) {
        console.log('⏳ Rendering loading spinner...');
    } else if (!walletAddress) {
        console.log('👤 Rendering connect wallet screen...');
    } else {
        console.log('📱 Rendering main app UI...');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-purple-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <span className="text-3xl">💍</span>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
                                Confidential Prenup
                            </h1>
                            <span className="hidden sm:inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                                Midnight Network
                            </span>
                        </div>
                        <WalletConnect 
                            onConnect={handleConnect}
                            walletAddress={walletAddress}
                            isConnected={!!walletAddress}
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fade-in">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <span className="text-red-500 text-xl">⚠️</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-800"></div>
                    </div>
                )}

                {!walletAddress ? (
                    <div className="text-center py-16">
                        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl mx-auto">
                            <div className="text-6xl mb-4">💍</div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                Welcome to Confidential Prenup
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Create and manage your prenuptial agreement privately on the Midnight blockchain.
                                Your terms stay completely confidential while being cryptographically enforceable.
                            </p>
                            <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <span className="block text-2xl mb-1">🔒</span>
                                    Private
                                </div>
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <span className="block text-2xl mb-1">⚡</span>
                                    Auto-execute
                                </div>
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <span className="block text-2xl mb-1">🔗</span>
                                    Immutable
                                </div>
                            </div>
                            <button
                                onClick={handleConnect}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 transform hover:scale-105"
                            >
                                Connect Wallet to Start
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <CreatePrenup 
                                walletAddress={walletAddress}
                                onDeploy={handleDeploy}
                                setLoading={setLoading}
                                setError={setError}
                            />
                            
                            {contractAddress && contract && (
                                <AddClause 
                                    contract={contract}
                                    contractAddress={contractAddress}
                                    walletAddress={walletAddress}
                                    isPartyA={isParty.a}
                                    isPartyB={isParty.b}
                                    setLoading={setLoading}
                                    setError={setError}
                                />
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {contractAddress && contract && (
                                <>
                                    <PrenupStatus 
                                        contract={contract}
                                        contractAddress={contractAddress}
                                    />
                                    
                                    <ExecuteClause 
                                        contract={contract}
                                        contractAddress={contractAddress}
                                        walletAddress={walletAddress}
                                        isPartyA={isParty.a}
                                        isPartyB={isParty.b}
                                        setLoading={setLoading}
                                        setError={setError}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white/80 backdrop-blur-sm border-t border-purple-100 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-gray-500">
                        Built with 💜 on Midnight Network • Your terms stay completely private
                    </p>
                </div>
            </footer>
        </div>
    );
};
