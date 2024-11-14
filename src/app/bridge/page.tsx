'use client'
import { Button, Input } from '@nextui-org/react'
import React from 'react'
import useActiveWeb3 from '@/hooks/useActiveWeb3'
import { useSearchParams } from 'next/navigation'
import BRIDGE_ABI from '@/constants/abis/bridge.json'
import useAsyncEffect from 'use-async-effect'
import { Contract, ethers, providers, utils } from 'ethers'

import useNotification from '@/hooks/useNotification'
import { isAddress } from 'ethers/lib/utils'
import { parseEther } from 'viem'

const Page: React.FC = () => {
  const { address, chainId, signer } = useActiveWeb3()
  const searchParams = useSearchParams()
  const token = searchParams.get('address')

  const {showNotification} = useNotification()

  const [values, setValues] = React.useState<Record<string, any>>({})

  const [vault, setVault] = React.useState<string>("");
  const [tokenAddress, setTokenAddress] = React.useState<string>("");
  const [toAddress, setToAddress] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [mpc, setMPC] = React.useState<string>("");


  const [mpcForTest, setMpcForTest] = React.useState<string>("");

  useAsyncEffect(async () => {
    if (!address || !chainId || !signer || !token) return

    const contract = new Contract(token, BRIDGE_ABI, signer)
    const [
      vault,
    ] = await Promise.all([
      contract.vault(),
    ])

    console.log(
      vault,
    )
    setValues({vault})
  }, [address, chainId, signer, token])

  const handleSetVault = async () => {
    if (!address || !chainId || !signer || !token) {
      showNotification("Please connect your wallet first", "warning")
      return
    }

    if (!isAddress(vault)) {
      showNotification("Invalid ETH address", "warning")
      return
    }

    const contract = new Contract(token, BRIDGE_ABI, signer)
    const tx = await contract.setVault(vault)
    
    await tx.wait()
    console.log("::granted admin", tx.hash)
    showNotification("Successfully set new vault", "success")
  }

  const handleSetMPC = async () => {
    if (!address || !chainId || !signer || !token) {
      showNotification("Please connect your wallet first", "warning")
      return
    }

    if (!isAddress(mpc)) {
      showNotification("Invalid ETH address", "warning")
      return
    }

    const contract = new Contract(token, BRIDGE_ABI, signer)
    const tx = await contract.setMPCOracle(mpc)
    
    await tx.wait()
    console.log("::granted admin", tx.hash)
    showNotification("Successfully set new vault", "success")
  }

  const testMPC = async () => {
    if (!address || !chainId || !signer || !token) {
      showNotification("Please connect your wallet first", "warning")
      return
    }
    if (!isAddress(mpcForTest)) {
      showNotification("Invalid ETH address", "warning")
      return
    }
    const contract = new Contract(token, BRIDGE_ABI, signer)
    const value = await contract.getMPCMapDataTx(mpc)
    showNotification("MPC orale is >>>>" + value, "success")
  }

  const previewWithdraw = async () => {
    if (!address || !chainId || !signer || !token) {
      showNotification("Please connect your wallet first", "warning")
      return
    }
    if (!isAddress(tokenAddress)) {
      showNotification("Invalid tokenAddress address", "warning")
      return
    }
    const contract = new Contract(token, BRIDGE_ABI, signer)
    const value = await contract.previewVaultWithdraw(tokenAddress)
    showNotification("amount is >>>>" + value, "success")
  }

  const pullWithdraw = async () => {
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

    // const contract = new Contract(token, BRIDGE_ABI, signer)
    // const tx = await contract.bridgeMint(toAddress, parseEther(amount))
    
    // await tx.wait()
    // console.log("::minted token", tx.hash)
    // showNotification("Successfully executed", "success")

  }

  return (
    <div className="text-white px-20 py-20">
      {
        Object.entries(values).map(([key, value]) => (
          <div className='pt-5'>
            <Input
              disabled={true}
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

      {/* <div className='mt-10'>
        <Input
          type=""
          value={tokenAddress}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTokenAddress(e.target.value)}
          label={'previewVaultWithdraw'}
          labelPlacement={'outside'}
          placeholder="enter token address"
        />
        <Button color='primary' className='w-full mt-1' onClick={previewWithdraw}>Preview withdraw</Button>
      </div> */}
      <div className='mt-10'>
        <Input
          type=""
          value={mpcForTest}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMpcForTest(e.target.value)}
          label={'Test MPC oracle'}
          labelPlacement={'outside'}
          placeholder="Enter mpc address"
        />
        <Button color='primary' className='w-full mt-1' onClick={testMPC}>test mpc</Button>
      </div>

      <div className='mt-40'>
        <Input
          type=""
          value={vault}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVault(e.target.value)}
          label={'Set Vault'}
          labelPlacement={'outside'}
          placeholder="Enter vault address"
        />
        <Button color='primary' className='w-full mt-1' onClick={handleSetVault}>Set Vault</Button>
      </div>
      <div className='mt-10'>
        <Input
          type=""
          value={mpc}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMPC(e.target.value)}
          label={'Set MPC'}
          labelPlacement={'outside'}
          placeholder="Enter mpc address"
        />
        <Button color='primary' className='w-full mt-1' onClick={handleSetMPC}>Set MPC</Button>
      </div>
      <div>
        <div className='mt-10'>
          <Input
            type=""
            value={toAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToAddress(e.target.value)}
            label={'pullWithdraw'}
            labelPlacement={'outside'}
            placeholder="Enter address to send token"
          />
        </div>
        <div className='mt-1'>
          <Input
            type=""
            value={tokenAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTokenAddress(e.target.value)}
            placeholder="Enter token address"
          />
        </div>
        <div className='mt-1'>
          <Input
            type=""
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            placeholder="Enter token amount"
          />
        </div>
        <Button color='primary' className='w-full mt-1' onClick={pullWithdraw}>pullWithdraw</Button>
      </div>
    </div>
  )
}

export default Page
