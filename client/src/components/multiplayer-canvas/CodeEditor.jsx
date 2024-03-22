import { Editor } from '@monaco-editor/react'
import React from 'react'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

export const CodeEditor = () => {
  return (
    <div className='flex flex-col bg-[#1e1e1e] h-screen'>
      <div className='mt-12 w-full flex justify-between p-2'>
        <Select>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="success">Run</Button>
      </div>
      <Editor height="85vh" defaultLanguage="javascript" theme='vs-dark' defaultValue="// some comment" />
    </div>
  )
}
