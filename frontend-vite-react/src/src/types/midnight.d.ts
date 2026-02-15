// src/types/midnight.d.ts
declare module '@midnight-ntwrk/wallet' {
    export interface Wallet {
        create(config: { network: string }): Promise<any>;
        getAddresses(): Promise<string[]>;
        getBalance(): Promise<bigint>;
        signMessage(message: string): Promise<string>;
    }
}

declare module '@midnight-ntwrk/dapp-connector-api' {
    export interface DAppConnector {
        new(config: { wallet: any; appName: string; version: string }): any;
    }
}

// Add to window for mock wallet
interface Window {
    midnightWallet?: any;
}