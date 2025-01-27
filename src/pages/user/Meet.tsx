import CodeEditor from "../../components/user/Meet/codeEditer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";

function Meet() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[400px] w-full rounded-lg border"
    >
      {/* Video Call Panel */}
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full w-full items-center justify-center bg-gray-100 p-6">
          <div className="h-full w-full bg-black flex items-center justify-center rounded-md">
            <span className="text-white font-semibold">Video Call</span>
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Code Editor Panel */}
      <ResizablePanel defaultSize={50}>
        <div className="h-full w-full p-0">
          {/* Make the CodeEditor take full width and height */}
          <CodeEditor />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default Meet;
