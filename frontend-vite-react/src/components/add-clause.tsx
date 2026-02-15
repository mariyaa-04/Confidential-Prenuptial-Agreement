import React, { useState } from 'react';
import { PrenupContract } from '../modules/midnight/prenup';

interface Props {
    contract: PrenupContract | null;
    contractAddress: string;
    walletAddress: string;
    isPartyA: boolean;
    isPartyB: boolean;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const AddClause: React.FC<Props> = ({
    contract,
    isPartyA,
    isPartyB,
    setLoading,
    setError
}) => {
    const [clauseId, setClauseId] = useState('');
    const [conditionType, setConditionType] = useState<'TimeBased' | 'CourtVerified' | 'BothPartiesAgree'>('TimeBased');
    const [conditionText, setConditionText] = useState('');
    const [assetType, setAssetType] = useState('ETH');
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');

    const handleAddClause = async () => {
        if (!isPartyA && !isPartyB) {
            setError('Only parties to the agreement can add clauses');
            return;
        }

        if (!contract) {
            setError('Contract not initialized');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await contract.addClause(
                BigInt(clauseId),
                conditionType,
                conditionText,
                assetType,
                recipient,
                BigInt(amount)
            );
            
            // Reset form
            setClauseId('');
            setConditionText('');
            setRecipient('');
            setAmount('');
            
            alert('✅ Clause added successfully! (It remains private)');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isPartyA && !isPartyB) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100 opacity-75">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">🔒</span>
                    Add Confidential Clause
                </h2>
                <p className="text-gray-500 text-center py-4">
                    Only parties to the agreement can add clauses
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">📝</span>
                Add Confidential Clause
            </h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Clause ID
                    </label>
                    <input
                        type="number"
                        value={clauseId}
                        onChange={(e) => setClauseId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="1"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Condition Type
                    </label>
                    <select
                        value={conditionType}
                        onChange={(e) => setConditionType(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="TimeBased">⏰ Time-Based</option>
                        <option value="CourtVerified">⚖️ Court-Verified</option>
                        <option value="BothPartiesAgree">🤝 Both Parties Agree</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Condition (Private - will be hashed)
                    </label>
                    <textarea
                        value={conditionText}
                        onChange={(e) => setConditionText(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., If married for 5 years, transfer 10 ETH to Party B..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Asset Type
                        </label>
                        <select
                            value={assetType}
                            onChange={(e) => setAssetType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="ETH">Ξ ETH</option>
                            <option value="BTC">₿ BTC</option>
                            <option value="Property">🏠 Property</option>
                            <option value="Shares">📊 Shares</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                        </label>
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="10"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recipient Address
                    </label>
                    <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0x..."
                    />
                </div>

                <button
                    onClick={handleAddClause}
                    disabled={!clauseId || !conditionText || !recipient || !amount}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add Private Clause
                </button>

                <p className="text-xs text-gray-500 text-center flex items-center justify-center">
                    <span className="mr-1">🔒</span> Clause is encrypted and stored privately on Midnight
                </p>
            </div>
        </div>
    );
};