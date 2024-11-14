import {
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  trustWallet,
  ledgerWallet,
  phantomWallet,
  okxWallet,
} from '@rainbow-me/rainbowkit/wallets'

import { getDefaultWallets, getDefaultConfig, Chain } from '@rainbow-me/rainbowkit'

import { sepolia, arbitrum, bsc, base } from 'wagmi/chains'
import { Config } from 'wagmi'

export const chains = [
  {
    id: 96369,
    name: 'Lux Mainnet',
    nativeCurrency: { name: 'Lux', symbol: 'LUX', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://api.lux.network'] },
    },
    iconUrl: './images/chains/lux.png',
    iconBackground: '#fff',
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://explore.lux.network' },
    },
    contracts: {},
  } as const satisfies Chain,
  {
    id: 96368,
    name: 'Lux Testnet',
    nativeCurrency: { name: 'Test Lux', symbol: 'tLUX', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://api.lux-test.network'] },
    },
    iconUrl: './images/chains/lux.png',
    iconBackground: '#fff',
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://explore.lux-test.network' },
    },
    contracts: {},
  } as const satisfies Chain,
  {
    id: 200200,
    name: 'ZOO Mainnet',
    nativeCurrency: { name: 'ZOO', symbol: 'ZOO', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://api.zoo.network'] },
    },
    iconUrl: './images/chains/lux.png',
    iconBackground: '#fff',
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://zoo.network' },
    },
    contracts: {},
  } as const satisfies Chain,
  {
    id: 200199,
    name: 'ZOO Testnet',
    nativeCurrency: { name: 'Test ZOO', symbol: 'tZOO', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://api.zoo-test.network'] },
    },
    iconUrl: './images/chains/lux.png',
    iconBackground: '#fff',
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://zoo-test.network' },
    },
    contracts: {},
  } as const satisfies Chain,
]



const { wallets } = getDefaultWallets()

export const config: Config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'e89228fed40d4c6e9520912214dfd68b',
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [metaMaskWallet],
    },
  ],
  //@ts-ignore
  chains: chains,
  ssr: true,
})
