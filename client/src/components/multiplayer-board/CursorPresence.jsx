import React from 'react';
import Cursors from './Cursors';
import Drafts from './Drafts';
import LayerDrafts from './LayerDrafts';

const CursorPresence=()=>
{
    return (
        <>
            <Drafts />
            {/* <LayerDrafts /> */}
            <Cursors />
        </>
    )
};

export default CursorPresence;