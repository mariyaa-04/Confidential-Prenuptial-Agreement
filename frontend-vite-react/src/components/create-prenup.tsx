import React, { useState } from 'react';
import { sha256 } from '@noble/hashes/sha256';
import { walletManager } from '../modules/midnight/wallet';

interface Props {
    walletAddress: string;
    onDeploy: (address: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const CreatePrenup: React.FC<Props> = ({ walletAddress, onDeploy, setLoading, setError }) => {
    const [partyA, setPartyA] = useState(walletAddress);
    const [partyB, setPartyB] = useState('');
    const [agreementText, setAgreementText] = useState('');

    const handleCreate = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const commitmentHash = '0x' + Buffer.from(sha256(agreementText)).toString('hex');
            const address = await walletManager.deployContract(commitmentHash, partyA, partyB);
            onDeploy(address);
            alert('✅ Prenup created successfully! Contract address: ' + address);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">📝</span>
                Create New Prenup
            </h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Party A Address
                    </label>
                    <input
                        type="text"
                        value={partyA}
                        onChange={(e) => setPartyA(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0x..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Party B Address
                    </label>
                    <input
                        type="text"
                        value={partyB}
                        onChange={(e) => setPartyB(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0x..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Agreement Text (will be hashed, never stored)
                    </label>
                    <textarea
                        value={agreementText}
                        onChange={(e) => setAgreementText(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your prenuptial agreement terms..."
                    />
                </div>

                <button
                    onClick={handleCreate}
                    disabled={!partyA || !partyB || !agreementText}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Create Confidential Prenup
                </button>

                <p className="text-xs text-gray-500 text-center">
                    🔒 Agreement is hashed and never stored in plain text
                </p>
            </div>
        </div>
    );
};