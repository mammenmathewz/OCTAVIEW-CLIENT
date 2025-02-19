import React, { useEffect, useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import { editor } from "monaco-editor";

const CodeEditor = ({ roomId }: { roomId: string }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [peerCount, setPeerCount] = useState(0);
  const providerRef = useRef<WebrtcProvider | null>(null);
  const docRef = useRef<Y.Doc | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);

  // Cleanup function
  const cleanup = () => {
    if (bindingRef.current) {
      bindingRef.current.destroy();
      bindingRef.current = null;
    }
    if (providerRef.current) {
      providerRef.current.destroy();
      providerRef.current = null;
    }
    if (docRef.current) {
      docRef.current.destroy();
      docRef.current = null;
    }
  };

  // Initialize Y.js and WebRTC
  useEffect(() => {
    if (!roomId) return;

    cleanup(); // Clean up previous instances

    // Initialize Yjs document
    const yDoc = new Y.Doc();
    docRef.current = yDoc;
    
    // Configure WebRTC provider
    const webrtcProvider = new WebrtcProvider(`code-${roomId}`, yDoc, {
      signaling: ['ws://localhost:4444'],
      maxConns: 20,
      filterBcConns: false,
      peerOpts: {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        }
      }
    });

    providerRef.current = webrtcProvider;

    // Set awareness states for user presence
    webrtcProvider.awareness.setLocalState({
      name: `User-${Math.floor(Math.random() * 1000)}`,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
    });

    // Track connection status
    const updatePeerCount = () => {
      const count = Array.from(webrtcProvider.awareness.getStates().keys()).length - 1;
      setPeerCount(Math.max(0, count));
    };

    webrtcProvider.awareness.on('change', updatePeerCount);
    
    webrtcProvider.on('synced', ({ synced }: { synced: boolean }) => {
      console.log('Document synced:', synced);
      setIsConnected(synced);
    });

    webrtcProvider.on('status', ({ connected }: { connected: boolean }) => {
      console.log('Connection status:', connected ? 'connected' : 'disconnected');
      setIsConnected(connected);
    });

    // Create Monaco binding when editor is available
    if (editorRef.current) {
      createBinding(editorRef.current, yDoc, webrtcProvider);
    }

    return () => {
      webrtcProvider.awareness.off('change', updatePeerCount);
      cleanup();
    };
  }, [roomId]);

  // Create binding when editor becomes available
  const createBinding = (
    editor: editor.IStandaloneCodeEditor,
    yDoc: Y.Doc,
    provider: WebrtcProvider
  ) => {
    if (bindingRef.current) {
      bindingRef.current.destroy();
    }

    const yText = yDoc.getText('monaco');
    const monacoModel = editor.getModel();
    
    if (monacoModel) {
      bindingRef.current = new MonacoBinding(
        yText,
        monacoModel,
        new Set([editor]),
        provider.awareness
      );
      console.log('Monaco binding created');
    }
  };

  // Handle editor mounting
  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    
    if (docRef.current && providerRef.current) {
      createBinding(editor, docRef.current, providerRef.current);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-800 p-2 text-white text-sm flex justify-between items-center">
        <span>
          Status: {isConnected ? `Connected (${peerCount} peer${peerCount !== 1 ? 's' : ''})` : 'Connecting...'}
        </span>
      </div>
      <Editor
        height="calc(100vh - 40px)"
        defaultLanguage="javascript"
        defaultValue="// Start coding..."
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          wordWrap: 'on'
        }}
      />
    </div>
  );
};

export default CodeEditor;