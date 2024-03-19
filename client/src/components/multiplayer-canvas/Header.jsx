import { useCanvas } from '@/context/CanvasContext';
import React from 'react';

const Header = () => {

  const { activeTab, setActiveTab } = useCanvas();

  return (
    <div className="fixed top-0 z-50 w-full bg-white shadow-md flex items-center justify-between px-4 py-2">
      {/* Logo on the left */}
      <div className="flex items-center">
        <img src="/images/real-time-collab-1.png" alt="rtc" className="h-8 mr-2" />
        <div className="text-lg font-semibold">SkribbleCode</div>
      </div>

      {/* Middle buttons */}
      <div className="flex justify-center">
      <button
        className={`flex-grow px-4 py-1 border text-sm rounded-l-lg ${
          activeTab === "canvas" ? "bg-[#d8e6fd] text-[#1e40af]" : "bg-white text-black"
        }`}
        onClick={() => setActiveTab("canvas")}
      >
        Canvas
      </button>
      <button
        className={`flex-grow px-4 py-1 border text-sm text-black ${
          activeTab === "both" ? "bg-[#d8e6fd] text-[#1e40af]" : "bg-white text-black"
        }`}
        onClick={() => setActiveTab("both")}
      >
        Both
      </button>
      <button
        className={`flex-grow px-4 py-1 border text-sm rounded-r-lg text-black ${
          activeTab === "editor" ? "bg-[#d8e6fd] text-[#1e40af]" : "bg-white text-black"
        }`}
        onClick={() => setActiveTab("editor")}
      >
        Editor
      </button>
    </div>

      {/* Right buttons */}
      <div className="flex items-center">
        <button className="mr-2">Button 4</button>
        <button className="mr-2">Button 5</button>
        <button>Button 6</button>
      </div>
    </div>
  );
};

export default Header;
