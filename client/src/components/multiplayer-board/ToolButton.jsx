import React from 'react'
import Hint from '../Hint'
import { Button } from '../ui/button'

const ToolButton = ({ label, Icon , onClick, isActive, isDisabled }) => {

  return (
    <Hint label={label} side={"right"} sideOffset={14}>
        <Button 
            disabled={isDisabled}
            onClick={onClick}
            size="icon"
            variant={isActive?"boardActive":"board"}
        >
            <Icon className="p-1" />
        </Button>
    </Hint>
  )
}

export default ToolButton