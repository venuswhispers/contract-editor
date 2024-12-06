export type ACCOUNT = {
    address: string;
    balanceDecimals?: number;
    balanceFormatted?: string;
    balanceSymbol?: string;
    displayBalance?: string;
    displayName: string;
    ensAvatar?: string;
    ensName?: string;
    hasPendingTransactions: boolean;
};
export type RAINBOW_CHAIN = {
    hasIcon: boolean;
    iconUrl?: string;
    iconBackground?: string;
    id: number;
    name?: string;
    unsupported?: boolean;
};

export type CHAIN = {
    name: string,
    symbol: string,
    ticker: string,
    rpc: string,
    chainId: number,
    explorer: string,
    logo: string,
    istestnet?: boolean
}

export enum NetworkType {
    EVM = "evm",
    Starknet = "starknet",
    Solana = "solana",
    Cosmos = "cosmos",
    StarkEx = "stark_ex",
    ZkSyncLite = "zk_sync_lite",
    TON = "ton",
    Bitocoin = "btc",
    Cardano = "cardano",
}

export type CryptoNetwork = {
    display_name: string
    internal_name: string
    logo?: string
    is_testnet: boolean
    is_featured: boolean
    chain_id: string | null | undefined
    status: 'active' | 'inactive'
    type: NetworkType
    transaction_explorer_template: string
    account_explorer_template: string
    currencies: NetworkCurrency[]
    metadata: Metadata | null | undefined
    managed_accounts: string[]
    nodes: string[]
    // managed_accounts: ManagedAccount[]
    // nodes: NetworkNode[]
}

export type NetworkCurrency = {
    name: string
    asset: string
    logo: string
    contract_address: string | null | undefined
    decimals: number
    status: string
    is_deposit_enabled: boolean
    is_withdrawal_enabled: boolean
    is_refuel_enabled: boolean
    precision: number
    price_in_usd: number
    is_native: boolean
}