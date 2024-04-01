import React from 'react'
import EmpytOrg from '../components/dashboard/EmpytOrg'
import { useTheme } from '../context/ThemeContext'

const Dashboard = () => {

  const { toggleDarkMode }=useTheme();

  return (
    <div className='flex-1 h-[calc(100%-80px)] p-6 dark:bg-black'>
      <button onClick={toggleDarkMode}>Toggle Dark</button>
      <EmpytOrg />
    </div>
  )
}

export default Dashboard