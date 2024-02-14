import React, { useEffect } from 'react'

const Loader = () => {
  return (
    <div className='min-h-screen w-full flex flex-col justify-center items-center'>
      <img src="/images/real-time-collab-1.png" alt="logo" width={120} height={120} className='animate-pulse duration-700' />
    </div>
  )
}

export default Loader;