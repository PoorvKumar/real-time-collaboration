import React from 'react'
import { Card, CardDescription, CardFooter, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room }) => {

    const navigate=useNavigate();

    const handleRoomJoin=()=>
    {
        navigate(`/room/${room.id}`);
    };

    return (
        <Card>
            <img src={room.thumbnail} alt={room.name} className="w-full h-auto mb-4 rounded-lg" />
            <div className='pt-0 pb-2 px-4'>
                <CardTitle className="text-sm md:text-md lg:text-lg truncate">{room.name}</CardTitle>
                <div className="flex flex-wrap my-2 gap-1">
                    {room.tags.map((tag, index) => (
                        <Badge key={index}>
                            {tag}
                        </Badge>
                    ))}
                </div>
                <CardDescription className="">{room.description}</CardDescription>
            </div>
            <CardFooter className="">
                <Button className="w-full" onClick={handleRoomJoin}>
                    Join Room
                </Button>
            </CardFooter>
        </Card>
    );
};

export default RoomCard