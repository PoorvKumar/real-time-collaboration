import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import OrgSideBar from '../components/dashboard/OrgSideBar';
import Navbar from '../components/dashboard/Navbar';
import { Button } from '../components/ui/button';

const DashLayout = () => {
  return (
    <main className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
      <Sidebar />
      <div className='flex flex-col flex-1'>
        <Navbar />
        <div className='p-4 md:p-8 relative'>
          <Outlet />
          <div className='absolute top-5 right-5 flex flex-col sm:flex-row gap-4'>
            <Button>Join Room</Button>
            <Button>Create a Room</Button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default DashLayout;