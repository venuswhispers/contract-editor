"use client"
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import { useRouter } from 'next/navigation'

const Header = () => {

  const router = useRouter ()
  return (
    <div className="py-10 flex justify-between px-20">
      <div className='flex gap-5 text-white'>
        <button onClick={() => router.push('/vaults')}>vaults</button>
        <button>contracts</button>
      </div>
      <ConnectButton />
    </div>
  )
}

export default Header
