import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Meet from "../../components/user/Meet/Meet";
import CodeEditor from "../../components/user/Meet/codeEditer";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "../../components/ui/resizable";

const InterviewRoom = () => {
  const { roomId } = useParams(); // Get roomId from URL

  if (!roomId) return <div className="text-center mt-10">Invalid Room ID</div>;

  // Handle resize events to ensure terminal fits properly
  useEffect(() => {
    const handlePanelResize = () => {
      // Force a window resize event to help terminal fit addon adjust
      window.dispatchEvent(new Event('resize'));
    };

    // Find all resizable handles and add listeners
    const resizableHandles = document.querySelectorAll('[data-resize-handle]');
    resizableHandles.forEach(handle => {
      handle.addEventListener('mouseup', handlePanelResize);
      handle.addEventListener('touchend', handlePanelResize);
    });

    return () => {
      resizableHandles.forEach(handle => {
        handle.removeEventListener('mouseup', handlePanelResize);
        handle.removeEventListener('touchend', handlePanelResize);
      });
    };
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Video Call Section */}
        <ResizablePanel defaultSize={50} minSize={30} maxSize={60} className="h-full">
          <Meet roomId={roomId} />
        </ResizablePanel>

        <ResizableHandle 
          withHandle 
          className="bg-gray-600 hover:bg-gray-500 cursor-col-resize" 
          data-resize-handle="true"
        />

        {/* Collaborative Code Editor Section */}
        <ResizablePanel defaultSize={50} minSize={30} className="h-full">
          <CodeEditor roomId={roomId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default InterviewRoom;