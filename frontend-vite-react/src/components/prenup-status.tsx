import React, { useState, useEffect } from 'react';
import { PrenupContract } from '../modules/midnight/prenup';
import { PrenupState } from '../lib/prenup';

interface Props {
    contract: PrenupContract | null;
    contractAddress: string;
}

export const PrenupStatus: React.FC<Props> = ({ contract, contractAddress }) => {
    const [state, setState] = useState<PrenupState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchState = async () => {
            if (!contract) return;
            
            try {
                setLoading(true);
                const contractState = await contract.getState();
                setState(contractState);
                setError(null);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchState();
        // Refresh every 15 seconds
        const interval = setInterval(fetchState, 15000);
        return () => clearInterval(interval);
    }, [contract, contractAddress]);

    if (loading && !state) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-purple-200 rounded w-3/4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-purple-100 rounded"></div>
                            <div className="h-4 bg-purple-100 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
                <p className="text-red-600 text-center">Error loading status: {error}</p>
            </div>
        );
    }

    if (!state) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                <p className="text-gray-500 text-center">No contract state available</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">📊</span>
                Contract Status
            </h2>
            
            <div className="space-y-4">
                {/* Status Badge */}
                <div className="flex justify-between items-center border-b border-purple-100 pb-3">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        state.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                    }`}>
                        {state.isActive ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                </div>

                {/* Marriage Date */}
                <div className="flex justify-between items-center border-b border-purple-100 pb-3">
                    <span className="text-gray-600">Marriage Date</span>
                    <span className="font-mono text-sm bg-purple-50 px-3 py-1 rounded-lg">
                        {state.marriageDate.toLocaleDateString()}
                    </span>
                </div>

                {/* Commitment Root */}
                <div className="border-b border-purple-100 pb-3">
                    <span className="text-gray-600 block mb-1">Commitment Root</span>
                    <span className="font-mono text-xs bg-gray-50 p-2 rounded-lg block truncate">
                        {state.commitmentRoot}
                    </span>
                </div>

                {/* Parties */}
                <div>
                    <span className="text-gray-600 block mb-2">Parties</span>
                    <div className="space-y-2">
                        <div className="flex items-center p-2 bg-purple-50 rounded-lg">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                            <span className="text-xs font-mono flex-1 truncate">{state.partyA}</span>
                            <span className="text-xs bg-purple-200 px-2 py-1 rounded-full">Party A</span>
                        </div>
                        <div className="flex items-center p-2 bg-pink-50 rounded-lg">
                            <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                            <span className="text-xs font-mono flex-1 truncate">{state.partyB}</span>
                            <span className="text-xs bg-pink-200 px-2 py-1 rounded-full">Party B</span>
                        </div>
                    </div>
                </div>

                {/* Contract Address */}
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <span className="text-sm text-gray-600 block mb-1">Contract Address</span>
                    <span className="font-mono text-xs break-all">{contractAddress}</span>
                </div>

                {/* Privacy Note */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700 flex items-center">
                        <span className="mr-1">🔒</span>
                        All clauses are encrypted and stored privately. Only parties can view them.
                    </p>
                </div>
            </div>
        </div>
    );
};