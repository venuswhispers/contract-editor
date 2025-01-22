'use client'
import { Button, Input } from '@nextui-org/react'
import React from 'react'
import useActiveWeb3 from '@/hooks/useActiveWeb3'
import { useSearchParams } from 'next/navigation'
import TOKEN_ABI from '@/constants/abis/token.json'
import useAsyncEffect from 'use-async-effect'
import { Contract } from 'ethers'
import axios from 'axios'

import useNotification from '@/hooks/useNotification'
import { isAddress } from 'ethers/lib/utils'
import { formatUnits, parseEther, parseUnits } from 'viem'
import { useServerAPI } from '@/hooks/useServerAPI'

const Page: React.FC = () => {
  const { address, chainId, signer } = useActiveWeb3()
  const searchParams = useSearchParams()
  const swapId = searchParams.get('swapId')
  const { serverAPI } = useServerAPI()

  const { showNotification } = useNotification()

  const [values, setValues] = React.useState<Record<string, any>>({})

  const [newAmin, setNewAdmin] = React.useState<string>("");

  const [toAddress, setToAddress] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [burnAmount, setBurnAmount] = React.useState<string>("");
  const [balance, setBalance] = React.useState<number>(0);

  const [fromNetwork, setFromNetwork] = React.useState<string>("");
  const [fromToken, setFromToken] = React.useState<string>("");
  const [toNetwork, setToNetwork] = React.useState<string>("");
  const [toToken, setToToken] = React.useState<string>("")

  const [depositTransaction, setDepositTransaction] = React.useState<string>("");

  useAsyncEffect(async () => {
    try {
      const { data: { data } } = await serverAPI.get(`/api/swaps/${swapId}?version=${process.env.NEXT_PUBLIC_API_VERSION}`)
      console.log(data)
      setFromNetwork(data.source_network)
      setFromToken(data.source_asset)
      setToNetwork(data.destination_network)
      setToToken(data.destination_asset)
      setAmount(data.requested_amount)
    } catch (err) {

    }
  }, [])

  const handleDepositAction = async () => {
    await serverAPI.post(`/api/swaps/transfer/${swapId}`, {
      txHash: depositTransaction,
      amount: amount,
      from: 'lux team',
      to: 'lux team',
    })
    showNotification("success", 'info')
  }


  return (
    <div className="text-white px-20 py-20">
      <h1>{swapId}</h1>
      <div className='mt-10'>
        <span>From: {fromNetwork}</span> - <span>{fromToken}</span>
      </div>
      <div className=''>
        <span>To: {toNetwork}</span> - <span>{toToken}</span>
      </div>
      <div className=''>
        <span>Amount: {amount}</span>
      </div>

      <div className='mt-20'>
        <Input
          key={'deposit action'}
          type=""
          value={depositTransaction}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDepositTransaction(e.target.value)}
          label={'Deposit Transaction'}
          labelPlacement={'outside'}
          placeholder="Enter deposit transaction hash"
        />
        <Button color='primary' className='w-full mt-1' onClick={handleDepositAction}>Add</Button>
      </div>
      {/* {
        Object.entries(values).map(([key, value]) => (
          <div className='pt-5' key={key}>
            <Input
              key={key}
              type=""
              value={value}
              label={key}
              labelPlacement={'outside'}
              placeholder="Enter your email"
            />
          </div>
        ))
      }

      
      <div>
        <div className='mt-10'>
          <Input
            key={'admin'}
            type=""
            value={toAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToAddress(e.target.value)}
            label={'Mint token'}
            labelPlacement={'outside'}
            placeholder="Enter address to mint token"
          />
        </div>
        <div className='mt-1'>
          <Input
            key={'admin'}
            type=""
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            placeholder="Enter token amount"
          />
        </div>
        <Button color='primary' className='w-full mt-1' onClick={mintToken}>MINT</Button>
      </div>
      <div>
        <div className='mt-1'>
          <div className='mt-10'>
            <Input
              key={'admin'}
              type=""
              value={burnAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBurnAmount(e.target.value)}
              label={`Burn token (${balance}) ${values?.symbol}`}
              labelPlacement={'outside'}
              placeholder="Enter address to burn token"
            />
          </div>
        </div>
        <Button color='primary' className='w-full mt-1' onClick={burnToken}>BURN</Button>
      </div> */}
    </div>
  )
}

export default Page
