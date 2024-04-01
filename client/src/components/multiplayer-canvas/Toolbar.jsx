import React, { useEffect } from 'react';
import ToolButton from './ToolButton';
import { Circle, Eraser, Hand, MessageSquareDashed, MousePointer2, MoveUpRight, Pencil, Plus, Redo2, Slash, Square, Type, Undo2 } from 'lucide-react';
import { useRoom } from '@/context/RoomContext';
import { useCanvas } from '@/context/CanvasContext';

const Toolbar = () => {

    const { tool, setTool, setPrevTool }=useCanvas();
    const { undo, redo, canUndo, canRedo }=useRoom();

    // useEffect(()=>
    // {
    //     console.log("Tool:",tool);
    //     console.log("Drawing?:",isDrawing);
    // },[tool]);

    return (
        <div className='absolute top-[40%] -translate-y-[40%] left-4 flex flex-col gap-y-2 '>
            <div className='bg-white dark:bg-[#1e1e1e] rounded-md p-1.5 flex flex-col items-center shadow-md'>
                {/* <ToolButton 
                    label="Undo"
                    Icon={Undo2}
                    onClick={()=> {}}
                />
                <ToolButton 
                    label="Redo"
                    Icon={Redo2}
                    onClick={()=> {}}
                /> */}
                <ToolButton 
                    label="More"
                    Icon={Plus}
                    onClick={()=> {}}
                />
            </div>
            <div className='bg-white dark:bg-[#1e1e1e] rounded-md p-1.5 flex flex-col gap-y-1 items-center shadow-md'>
                <ToolButton
                    label={"Select"}
                    Icon={MousePointer2}
                    onClick={()=> {setPrevTool(tool); setTool('select');}}
                    isActive={tool==='select'}
                />
                {/* <ToolButton 
                    label="Hand"
                    Icon={Hand}
                    onClick={()=> setTool('hand')}
                    isActive={tool==='hand'}
                /> */}
                <ToolButton
                    label="Rectangle"
                    Icon={Square}
                    onClick={()=> {setPrevTool(tool); setTool('rectangle');}}
                    isActive={tool==='rectangle'}
                />
                <ToolButton
                    label="Ellipse"
                    Icon={Circle}
                    onClick={()=> {setPrevTool(tool); setTool('circle');}}
                    isActive={tool==='circle'}
                />
                <ToolButton
                    label="Arrow"
                    Icon={MoveUpRight}
                    onClick={()=> {setPrevTool(tool); setTool('arrow');}}
                    isActive={tool==='arrow'}
                />
                <ToolButton
                    label="Line"
                    Icon={Slash}
                    onClick={()=> {setPrevTool(tool); setTool('line');}}
                    isActive={tool==='line'}
                />
                <ToolButton
                    label="Pen"
                    Icon={Pencil}
                    onClick={()=> {setPrevTool(tool); setTool('pencil');}}
                    isActive={tool==='pencil'}
                />
                <ToolButton
                    label="Text"
                    Icon={Type}
                    onClick={()=> {setPrevTool(tool); setTool('text');}}
                    isActive={tool==='text'}
                />
            </div>
            <div className='bg-white dark:bg-[#1e1e1e] rounded-md p-1.5 flex flex-col items-center shadow-md'>
                {/* <ToolButton 
                    label="Undo"
                    Icon={Undo2}
                    onClick={()=> {}}
                />
                <ToolButton 
                    label="Redo"
                    Icon={Redo2}
                    onClick={()=> {}}
                /> */}
                <ToolButton 
                    label="Eraser"
                    Icon={Eraser}
                    onClick={()=> {}}
                />
                <ToolButton 
                    label="Comment"
                    Icon={MessageSquareDashed}
                    onClick={()=> {}}
                />
            </div>
        </div>
    )
}

export default Toolbar;