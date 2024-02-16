import React from 'react'
import SearchInput from './SearchInput'

const Navbar = () => {
  return (
    <div className='flex items-center gap-x-4 p-5'>
      <div className='hidden lg:flex lg:flex-1'>
        <SearchInput />
      </div>
    </div>
  )
}

export default Navbar