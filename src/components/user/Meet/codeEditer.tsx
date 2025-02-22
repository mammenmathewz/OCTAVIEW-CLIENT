import React, { useEffect, useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import { editor } from "monaco-editor";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { Play, Users, Cpu, X } from "lucide-react";
import "xterm/css/xterm.css";

const languages = [
  { id: "javascript", name: "JavaScript", ext: ".js" },
  { id: "python", name: "Python", ext: ".py" },
  { id: "cpp", name: "C++", ext: ".cpp" },
  { id: "java", name: "Java", ext: ".java" },
  { id: "typescript", name: "TypeScript", ext: ".ts" }
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

  const cleanup = () => {
    if (bindingRef.current) bindingRef.current.destroy();
    if (providerRef.current) providerRef.current.destroy();
    if (docRef.current) docRef.current.destroy();
  };

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

    yLanguage.current.observe(() => {
      const newLang = yLanguage.current?.toString() || "javascript";
      setLanguage(newLang || "");
    });

    yTerminal.current.observe(() => {
      if (terminalInstance.current) {
        terminalInstance.current.clear();
        yTerminal.current?.toArray().forEach(line => {
          terminalInstance.current?.writeln(line);
        });
      }
    });

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

  const [language, setLanguage] = useState<string>("javascript");

  useEffect(() => {
    if (yLanguage.current) {
      const observer = () => {
        const newLang = yLanguage.current?.toString().trim(); // Trim extra spaces
        if (newLang !== language) {
          setLanguage(newLang||"");
        }
      };
      yLanguage.current.observe(observer);
  
      return () => yLanguage.current?.unobserve(observer);
    }
  }, []);
  
  

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
    if (docRef.current && providerRef.current) {
      createBinding(editor, docRef.current, providerRef.current);
    }
  };

  useEffect(() => {
    if (!terminalRef.current) return;

    terminalInstance.current = new Terminal({
      theme: { background: "#1e1e1e", foreground: "#d4d4d4", cursor: "#d4d4d4" },
      fontSize: 14,
      cursorBlink: true
    });

    terminalInstance.current.loadAddon(fitAddon.current);
    terminalInstance.current.open(terminalRef.current);
    fitAddon.current.fit();
    terminalInstance.current.writeln("Terminal ready\r\n");

    return () => {
      terminalInstance.current?.dispose();
    };
  }, []);

  const runCode = async () => {
    const code = editorRef.current?.getValue();
    if (!code || !terminalInstance.current) return;

    terminalInstance.current.clear();
    terminalInstance.current.writeln(`[${new Date().toLocaleTimeString()}] Running ${language.toUpperCase()} code...\r\n`);

    if (yTerminal.current) {
      yTerminal.current.push([`[${new Date().toLocaleTimeString()}] Running ${language.toUpperCase()} code...`]);
    }

    try {
      const response = await fetch("http://localhost:5000/meet/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code })
      });
      const data = await response.json();
      terminalInstance.current.writeln(data.output || "Execution error");

      if (yTerminal.current) {
        yTerminal.current.push([data.output || "Execution error"]);
      }
    } catch (err) {
      terminalInstance.current.writeln("Error executing code");
      if (yTerminal.current) {
        yTerminal.current.push(["Error executing code"]);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-300">
      <div className="bg-[#252526] px-4 py-2 flex items-center justify-between border-b border-[#3d3d3d]">
        <div className="flex items-center space-x-4">
          <span className="text-sm">{`main.${language}`}</span>
          {isConnected && (
            <div className="flex items-center text-xs text-gray-400">
              <Users size={14} className="mr-1" />
              <span>{peerCount} connected</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-[#3d3d3d] text-sm px-2 py-1 rounded">
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
          <button onClick={runCode} className="flex items-center space-x-1 bg-[#4d4d4d] px-3 py-1 rounded">
            <Play size={14} />
            <span>Run</span>
          </button>
        </div>
      </div>

      <Editor height="100%" language={language} defaultValue="// Start coding..." onMount={handleEditorDidMount} theme="vs-dark" />

      <div className="border-t border-[#3d3d3d]">
        <div className="bg-[#252526] px-4 py-1 flex items-center justify-between">
          <Cpu size={14} />
          <button onClick={() => setIsTerminalMinimized(!isTerminalMinimized)}><X size={14} /></button>
        </div>
        <div ref={terminalRef} className={isTerminalMinimized ? "h-0" : "h-64"} />
      </div>
    </div>
  );
};

export default CodeEditor;
