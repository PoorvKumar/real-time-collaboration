import { LayerType } from '@/constants';
import React, { memo } from 'react'
import Path from './Path';
import { getLayerData } from '@/lib/utils';
import { getArrowHeadPath } from '@/lib/utils';

const LayerPreview = memo(({ layer }) => {

    if (!layer) {
        return null;
    }

    if (layer.type === LayerType.Path) {
        return (
            <Path
                points={layer.points}
                x={0}
                y={0}
                fill={layer?.fill ? layer.fill : "black"}
            />
        );
    }

    console.log("layer preview",layer);

    const layerData = getLayerData(layer.type, layer.points[0], layer.points[1]); //type, start, end

    switch (layer.type) {
        case LayerType.Rectangle:
            return (
                <rect
                    className='drop-shadow-md'
                    style={{
                        transform: `translate(${layerData.x}px,${layerData.y}px)`
                    }}
                    width={layerData.width}
                    height={layerData.height}
                    x={0}
                    y={0}
                    fill='transparent'
                    strokeWidth={1}
                    stroke='#000'
                />
            );
        case LayerType.Ellipse:
            return (
                <ellipse
                    className='drop-shadow-md'
                    style={{
                        transform: `translate(${layerData.x}px,${layerData.y}px)`
                    }}
                    cx={layerData.cx}
                    cy={layerData.cy}
                    rx={layerData.rx}
                    ry={layerData.ry}
                    x={0}
                    y={0}
                    fill='transparent'
                    strokeWidth={1}
                    stroke='#000'
                />
            );
        case LayerType.Arrow:
            return (
                <>
                    <line
                        className='drop-shadow-md'
                        style={{
                            transform: `translate(${layerData.x}px,${layerData.y}px)`
                        }}
                        x1={layerData.x1}
                        y1={layerData.y1}
                        x2={layerData.x2}
                        y2={layerData.y2}
                        x={0}
                        y={0}
                        strokeWidth={1}
                    />
                    <path
                        className='drop-shadow-md'
                        style={{
                            transform: `translate(${layerData.x}px,${layerData.y}px)`
                        }}
                        d={getArrowHeadPath(layerData.x1, layerData.y1, layerData.x2, layerData.y2)}
                        x={0}
                        y={0}
                        strokeWidth={1}
                    />
                </>
            );
        case LayerType.Line:
            return (
                <line
                    className='drop-shadow-md'
                    style={{
                        transform: `translate(${layer.x}px,${layer.y}px)`
                    }}
                    x1={layerData.x1}
                    y1={layerData.y1}
                    x2={layerData.x2}
                    y2={layerData.y2}
                    x={0}
                    y={0}
                    strokeWidth={1}
                />
            );
        default:
            return null;
    }
});

export default LayerPreview;