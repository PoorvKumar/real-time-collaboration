import React from 'react'
import Hint from '../Hint';
import { Button } from '../ui/button';

const TabSeparator=()=>
{
  return (
    <div className='text-neutral-300 px-1.5'>
      |
    </div>
  );
};

const Info = () => {
  return (
    <div className='absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md'>
      <Hint label="Back to Dashboard" side="bottom" sideOffset={10}>
        <Button 
          asChild
          variant="board"
          className="px-2"
        >
          <a href="/">
            <img src="/images/real-time-collab-1.png" alt="logo" width={40} height={40} />
            {/* <span className='font-semibold text-lg ml-2 text-black'>
              Real-time Collab
            </span> */}
          </a>
        </Button>
      </Hint>
      <input type="text" name="" id="" />
      <TabSeparator />
    </div>
  )
}

export default Info;