import React from 'react'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'

const EmpytOrg = () => {
  return (
    <div className='h-full flex flex-col items-center justify-center'>
        <img src="/images/elements.svg" alt="Empty" height={200} width={200} />
        <h2 className='text-2xl font-semiold mt-6'>
            Welcome to Real-time Collaboration Tool
        </h2>
        <p className='text-mute-foreground text-sm mt-2'>
            Create a project to get started
        </p>
        <div className='mt-6'>
            <Dialog>
                <DialogTrigger asChild>
                    <Button size="lg">
                        Create Project
                    </Button>
                </DialogTrigger>
                <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
                    Create Project Component
                </DialogContent>
            </Dialog>
        </div>
    </div>
  )
}

export default EmpytOrg