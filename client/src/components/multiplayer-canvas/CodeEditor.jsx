import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useRoom } from '@/context/RoomContext';
import { useSocket } from '@/hooks/useSocket';

export const CodeEditor = () => {

  const editorRef = useRef(null);
  const [lang, setLang] = useState("cpp");
  const [code, setCode] = useState(getDefaultCode(lang));
  // const [cursorPositions, setCursorPositions] = useState({});

  const socket = useSocket();
  const { userId, color } = useRoom();

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition(e => {
      const position = { line: e.position.lineNumber, column: e.position.column };
      socket.emit("code:cursor", { userId, color, position });
    });

  }

  function handleEditorChange(value, event) {
    setCode(value);
    socket.emit("code:change", { userId, content: value });
  }

  useEffect(() => {
    socket.on("code:change", ({ userId: remoteUserId, content }) => {
      setCode(content);
    });

    socket.on("code:cursor", ({ userId: remoteUserId, position }) => {
      setCursorPositions(prevState => ({
        ...prevState,
        [remoteUserId]: position
      }));
    });

    return () => {
      socket.off("code:change");
      socket.off("code:cursor");
    }

  }, []);

  // useEffect(() => {
  //   // Update cursor positions in the editor
  //   // Use Monaco Editor's API to set cursor positions
  //   Object.entries(cursorPositions).forEach(([userId, position]) => {
  //     // Check if the editorRef is initialized
  //     if (editorRef.current) {
  //       // Create a position object compatible with Monaco Editor's setPosition method
  //       const monacoPosition = {
  //         lineNumber: position.line,
  //         column: position.column
  //       };
  //       // Set the cursor position for each user
  //       editorRef.current.setPosition(monacoPosition);
  //     }
  //   });
  // }, [cursorPositions]);
  

  const file = {
    name: "default",
    language: "cpp",
    value: ""
  };

  function getDefaultCode(language) {
    switch (language) {
      case "java":
        return `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;
      case "js":
        return `console.log("Hello, World!");`;
      case "ts":
        return `console.log("Hello, World!");`;
      case "python":
        return `print("Hello, World!")`;
      case "cpp":
      default:
        return `#include <iostream>

int main() {
    std::cout << "Hello, World!";
    return 0;
}`;
    }
  }

  const handleLanguageChange = (value) => {
    setLang(value);
    setCode(getDefaultCode(value));
  };

  const handleRun = () => {
    console.log(editorRef.current.getValue());
    alert(editorRef.current.getValue());
  };

  return (
    <div className='flex flex-col bg-[#1e1e1e] text-white h-screen relative'>
      <div className='mt-12 w-full flex justify-between p-2'>
        {/* <Select onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="C++" defaultValue="cpp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="js">Javascript</SelectItem>
            <SelectItem value="ts">Typescript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
          </SelectContent>
        </Select> */}

        <Button variant="success" onClick={handleRun}>Run</Button>
      </div>
      <Editor
        height="85vh"
        theme='vs-dark'
        path={file.name}
        // defaultLanguage={lang}
        // defaultValue={code}
        language={lang}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
      />
    </div>
  )
}
