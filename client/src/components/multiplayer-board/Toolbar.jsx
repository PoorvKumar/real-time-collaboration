import React from 'react';
import ToolButton from './ToolButton';
import { Circle, Hand, MousePointer2, Pencil, Square, Type } from 'lucide-react';
import { CanvasMode } from '@/constants';
import { LayerType } from '@/constants';

const Toolbar = ({ canvasState, setCanvasState }) => {
    return (
        <div className='absolute top-[40%] -translate-y-[40%] left-4 flex flex-col gap-y-4'>
            <div className='bg-white rounded-md p-1.5 flex flex-col gap-y-1 items-center shadow-md'>
                <ToolButton
                    label={"Select"}
                    Icon={MousePointer2}
                    onClick={() => {
                        setCanvasState({
                            mode: CanvasMode.None
                        });
                    }}
                    isActive={
                        canvasState.mode === CanvasMode.None ||
                        canvasState.mode === CanvasMode.Translating ||
                        canvasState.mode === CanvasMode.SelectionNet ||
                        canvasState.mode === CanvasMode.Pressing ||
                        canvasState.mode === CanvasMode.Resizing
                    }
                />
                <ToolButton 
                    label="Hand"
                    Icon={Hand}
                    onClick={()=>
                    {
                        setCanvasState({
                            mode: CanvasMode.Panning
                        });
                    }}
                    isActive={
                        canvasState.mode === CanvasMode.Panning
                    }
                />
                <ToolButton
                    label="Text"
                    Icon={Type}
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        layerType: LayerType.Text,
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Text
                    }
                />
                <ToolButton
                    label="Rectangle"
                    Icon={Square}
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        layerType: LayerType.Rectangle,
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Rectangle
                    }
                />
                <ToolButton
                    label="Ellipse"
                    Icon={Circle}
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        layerType: LayerType.Ellipse,
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Ellipse
                    }
                />
                <ToolButton
                    label="Pen"
                    Icon={Pencil}
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Pencil,
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Pencil
                    }
                />
            </div>
        </div>
    )
}

export default Toolbar;