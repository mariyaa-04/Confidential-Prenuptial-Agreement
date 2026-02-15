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

export const ExecuteClause: React.FC<Props> = ({
    contract,
    isPartyA,
    isPartyB,
    setLoading,
    setError
}) => {
    const [clauseId, setClauseId] = useState('');
    const [proofData, setProofData] = useState('');
    const [proofType, setProofType] = useState('date');

    const getProofPlaceholder = () => {
        switch(proofType) {
            case 'date': return '2026-02-15';
            case 'signature': return '0x... (signature)';
            case 'court': return 'Court case #12345';
            default: return 'Proof data';
        }
    };

    const handleExecute = async () => {
        if (!isPartyA && !isPartyB) {
            setError('Only parties can execute clauses');
            return;
        }

        if (!contract) {
            setError('Contract not initialized');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await contract.executeClause(BigInt(clauseId), proofData);
            alert('✅ Clause executed successfully!');
            setClauseId('');
            setProofData('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">⚡</span>
                Execute Clause
            </h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Clause ID to Execute
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
                        Proof Type
                    </label>
                    <select
                        value={proofType}
                        onChange={(e) => setProofType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="date">📅 Date</option>
                        <option value="signature">✍️ Signature</option>
                        <option value="court">⚖️ Court Document</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Proof Data
                    </label>
                    <input
                        type="text"
                        value={proofData}
                        onChange={(e) => setProofData(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={getProofPlaceholder()}
                    />
                </div>

                <button
                    onClick={handleExecute}
                    disabled={!clauseId || !proofData}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Execute Clause
                </button>

                <p className="text-xs text-gray-500 text-center">
                    ⚡ Clause will execute automatically if conditions are met
                </p>
            </div>
        </div>
    );
};