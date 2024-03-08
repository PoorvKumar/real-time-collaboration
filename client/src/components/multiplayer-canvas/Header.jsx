import React from 'react';

const Header = () => {
  return (
    <div className="fixed top-0 z-50 w-full bg-white shadow-md flex items-center justify-between px-4 py-2">
      {/* Logo on the left */}
      <div className="flex items-center">
        <img src="logo.png" alt="Logo" className="h-8 mr-2" />
        <div className="text-lg font-semibold">Company Name</div>
      </div>

      {/* Middle buttons */}
      <div className="flex justify-center">
        <button className="mr-4">Button 1</button>
        <button className="mr-4">Button 2</button>
        <button className="mr-4">Button 3</button>
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
