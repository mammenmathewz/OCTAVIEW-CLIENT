import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Settings2, Play, Download, FolderTree } from 'lucide-react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../../ui/resizable';

const languages = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'csharp',
  'html',
  'css',
  'json',
  'markdown',
];

const defaultCode = {
  javascript: '// Write your JavaScript code here\nconsole.log("Hello World!");',
  typescript:
    '// Write your TypeScript code here\nconst greeting: string = "Hello World!";\nconsole.log(greeting);',
  python: '# Write your Python code here\nprint("Hello World!")',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello World!" << std::endl;\n    return 0;\n}',
  csharp:
    'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello World!");\n    }\n}',
  html: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n</body>\n</html>',
  css: 'body {\n    font-family: Arial, sans-serif;\n    color: #333;\n    margin: 0;\n    padding: 20px;\n}',
  json: '{\n    "message": "Hello World!"\n}',
  markdown: '# Hello World\n\nWelcome to the editor!',
};

const CodeEditor = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(defaultCode[language as keyof typeof defaultCode]);
  const [theme, setTheme] = useState('vs-dark');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(defaultCode[newLang as keyof typeof defaultCode]);
  };

//   const handleThemeChange = () => {
//     setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark');
//   };

  const handleRun = () => {
    try {
      if (language === 'javascript' || language === 'typescript') {
        const result = new Function(code)();
        setTerminalOutput((prev) => [...prev, `> ${result}`]);
      } else {
        setTerminalOutput((prev) => [
          ...prev,
          `> Code compilation simulated for ${language}`,
        ]);
      }
    } catch (error) {
      setTerminalOutput((prev) => [...prev, `Error: ${error}`]);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Top Bar */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
        
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-gray-700 text-white px-3 py-1 rounded-md border border-gray-600"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-4">
          {/* <button
            onClick={handleThemeChange}
            className="text-gray-300 hover:text-white"
          >
            <Settings2 size={20} />
          </button> */}
          <button
            onClick={handleRun}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded-md flex items-center space-x-2"
          >
            <Play size={16} />
            <span>Run</span>
          </button>
          <button
            onClick={handleDownload}
            className="text-gray-300 hover:text-white"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <ResizablePanelGroup direction="vertical">
        {/* Editor Panel */}
        <ResizablePanel>
          <Editor
            height="100%"
            language={language}
            value={code}
            theme={theme}
            onChange={(value) => setCode(value || '')}
            options={{
              fontSize: 14,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: 'on',
            }}
          />
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle className="bg-gray-600 hover:bg-gray-500 cursor-row-resize" />

        {/* Terminal Panel */}
        <ResizablePanel>
          <div className="h-full bg-gray-950 text-gray-200 p-2 overflow-y-auto">
            {terminalOutput.map((output, index) => (
              <div key={index} className="text-sm font-mono">
                {output}
              </div>
            ))}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CodeEditor;
