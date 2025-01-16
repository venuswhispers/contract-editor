'use client'
import { Button, Input } from '@nextui-org/react'
import React from 'react'
import useActiveWeb3 from '@/hooks/useActiveWeb3'
import { useSearchParams } from 'next/navigation'
import TOKEN_ABI from '@/constants/abis/token.json'
import useAsyncEffect from 'use-async-effect'
import { Contract } from 'ethers'

import useNotification from '@/hooks/useNotification'
import { isAddress } from 'ethers/lib/utils'
import { formatUnits, parseEther, parseUnits } from 'viem'

const Page: React.FC = () => {
  const { address, chainId, signer } = useActiveWeb3()
  const searchParams = useSearchParams()
  const token = searchParams.get('address')

  const { showNotification } = useNotification()

  const [values, setValues] = React.useState<Record<string, any>>({})

  const [newAmin, setNewAdmin] = React.useState<string>("");

  const [toAddress, setToAddress] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [burnAmount, setBurnAmount] = React.useState<string>("");
  const [balance, setBalance] = React.useState<number>(0);

  useAsyncEffect(async () => {
    if (!address || !chainId || !signer || !token) return

    const contract = new Contract(token, TOKEN_ABI, signer)
    const [
      name,
      symbol,
      decimals,
      owner
    ] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.owner()
    ])

    console.log(
      name,
      symbol,
      decimals,
      owner
    )
    setValues({ name, symbol, decimals, owner })

    const balance = await contract.balanceOf(address)
    console.log(balance)
    setBalance(Number(formatUnits(balance, decimals)))
  }, [address, chainId, signer, token])

  const grantAdmin = async () => {
    if (!address || !chainId || !signer || !token) {
      showNotification("Please connect your wallet first", "warning")
      return
    }

    if (!isAddress(newAmin)) {
      showNotification("Invalid new amdin address", "warning")
      return
    }

    const contract = new Contract(token, TOKEN_ABI, signer)
    const tx = await contract.grantAdmin(newAmin)

    await tx.wait()
    console.log("::granted admin", tx.hash)
    showNotification("Successfully executed", "success")

  }

  const mintToken = async () => {
    try {
      if (!address || !chainId || !signer || !token) {
        showNotification("Please connect your wallet first", "warning")
        return
      }

      if (!isAddress(toAddress)) {
        showNotification("Invalid new amdin address", "warning")
        return
      }

      if (isNaN(Number(amount)) || !amount) {
        showNotification("Invalid token amount", "warning")
        return
      }

      const contract = new Contract(token, TOKEN_ABI, signer)
      const tx = await contract.bridgeMint(parseUnits(burnAmount, values?.decimals))

      await tx.wait()
      console.log("::minted token", tx.hash)
      showNotification("Successfully executed", "success")
    } catch (err) {
      showNotification(String(err), "warning")
    }
  }

  const burnToken = async () => {
    try {
      if (!address || !chainId || !signer || !token) {
        showNotification("Please connect your wallet first", "warning")
        return
      }

      if (isNaN(Number(burnAmount)) || !burnAmount) {
        showNotification("Invalid token to burn amount", "warning")
        return
      }

      if (Number(burnAmount) > Number(balance)) {
        showNotification("Insufficient token amount to burn", "warning");
        return
      }

      const contract = new Contract(token, TOKEN_ABI, signer)
      const tx = await contract.burn(address, parseUnits(burnAmount, values?.decimals))

      await tx.wait()
      console.log("::burned token", tx.hash)
      showNotification("Successfully executed", "success")
    } catch (err) {
      showNotification(String(err), "warning")
    }

  }

  return (
    <div className="text-white px-20 py-20">
      {
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

      <div className='mt-10'>
        <Input
          key={'admin'}
          type=""
          value={newAmin}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAdmin(e.target.value)}
          label={'Grant Admin'}
          labelPlacement={'outside'}
          placeholder="Enter address to ownership"
        />
        <Button color='primary' className='w-full mt-1' onClick={grantAdmin}>Grant</Button>
      </div>
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
      </div>
    </div>
  )
}

export default Page
