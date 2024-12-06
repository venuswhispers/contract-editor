'use client'
import { Button, Input } from '@nextui-org/react'
import React from 'react'
import useActiveWeb3 from '@/hooks/useActiveWeb3'
import { useSearchParams } from 'next/navigation'
import VAULT_ABI from '@/constants/abis/vault.json'
import BRIDGE_ABI from '@/constants/abis/bridge.json'
import TOKEN_ABI from '@/constants/abis/token.json'
import useAsyncEffect from 'use-async-effect'
import { Contract, ethers, providers, utils } from 'ethers'

import useNotification from '@/hooks/useNotification'

import { NETWORK, MAIN_NETWORKS as networks } from '@/constants/config'
import { formatUnits, parseUnits, stringToBytes } from 'viem'

type ASSET = { asset: string; name: string; symbol: string; decimals: number, balance: bigint }

const Page: React.FC = () => {
  const { address, chainId, signer } = useActiveWeb3()
  const searchParams = useSearchParams()
  const token = searchParams.get('address')

  const { showNotification } = useNotification()

  const [values, setValues] = React.useState<Record<string, any>>({})
  const [owner, setOwner] = React.useState<string>('')

  const [network, setNetwork] = React.useState<NETWORK>(networks[0])

  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const [tokens, setTokens] = React.useState<ASSET[]>([])

  useAsyncEffect(async () => {
    try {
      setIsLoading(true)
      const provider = new providers.JsonRpcProvider(network.node)
      const vault = new Contract(network.vault, VAULT_ABI, provider)
      const vaultLength = await vault.totalVaultLength()
      const bridge = new Contract(network.teleporter, BRIDGE_ABI, provider)
      let _tokens = await Promise.all(
        Array.from({ length: Number(vaultLength) }, async (_, i: number) => {
          const asset = vault.assets(i)
          const _token = new Contract(asset, TOKEN_ABI, provider)
          const [name, symbol, decimals] = await Promise.all([
            _token.name(),
            _token.symbol(),
            _token.decimals(),
          ])
          return {
            asset,
            name,
            symbol,
            decimals,
          }
        })
      )
      _tokens = [
        {
          symbol: 'ETH',
          name: 'Ethereum',
          decimals: 18,
          asset: '0x0000000000000000000000000000000000000000',
        },
        ..._tokens,
      ]
      setTokens(
        await Promise.all(
          _tokens.map(async (t: any) => ({
            ...t,
            balance: await bridge.previewVaultWithdraw(t.asset),
          }))
        )
      )
    } catch (err) {
      //
    } finally {
      setIsLoading(false)
    }
  }, [network])

  console.log(tokens)

  useAsyncEffect(async () => {
    if (!address || !chainId || !signer || !token) return

    const contract = new Contract(token, VAULT_ABI, signer)
    const [owner, totalVaultLength] = await Promise.all([
      contract.owner(),
      contract.totalVaultLength(),
    ])

    console.log(owner, totalVaultLength)
    setValues({ owner, totalVaultLength })
  }, [address, chainId, signer, token])

  return (
    <div className="flex text-white px-20 py-20">
      <div className="flex flex-col gap-2 w-1/4">
        <h1 className="text-green-700 text-xl font-bold">Networks</h1>
        {networks.map((n: NETWORK) => (
          <div
            key={'vault_' + n.chain_id}
            className={`cursor-pointer hover:opacity-50 ${
              network.chain_id === n.chain_id && 'text-green-700'
            }`}
            onClick={() => setNetwork(n)}
          >
            {n.display_name}
          </div>
        ))}
      </div>

      <div className="flex grow flex-col gap-5">
        <div className="w-full text-center text-green-700 text-xl font-bold">
          {network.display_name}
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {tokens.map((t: ASSET, i: number) => (
              <div className="flex flex-col" key={'balance_' + i}>
                <div>
                  {i + 1}. Symbol: {t.symbol}
                </div>
                <div>Name: {t.name}</div>
                <div>decimals: {t.decimals}</div>
                <div>Address: {t.asset}</div>
                <div className='text-green-600'>Balance: {formatUnits(t.balance, t.decimals)}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default Page
