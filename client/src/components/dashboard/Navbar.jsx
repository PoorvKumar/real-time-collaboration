import React from 'react'
import SearchInput from './SearchInput'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className=" text-white p-4">
      <div className="flex justify-between items-center">
        {/* Navigation Links */}
        <div className="flex">
          <Link to="/files" className="mr-4">Files</Link>
          {/* Add more navigation links as needed */}
        </div>
        {/* Search Input */}
        <div>
          <input
            type="text"
            placeholder="Search by name"
            className="p-2 rounded"
          />
        </div>
      </div>
    </div>
  )
}

export default Navbar