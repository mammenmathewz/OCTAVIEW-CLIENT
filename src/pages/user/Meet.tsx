import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";

// Create socket connection outside component to prevent multiple connections
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnection: true
});

const Meet = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!roomId) {
      navigate("/");
      return;
    }
  
    const initializePeerConnection = () => {
      if (peerConnection.current) {
        peerConnection.current.close(); // Close any existing connection
      }
  
      const config: RTCConfiguration = {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
        ],
      };
  
      peerConnection.current = new RTCPeerConnection(config);
  
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", { roomId, candidate: event.candidate });
        }
      };
  
      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
    };
  
    const startCall = async () => {
      try {
        if (localStream.current) {
          localStream.current.getTracks().forEach((track) => track.stop());
        }
  
        localStream.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
  
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current;
        }
  
        initializePeerConnection();
  
        localStream.current.getTracks().forEach((track) => {
          peerConnection.current?.addTrack(track, localStream.current!);
        });
  
        socket.emit("join-room", roomId);
        setIsConnected(true);
      } catch (err) {
        console.error("Error starting call:", err);
        setError("Failed to access camera/microphone.");
      }
    };
  
    socket.on("user-joined", async () => {
      if (peerConnection.current) {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer });
      }
    });
  
    socket.on("offer", async ({ offer }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit("answer", { roomId, answer });
      }
    });
  
    socket.on("answer", async ({ answer }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });
  
    socket.on("ice-candidate", async ({ candidate }) => {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
  
    startCall();
  
    return () => {
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }
  
      if (peerConnection.current) {
        peerConnection.current.close();
      }
  
      socket.emit("leave-room", roomId); // Notify the server that the user left
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [roomId, navigate]);
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Video Call Room: {roomId}</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="relative">
          <video 
            ref={localVideoRef}
            autoPlay 
            playsInline 
            muted 
            className="w-80 h-60 border-2 rounded-lg bg-black"
          />
          <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            You
          </span>
        </div>
        <div className="relative">
          <video 
            ref={remoteVideoRef}
            autoPlay 
            playsInline 
            className="w-80 h-60 border-2 rounded-lg bg-black"
          />
          <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            Remote
          </span>
        </div>
      </div>
      <div className="mt-4">
        Connection Status: {isConnected ? "Connected" : "Connecting..."}
      </div>
    </div>
  );
};

export default Meet;