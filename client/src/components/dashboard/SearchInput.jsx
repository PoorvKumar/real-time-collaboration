import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { Input } from '../ui/input'

const SearchInput = () => {

    const [value,setValue]=useState("");

    const handleChange=()=>
    {

    };

  return (
    <div className='w-full relative'>
        <Search className='absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
        <Input 
            className="w-full max-w-[516px] pl-9"
            placeholder="Search projects"
            onChange={handleChange}
            value={value}
        />
    </div>
  )
}

export default SearchInput