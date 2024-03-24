import { Editor } from '@monaco-editor/react';
import React, { useEffect, useRef, useState } from 'react'

const Test = () => {

  const editorRef=useRef(null);

  function handleEditorDidMount(editor,monaco)
  {
    editorRef.current=editor;
  }

  function getValue()
  {
    console.log(editorRef.current.getValue());
    editorRef.current.setValue("");
  }

  const files = {
    'script.js': {
      name: 'script.js',
      language: 'javascript',
      value: "",
    },
    'style.css': {
      name: 'style.css',
      language: 'css',
      value: "",
    },
    'index.html': {
      name: 'index.html',
      language: 'html',
      value: "",
    },
  };

  const [fileName, setFileName] = useState('script.js');

  const file = files[fileName];

  return (
    <>
      <button disabled={fileName === 'script.js'} onClick={() => setFileName('script.js')} className='p-2 rounded-lg m-2'>
        script.js
      </button>
      <button disabled={fileName === 'style.css'} onClick={() => setFileName('style.css')} className='p-2 rounded-lg m-2'>
        style.css
      </button>
      <button disabled={fileName === 'index.html'} onClick={() => setFileName('index.html')} className='p-2 rounded-lg m-2'>
        index.html
      </button>
      <button  className='p-2 rounded-lg m-2' onClick={getValue}>Log Value</button>
      <Editor
        height="90vh"
        theme="vs-dark"
        path={file.name}
        defaultLanguage={file.language}
        defaultValue={file.value}
        onMount={handleEditorDidMount}
      />
    </>
  );

}

export default Test