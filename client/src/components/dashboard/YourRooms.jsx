import React from 'react';
import RoomCard from './RoomCard';

const YourRooms = () => {

    const rooms = [
        {
            id: 1,
            thumbnail: 'https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4',
            name: 'Collaborative Workspace Room 1',
            tags: ['Collaboration', 'Workspace', 'Teamwork'],
            description: 'A room for collaborative work, with access to a shared canvas and code editor.',
        },
        {
            id: 2,
            thumbnail: 'https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4',
            name: 'Collaborative Workspace Room 2',
            tags: ['Design', 'Development', 'Project Management'],
            description: 'Another room for collaborative work, with access to a shared canvas and code editor.',
        },
    ];

  return (
    <div className='flex flex-col gap-4'>
    <h1 className='text-xl font-bold'>Your Rooms</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {rooms.map(room => (
            <RoomCard key={room.id} room={room} />
        ))}
    </div>
</div>
  )
}

export default YourRooms