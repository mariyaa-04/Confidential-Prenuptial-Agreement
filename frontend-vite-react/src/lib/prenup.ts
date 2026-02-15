export interface Clause {
    clauseId: bigint;
    conditionType: 'TimeBased' | 'CourtVerified' | 'BothPartiesAgree';
    conditionHash: string;
    action: {
        assetType: string;
        fromParty: string;
        toParty: string;
        amount: bigint;
    };
    isExecuted: boolean;
}

export interface PrenupState {
    commitmentRoot: string;
    partyA: string;
    partyB: string;
    isActive: boolean;
    marriageDate: Date;
}

export interface ContractDeployment {
    address: string;
    transactionHash: string;
    blockHeight?: number;
    timestamp: Date;
}

export interface ContractTransaction {
    txId: string;
    blockHeight?: number;
    timestamp?: Date;
    success?: boolean;
    error?: string;
}

export interface ClauseExecutionProof {
    type: 'date' | 'signature' | 'court';
    data: string;
    timestamp: Date;
    signature?: string;
}

export type ConditionType = 'TimeBased' | 'CourtVerified' | 'BothPartiesAgree';
export type AssetType = 'ETH' | 'BTC' | 'Property' | 'Shares' | 'Custom';