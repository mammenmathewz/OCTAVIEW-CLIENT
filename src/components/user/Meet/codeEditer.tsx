import React, { useEffect, useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import { editor, KeyMod, KeyCode } from "monaco-editor";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { Play, Users, Cpu, X } from "lucide-react";
import "xterm/css/xterm.css";

// Updated languages array with Judge0 IDs
const languages = [
  { id: "javascript", name: "JavaScript", ext: ".js", judge0Id: 63 },  // Node.js
  { id: "python", name: "Python", ext: ".py", judge0Id: 71 },         // Python 3
  { id: "cpp", name: "C++", ext: ".cpp", judge0Id: 54 },             // C++ (GCC 9.2.0)
  { id: "java", name: "Java", ext: ".java", judge0Id: 62 },          // Java (OpenJDK 13.0.1)
  { id: "typescript", name: "TypeScript", ext: ".ts", judge0Id: 74 }  // TypeScript
];

interface CodeEditorProps {
  roomId: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ roomId }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const fitAddon = useRef<FitAddon>(new FitAddon());
  const terminalInstance = useRef<Terminal | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [peerCount, setPeerCount] = useState<number>(0);
  const [isTerminalMinimized, setIsTerminalMinimized] = useState<boolean>(false);
  const providerRef = useRef<WebrtcProvider | null>(null);
  const docRef = useRef<Y.Doc | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  
  const yLanguage = useRef<Y.Text | null>(null);
  const yTerminal = useRef<Y.Array<string> | null>(null);
  const [language, setLanguage] = useState<string>("javascript");

  const cleanup = () => {
    if (bindingRef.current) bindingRef.current.destroy();
    if (providerRef.current) providerRef.current.destroy();
    if (docRef.current) docRef.current.destroy();
  };

  // Initialize Y.js document and WebRTC provider
  useEffect(() => {
    if (!roomId) return;
    cleanup();

    const yDoc = new Y.Doc();
    docRef.current = yDoc;
    const webrtcProvider = new WebrtcProvider(`code-${roomId}`, yDoc, {
      signaling: ["ws://localhost:4444"],
      maxConns: 20,
      peerOpts: {
        config: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] }
      }
    });
    providerRef.current = webrtcProvider;

    yLanguage.current = yDoc.getText("language");
    yTerminal.current = yDoc.getArray("terminal");

    if (yLanguage.current.toString().length === 0) {
      yLanguage.current.insert(0, language);
    }

    const updatePeerCount = () => {
      const count = Array.from(webrtcProvider.awareness.getStates().keys()).length - 1;
      setPeerCount(Math.max(0, count));
    };

    webrtcProvider.awareness.on("change", updatePeerCount);
    webrtcProvider.on("synced", ({ synced }: { synced: boolean }) => setIsConnected(synced));
    webrtcProvider.on("status", ({ connected }: { connected: boolean }) => setIsConnected(connected));

    if (editorRef.current) {
      createBinding(editorRef.current, yDoc, webrtcProvider);
    }

    return () => {
      webrtcProvider.awareness.off("change", updatePeerCount);
      cleanup();
    };
  }, [roomId]);

  // Sync language changes
  useEffect(() => { 
    if (yLanguage.current) {
      const observer = () => {
        const newLang = yLanguage.current!.toString().trim();
        if (newLang && newLang !== language) {
          setLanguage(newLang);
        }
      };
      yLanguage.current.observe(observer);
      return () => yLanguage.current?.unobserve(observer);
    }
  }, []);
  
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (yLanguage.current) {
      yLanguage.current.delete(0, yLanguage.current.length);
      yLanguage.current.insert(0, newLanguage);
    }
  };

  const createBinding = (editor: editor.IStandaloneCodeEditor, yDoc: Y.Doc, provider: WebrtcProvider) => {
    if (bindingRef.current) bindingRef.current.destroy();
    const yText = yDoc.getText("monaco");
    const monacoModel = editor.getModel();
    if (monacoModel) {
      bindingRef.current = new MonacoBinding(yText, monacoModel, new Set([editor]), provider.awareness);
    }
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    editor.updateOptions({
      minimap: { enabled: true },
      fontSize: 14,
      lineNumbers: "on",
      wordWrap: "on",
      formatOnPaste: true,
      formatOnType: true,
      quickSuggestions: { other: true, comments: true, strings: true },
      suggestOnTriggerCharacters: true,
      snippetSuggestions: "inline",
      tabSize: 2,
      autoClosingBrackets: "always",
      autoClosingQuotes: "always",
      acceptSuggestionOnEnter: "smart",
      
    });
    
    editor.addAction({
      id: 'format-code',
      label: 'Format Code',
      keybindings: [
        KeyMod.CtrlCmd | KeyCode.KeyF
      ],
      run: (ed) => {
        const action = ed.getAction('editor.action.formatDocument');
        if (action) {
          action.run();
        }
      }
    });

    if (docRef.current && providerRef.current) {
      createBinding(editor, docRef.current, providerRef.current);
    }
  };

  // Initialize terminal when component mounts
  const initializeTerminal = () => {
    if (!terminalRef.current) return;

    // If terminal already exists, dispose it properly
    if (terminalInstance.current) {
      terminalInstance.current.dispose();
      terminalInstance.current = null;
    }

    terminalInstance.current = new Terminal({
      theme: { 
        background: "#1e1e1e", 
        foreground: "#d4d4d4", 
        cursor: "#d4d4d4",
        black: "#000000",
        red: "#cd3131",
        green: "#0dbc79",
        yellow: "#e5e510",
        blue: "#2472c8",
        magenta: "#bc3fbc",
        cyan: "#11a8cd",
        white: "#e5e5e5",
        brightBlack: "#666666",
        brightRed: "#f14c4c",
        brightGreen: "#23d18b",
        brightYellow: "#f5f543",
        brightBlue: "#3b8eea",
        brightMagenta: "#d670d6",
        brightCyan: "#29b8db",
        brightWhite: "#e5e5e5"
      },
      fontSize: 14,
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      lineHeight: 1.2,
      scrollback: 1000,
      allowTransparency: true
    });

    terminalInstance.current.loadAddon(fitAddon.current);
    terminalInstance.current.open(terminalRef.current);
    
    // Force fit the terminal after a brief delay to ensure container dimensions are stable
    setTimeout(() => {
      if (terminalInstance.current) {
        fitAddon.current.fit();
        terminalInstance.current.focus();
      }
    }, 100);
    
    // Display current terminal content if available
    if (yTerminal.current && yTerminal.current.length > 0) {
      const messages = yTerminal.current.toArray();
      messages.forEach(message => {
        message.split(/\r?\n/).forEach(line => {
          terminalInstance.current?.writeln(line);
        });
      });
    } else {
      terminalInstance.current.writeln("Terminal ready\r\n");
    }
  };

  // Handle resizing
  useEffect(() => {
    const handleResize = () => {
      if (!isTerminalMinimized && terminalInstance.current) {
        fitAddon.current.fit();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isTerminalMinimized]);

  // Effect for initializing terminal when it's visible
  useEffect(() => {
    if (!isTerminalMinimized) {
      // Small delay to ensure the DOM is ready
      const timer = setTimeout(() => {
        initializeTerminal();
      }, 100);
      
      return () => clearTimeout(timer);
    } else if (terminalInstance.current) {
      terminalInstance.current.dispose();
      terminalInstance.current = null;
    }
  }, [isTerminalMinimized]);
  
  // Add the Yjs terminal observer
  useEffect(() => {
    if (!yTerminal.current) return;
    
    const terminalObserver = () => {
      if (yTerminal.current && terminalInstance.current) {
        const outputMessages = yTerminal.current.toArray();
        terminalInstance.current.clear();
        outputMessages.forEach((message) => {
          message.split(/\r?\n/).forEach((line) => {
            terminalInstance.current?.writeln(line);
          });
        });
      }
    };

    yTerminal.current.observe(terminalObserver);
    return () => {
      yTerminal.current?.unobserve(terminalObserver);
    };
  }, []);
  
  const runCode = async () => {
    const code = editorRef.current?.getValue();
    if (!code || !yTerminal.current) return;
  
    // Prepare a local array to accumulate messages
    const messages: string[] = [];
    const timestamp = new Date().toLocaleTimeString();
    const currentLang = languages.find(lang => lang.id === language);
    const runMessage = `[${timestamp}] Running ${currentLang?.name || language.toUpperCase()} code...\r\n`;
    messages.push(runMessage);
  
    try {
      const languageId = currentLang?.judge0Id || 63; // Default to Node.js if not found
  
      const response = await fetch("http://localhost:5000/api/meet/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          languageId,
          sourceCode: code,
          stdin: ""
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        messages.push(`Error: ${data.error}`);
      } else {
        // Build the output string
        const outputs = [];
        if (data.stdout) outputs.push(data.stdout);
        if (data.stderr) outputs.push(`Errors:\n${data.stderr}`);
        if (data.compile_output) outputs.push(`Compiler Output:\n${data.compile_output}`);
        
        const output = outputs.join("\n\n").trim() || "No output";
        messages.push(output);
        
        if (data.time) {
          messages.push(`\r\nExecution time: ${data.time}s`);
        }
        if (data.memory) {
          messages.push(`Memory used: ${data.memory} KB`);
        }
      }
    } catch (err) {
      messages.push("Error executing code");
    }
  
    // Update the Yjs terminal array in a single transaction to trigger one update
    yTerminal.current?.doc?.transact(() => {
      yTerminal.current!.delete(0, yTerminal.current!.length);
      yTerminal.current!.push(messages);
    });

    // Make sure the terminal is open
    if (isTerminalMinimized) {
      setIsTerminalMinimized(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-300">
      <div className="bg-[#252526] px-4 py-2 flex items-center justify-between border-b border-[#3d3d3d]">
        <div className="flex items-center space-x-4">
          <span className="text-sm">{`main${languages.find(l => l.id === language)?.ext || '.js'}`}</span>
          {isConnected && (
            <div className="flex items-center text-xs text-gray-400">
              <Users size={14} className="mr-1" />
              <span>{peerCount} connected</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={language} 
            onChange={(e) => handleLanguageChange(e.target.value)} 
            className="bg-[#3d3d3d] text-sm px-2 py-1 rounded"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
          <button 
            onClick={runCode} 
            className="flex items-center space-x-1 bg-[#4d4d4d] hover:bg-[#5d5d5d] px-3 py-1 rounded transition-colors"
          >
            <Play size={14} />
            <span>Run</span>
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <Editor
          height="100%"
          language={language}
          defaultValue="// Start coding..."
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            automaticLayout: true,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: 14
          }}
        />
      </div>

      <div className="border-t border-[#3d3d3d]">
        {isTerminalMinimized ? (
          <button 
            onClick={() => setIsTerminalMinimized(false)}
            className="w-full bg-[#252526] text-gray-300 px-4 py-2 text-sm hover:bg-[#3d3d3d] transition-colors"
          >
            Open Terminal
          </button>
        ) : (
          <div className="flex flex-col">
            <div className="bg-[#252526] px-4 py-1 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu size={14} />
                <span className="text-xs">Terminal</span>
              </div>
              <button 
                onClick={() => setIsTerminalMinimized(true)}
                className="hover:bg-[#3d3d3d] p-1 rounded transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div 
              ref={terminalRef} 
              className="h-64 w-full"
              style={{ minHeight: "200px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;