import React from 'react';
import { useCanvas } from '@/context/CanvasContext';
import { AiOutlineLink } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { BsInfoLg } from "react-icons/bs";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRoom } from '@/context/RoomContext';
import { Button } from '../ui/button';
import { FaEllipsisH } from 'react-icons/fa';
import Hint from '../Hint';

const Header = () => {

  const { users } = useRoom();
  // console.log(users);
  const { activeTab, setActiveTab } = useCanvas();

  return (
    <div className="fixed top-0 z-50 bg-white dark:bg-[#1e1e1e] dark:border w-full shadow-md flex items-center justify-between px-4 py-2">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <div className='flex items-center gap-2'>
          <Hint label="Dashboard" side="bottom" sideOffset={10}>
            
              <a href="/"> <img src="/images/real-time-collab-1.png" alt="rtc" width={40} height={40} /></a>
            </Hint>
          <div className="md:text-md lg:text-lg font-semibold">SkribbleCode</div>
        </div>
        <Button variant="outline" className="h-6 border-0 px-1">
          <FaEllipsisH />
        </Button>
      </div>

      {/* Middle */}
      <div className="flex justify-center">
        <button
          className={`flex-grow px-4 py-1 border text-sm rounded-l-md ${activeTab === "canvas" ? "bg-[#d8e6fd] dark:bg-[#243249] text-[#1e40af]" : ""
            }`}
          onClick={() => setActiveTab("canvas")}
        >
          Canvas
        </button>
        <button
          className={`flex-grow px-4 py-1 border text-sm ${activeTab === "both" ? "bg-[#d8e6fd] dark:bg-[#243249] text-[#1e40af]" : ""
            }`}
          onClick={() => setActiveTab("both")}
        >
          Both
        </button>
        <button
          className={`flex-grow px-4 py-1 border text-sm rounded-r-md ${activeTab === "editor" ? "bg-[#d8e6fd] dark:bg-[#243249] text-[#1e40af]" : ""
            }`}
          onClick={() => setActiveTab("editor")}
        >
          Editor
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className='flex'>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className='flex'>
          <button className='flex-grow px-4 py-1 border text-sm rounded-l-md bg-blue-500 hover:bg-blue-600 text-white'>Share</button>
          <button className='flex-grow px-2 py-1 border text-sm rounded-r-md bg-blue-500 hover:bg-blue-600 text-white'>
            <AiOutlineLink />
          </button>
        </div>
        <button className=''>
          <BiCommentDetail />
        </button>
        <button>
          <BsInfoLg />
        </button>
      </div>
    </div>
  );
};

export default Header;