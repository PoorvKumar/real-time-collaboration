import { LayerType } from '@/constants';
import React, { memo } from 'react'
import Path from '../multiplayer-canvas/Path';
import { getLayerData } from '@/lib/utils';
import Text from './Text';

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
    
    if (layer.type === LayerType.Text) {
        return (
            <Text
                id={layer.id}
                x={layer.points[0].x}
                y={layer.points[0].y}
                value={"text"}
                fontSize={32}
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
                    rx={10}
                    ry={10}
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
            const uniqueId = `arrowhead-${Date.now()}`; // Generating unique ID for the arrowhead
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
                        strokeWidth={1.5}
                        stroke='#000'
                        markerEnd={`url(#${uniqueId})`} // Referencing the arrowhead marker
                    />
                    <defs>
                        <marker
                            id={uniqueId} // Using unique ID for the marker
                            markerWidth="15"
                            markerHeight="15"
                            refX="10"
                            refY="3"
                            orient="auto"
                            markerUnits="strokeWidth"
                        >
                            <path d="M0,0 L10,3 L0,6 L3,3 z" fill="#000" />
                        </marker>
                    </defs>
                </>
            );
        case LayerType.Line:
            return (
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
                    strokeWidth={1.5}
                    stroke='#000'
                />
            );
        default:
            return null;
    }
});

export default LayerPreview;