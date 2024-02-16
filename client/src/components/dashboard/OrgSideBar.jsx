import React from 'react'

const OrgSideBar = () => {
  return (
    <div className='hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5'>
      <a href="/">
        <div className='flex items-center gap-x-2'>
          <img src="/images/real-time-collab-1.png" alt="logo" height={60} width={60} />
          <span className='font-semibold text-2xl'>CollabDraw</span>
        </div>
      </a>
    </div>
  )
}

export default OrgSideBar