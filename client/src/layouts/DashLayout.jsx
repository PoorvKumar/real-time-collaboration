import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/sidebar';
import OrgSideBar from '../components/dashboard/OrgSideBar';
import Navbar from '../components/dashboard/Navbar';

const DashLayout = () => {
  return (
    <main className='flex h-screen'>
      <Sidebar />
      <div className='flex flex-col flex-1'>
        <Navbar />
        <Outlet />
      </div>
    </main>
  )
}

export default DashLayout;