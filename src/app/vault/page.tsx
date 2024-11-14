'use client'
import { Button, Input } from '@nextui-org/react'
import React from 'react'
import useActiveWeb3 from '@/hooks/useActiveWeb3'
import { useSearchParams } from 'next/navigation'
import VAULT_ABI from '@/constants/abis/vault.json'
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
  const [owner, setOwner] = React.useState<string>("");


  const [mpcForTest, setMpcForTest] = React.useState<string>("");

  useAsyncEffect(async () => {
    if (!address || !chainId || !signer || !token) return

    const contract = new Contract(token, VAULT_ABI, signer)
    const [
      owner,
      totalVaultLength
    ] = await Promise.all([
      contract.owner(),
      contract.totalVaultLength()
    ])

    console.log(
      owner,
      totalVaultLength
    )
    setValues({owner, totalVaultLength})
  }, [address, chainId, signer, token])

  const handleTransferOwnership = async () => {
    if (!address || !chainId || !signer || !token) {
      showNotification("Please connect your wallet first", "warning")
      return
    }

    if (!isAddress(owner)) {
      showNotification("Invalid owner address", "warning")
      return
    }

    const contract = new Contract(token, VAULT_ABI, signer)
    const tx = await contract.transferOwnership(owner)
    
    await tx.wait()
    console.log("::granted admin", tx.hash)
    showNotification("Successfully set new owner", "success")
  }

  

  return (
    <div className="text-white px-20 py-20">
      {
        Object.entries(values).map(([key, value]) => (
          <div className='pt-5' key={key}>
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

    

      <div className='mt-40'>
        <Input
          type=""
          value={owner}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOwner(e.target.value)}
          label={'Transfer Ownership'}
          labelPlacement={'outside'}
          placeholder="Enter owner address"
        />
        <Button color='primary' className='w-full mt-1' onClick={handleTransferOwnership}>Transfer</Button>
      </div>
    </div>
  )
}

export default Page
