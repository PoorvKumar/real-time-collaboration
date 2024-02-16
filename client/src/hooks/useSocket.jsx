import { useRoom } from "../context/RoomContext"

export const useSocket=()=>
{
    const { socket }=useRoom();
    return socket;
}