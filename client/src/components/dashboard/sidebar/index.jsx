import React from 'react'
import List from './List'
import NewButton from './NewButton'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    // <aside className='fixed z-[1] left-0 bg-blue-950 h-full w-[60px] flex p-3 flex-col gap-y-4 text-white'>
    //     <List />
    //     <NewButton />
    // </aside>
    <div className="w-64 bg-gray-800 text-white">
    {/* Logo and Brand Name */}
    <div className="p-4">Your Logo</div>
    {/* Team List */}
    <div className="p-4">
      <Link to="/teams">Teams</Link>
    </div>
    {/* Profile and Settings */}
    <div className="mt-auto p-4">
      <Link to="/profile">Profile</Link>
      <Link to="/settings">Settings</Link>
    </div>
    {/* New File Link */}
    <div className="p-4">
      <Link to="/files/new">New File</Link>
    </div>
  </div>
  )
}

export default Sidebar