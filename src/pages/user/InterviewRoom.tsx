import React from "react";
import { useParams } from "react-router-dom";
import Meet from "../../components/user/Meet/Meet";
import CodeEditor from "../../components/user/Meet/CodeEditer";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "../../components/ui/resizable";

const InterviewRoom = () => {
  const { roomId } = useParams(); // Get roomId from URL

  if (!roomId) return <div className="text-center mt-10">Invalid Room ID</div>;

  return (
    <div className="h-screen w-screen overflow-auto">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Video Call Section */}
        <ResizablePanel defaultSize={50} className="h-full">
          <Meet roomId={roomId} />
        </ResizablePanel>

        <ResizableHandle className="bg-gray-600 hover:bg-gray-500 cursor-col-resize" />

        {/* Collaborative Code Editor Section */}
        <ResizablePanel defaultSize={50} className="h-full">
          <CodeEditor roomId={roomId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default InterviewRoom;
