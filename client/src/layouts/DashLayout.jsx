import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import OrgSideBar from '../components/dashboard/OrgSideBar';
import Navbar from '../components/dashboard/Navbar';

const DashLayout = () => {
  return (
    <main className='h-full'>
      <Sidebar />
      <div className='pl-[60px] h-full'>
        <div className='flex gap-x-3 h-full'>
          <OrgSideBar />
          <div className='h-full flex-1'>
            <Navbar />
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  )
}

export default DashLayout;