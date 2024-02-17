import { LayerType } from '@/constants';
import React, { memo } from 'react'
import Path from './Path';

const LayerPreview = memo(({ layer }) => {

    if(!layer)
    {
        return null;
    }

    switch(layer.type)
    {
        case LayerType.Path:
            return (
                <Path
                    points={layer.points}
                    x={0}
                    y={0}
                    fill={layer?.fill ? layer.fill : "black"}
                />
                );
        default: 
            return null;
    }
});

export default LayerPreview;