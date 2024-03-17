import React, { useEffect } from 'react';
import ToolButton from './ToolButton';
import { Circle, Hand, MousePointer2, MoveUpRight, Pencil, Redo2, Slash, Square, Type, Undo2 } from 'lucide-react';
import { CanvasMode } from '@/constants';
import { LayerType } from '@/constants';
import { useRoom } from '@/context/RoomContext';
import { useCanvas } from '@/context/CanvasContext';

const Toolbar = () => {

    const { tool, setTool, isDrawing, setIsDrawing }=useCanvas();
    const { undo, redo, canUndo, canRedo }=useRoom();

    useEffect(()=>
    {
        console.log("Tool:",tool);
        console.log("Drawing?:",isDrawing);
    },[tool]);

    return (
        <div className='absolute top-[40%] -translate-y-[40%] left-4 flex flex-col gap-y-4'>
            <div className='bg-white rounded-md p-1.5 flex flex-col gap-y-1 items-center shadow-md'>
                <ToolButton
                    label={"Select"}
                    Icon={MousePointer2}
                    onClick={()=> { setTool('select'); setIsDrawing(false); }}
                    isActive={tool==='select'}
                />
                <ToolButton 
                    label="Hand"
                    Icon={Hand}
                    onClick={()=> { setTool('hand'); setIsDrawing(false); }}
                    isActive={tool==='hand'}
                />
                <ToolButton
                    label="Rectangle"
                    Icon={Square}
                    onClick={()=> { setTool('rectangle'); setIsDrawing(true); }}
                    isActive={tool==='rectangle'}
                />
                <ToolButton
                    label="Ellipse"
                    Icon={Circle}
                    onClick={()=> { setTool('circle'); setIsDrawing(true); }}
                    isActive={tool==='circle'}
                />
                <ToolButton
                    label="Arrow"
                    Icon={MoveUpRight}
                    onClick={()=> { setTool('arrow'); setIsDrawing(true); }}
                    isActive={tool==='arrow'}
                />
                <ToolButton
                    label="Line"
                    Icon={Slash}
                    onClick={()=> { setTool('line'); setIsDrawing(true); }}
                    isActive={tool==='line'}
                />
                <ToolButton
                    label="Pen"
                    Icon={Pencil}
                    onClick={()=> { setTool('pencil'); setIsDrawing(true); }}
                    isActive={tool==='pencil'}
                />
                <ToolButton
                    label="Text"
                    Icon={Type}
                    onClick={()=> setTool('text')}
                    isActive={tool==='text'}
                />
            </div>
            <div className='bg-white rounded-md p-1.5 flex flex-col items-center shadow-md'>
                <ToolButton 
                    label="Undo"
                    Icon={Undo2}
                    onClick={()=> {}}
                />
                <ToolButton 
                    label="Redo"
                    Icon={Redo2}
                    onClick={()=> {}}
                />
            </div>
        </div>
    )
}

export default Toolbar;