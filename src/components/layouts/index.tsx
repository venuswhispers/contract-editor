import React from 'react'
import Header from './header'

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='max-w-[1500px] m-auto'>
      <Header/>
      {children}
    </div>
  )
}

export default Layout
