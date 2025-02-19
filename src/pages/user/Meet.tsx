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
      const config: RTCConfiguration = {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          {
            urls: "turn:turn.anyfirewall.com:3478",
            username: "webrtc",
            credential: "webrtc"
          }
        ],
        iceCandidatePoolSize: 10,
      };

      peerConnection.current = new RTCPeerConnection(config);

      // Log state changes for debugging
      peerConnection.current.oniceconnectionstatechange = () => {
        console.log("ICE Connection State:", peerConnection.current?.iceConnectionState);
      };

      peerConnection.current.onconnectionstatechange = () => {
        console.log("Connection State:", peerConnection.current?.connectionState);
      };

      peerConnection.current.onsignalingstatechange = () => {
        console.log("Signaling State:", peerConnection.current?.signalingState);
      };

      // Handle remote stream
      peerConnection.current.ontrack = (event) => {
        console.log("Received remote track:", event.streams[0]);
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      return peerConnection.current;
    };

    const startCall = async () => {
      try {
        console.log("Starting call initialization...");
        
        // Get local media
        localStream.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        console.log("Got local stream:", localStream.current);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current;
        }

        const pc = initializePeerConnection();

        // Add local tracks to peer connection
        localStream.current.getTracks().forEach(track => {
          if (localStream.current) {
            pc.addTrack(track, localStream.current);
          }
        });

        // Join room
        socket.emit("join-room", roomId);
        setIsConnected(true);

      } catch (err) {
        console.error("Error in startCall:", err);
        setError("Failed to start video call. Please check your camera and microphone permissions.");
      }
    };

    // Socket event handlers
    const handleSocketEvents = () => {
      socket.on("user-joined", async () => {
        console.log("New user joined - creating offer");
        try {
          if (peerConnection.current) {
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);
            socket.emit("offer", { roomId, offer });
          }
        } catch (err) {
          console.error("Error creating offer:", err);
        }
      });

      socket.on("offer", async ({ offer }) => {
        console.log("Received offer - creating answer");
        try {
          if (peerConnection.current) {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            socket.emit("answer", { roomId, answer });
          }
        } catch (err) {
          console.error("Error handling offer:", err);
        }
      });

      socket.on("answer", async ({ answer }) => {
        console.log("Received answer");
        try {
          if (peerConnection.current) {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
          }
        } catch (err) {
          console.error("Error handling answer:", err);
        }
      });

      // ICE candidate handling
      peerConnection.current!.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", { roomId, candidate: event.candidate });
        }
      };

      socket.on("ice-candidate", async ({ candidate }) => {
        try {
          if (peerConnection.current) {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      });
    };

    startCall().then(() => {
      handleSocketEvents();
    });

    // Cleanup function
    return () => {
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
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