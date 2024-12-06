import {
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  trustWallet,
  ledgerWallet,
  phantomWallet,
  okxWallet,
} from '@rainbow-me/rainbowkit/wallets'

import mainnets from '@/constants/settings/mainnet.json'

import { getDefaultWallets, getDefaultConfig, Chain } from '@rainbow-me/rainbowkit'

import { Config } from 'wagmi'
import resolveChain from '@/libs/resolveChain'
import { CryptoNetwork } from '@/types'

//@ts-ignore
const chains = (mainnets as CryptoNetwork[])
.filter((n) => n.type === 'evm')
.sort((a, b) => Number(a.chain_id) - Number(b.chain_id))
.map(resolveChain)



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
