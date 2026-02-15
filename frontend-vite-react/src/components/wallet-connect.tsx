import React from 'react';

interface Props {
    onConnect: () => void;
    walletAddress: string;
    isConnected: boolean;
}

export const WalletConnect: React.FC<Props> = ({ onConnect, walletAddress, isConnected }) => {
    if (isConnected) {
        return (
            <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-mono text-gray-700">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={onConnect}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105"
        >
            Connect Wallet
        </button>
    );
};