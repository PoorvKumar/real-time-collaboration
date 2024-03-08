import React from 'react';
import ToolButton from './ToolButton';
import { Circle, Hand, MousePointer2, MoveUpRight, Pencil, Redo2, Slash, Square, Type, Undo2 } from 'lucide-react';
import { CanvasMode } from '@/constants';
import { LayerType } from '@/constants';
import { useRoom } from '@/context/RoomContext';

const Toolbar = () => {

    const { undo, redo, canUndo, canRedo }=useRoom();

    return (
        <div className='absolute top-[40%] -translate-y-[40%] left-4 flex flex-col gap-y-4'>
            <div className='bg-white rounded-md p-1.5 flex flex-col gap-y-1 items-center shadow-md'>
                <ToolButton
                    label={"Select"}
                    Icon={MousePointer2}
                />
                <ToolButton 
                    label="Hand"
                    Icon={Hand}
                />
                <ToolButton
                    label="Rectangle"
                    Icon={Square}
                />
                <ToolButton
                    label="Ellipse"
                    Icon={Circle}
                />
                <ToolButton
                    label="Arrow"
                    Icon={MoveUpRight}
                />
                <ToolButton
                    label="Line"
                    Icon={Slash}
                />
                <ToolButton
                    label="Pen"
                    Icon={Pencil}
                />
                <ToolButton
                    label="Text"
                    Icon={Type}
                />
            </div>
            <div className='bg-white rounded-md p-1.5 flex flex-col items-center shadow-md'>
                <ToolButton 
                    label="Undo"
                    Icon={Undo2}
                    onClick={undo} 
                    isDisabled={!canUndo}
                />
                <ToolButton 
                    label="Redo"
                    Icon={Redo2}
                    onClick={redo}
                    isDisabled={!canRedo}
                />
            </div>
        </div>
    )
}

export default Toolbar;