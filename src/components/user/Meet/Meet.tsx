import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { IconMusic, IconMusicOff, IconVideo, IconVideoOff, IconPhoneOff } from "@tabler/icons-react";

declare global {
  interface Window {
    peerConnection: RTCPeerConnection | null;
  }
}

const socket = io("https://server.octaview.tech", {
  transports: ["websocket"],
  reconnection: true,
});

const Meet = ({ roomId }: { roomId: string }) => {
  const navigate = useNavigate();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>("");
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [connectionState, setConnectionState] = useState<string>("new");

  useEffect(() => {
    if (!roomId) {
      navigate("/");
      return;
    }
  
    const initializePeerConnection = async () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
  
      try {
        const iceServers = [
          // Public STUN servers (help with NAT traversal)
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
          // Your TURN servers (fallback for more difficult NAT situations)
          {
            urls: "turn:global.relay.metered.ca:443",
            username: "3e80be6ddc838075dfff6666",
            credential: "zAEDcjL7uGfwlNVT",
          },
          {
            urls: "turns:global.relay.metered.ca:443?transport=tcp",
            username: "3e80be6ddc838075dfff6666",
            credential: "zAEDcjL7uGfwlNVT",
          },
        ];
  
        console.log("Using ICE servers:", iceServers);
  
        const config: RTCConfiguration = {
          iceServers,
          iceTransportPolicy: "all", // Try direct connections first, fall back to relay
          iceCandidatePoolSize: 10, // Increase candidate gathering
        };
  
        // Create the RTCPeerConnection
        const pc = new RTCPeerConnection(config);
        peerConnection.current = pc;
        
        // Immediately expose to window for debugging
        window.peerConnection = pc;
  
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("Sending ICE candidate:", event.candidate);
            socket.emit("ice-candidate", { roomId, candidate: event.candidate });
          }
        };
  
        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };
  
        pc.onconnectionstatechange = () => {
          const state = pc.connectionState || "unknown";
          console.log("Connection state:", state);
          setConnectionState(state);
          setIsConnected(state === "connected");
  
          if (state === "failed" || state === "disconnected") {
            setError(`Connection ${state}. You might need to refresh and try again.`);
          }
        };
  
        pc.onicegatheringstatechange = () => {
          console.log("ICE gathering state:", pc.iceGatheringState);
        };
  
        pc.oniceconnectionstatechange = () => {
          const iceState = pc.iceConnectionState;
          console.log("ICE connection state:", iceState);
  
          if (iceState === "failed") {
            setError("Connection failed. Please check your network and try again.");
          } else if (iceState === "disconnected") {
            setError("Connection temporarily disconnected. Attempting to reconnect...");
          }
        };
      } catch (error) {
        console.error("Failed to initialize peer connection:", error);
        setError("Failed to initialize connection. Please try again.");
      }
    };
  
    const startCall = async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
  
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current;
        }
  
        await initializePeerConnection();
  
        if (peerConnection.current && localStream.current) {
          localStream.current.getTracks().forEach((track) => {
            peerConnection.current?.addTrack(track, localStream.current!);
          });
        }
  
        socket.emit("join-room", roomId);
      } catch (err) {
        console.error("Error starting call:", err);
        setError("Failed to access camera/microphone. Please ensure permissions are granted.");
      }
    };
  
    // Socket event handlers
    socket.on("user-joined", async () => {
      console.log("User joined room:", roomId);
      try {
        if (peerConnection.current) {
          const offer = await peerConnection.current.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
            iceRestart: true // Force ICE restart to get fresh candidates
          });
          await peerConnection.current.setLocalDescription(offer);
          console.log("Created and set local offer", offer);
          socket.emit("offer", { roomId, offer });
        }
      } catch (error) {
        console.error("Error creating offer:", error);
        setError("Failed to create connection offer. Please try again.");
      }
    });

    socket.on("offer", async ({ offer }) => {
      console.log("Received offer", offer);
      try {
        if (peerConnection.current) {
          // Force restart ICE gathering to improve connection chances
          if (peerConnection.current.signalingState !== "stable") {
            console.log("Signaling state not stable, resetting connection");
            await Promise.all([
              peerConnection.current.setLocalDescription({type: "rollback"}),
              peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer))
            ]);
          } else {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
          }
          
          const answer = await peerConnection.current.createAnswer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
          });
          console.log("Created answer", answer);
          await peerConnection.current.setLocalDescription(answer);
          socket.emit("answer", { roomId, answer });
        }
      } catch (error) {
        console.error("Error handling offer:", error);
        setError("Failed to handle connection offer. Please try again.");
      }
    });

    socket.on("answer", async ({ answer }) => {
      console.log("Received answer");
      try {
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } catch (error) {
        console.error("Error handling answer:", error);
        setError("Failed to handle connection answer. Please try again.");
      }
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      console.log("Received ICE candidate", candidate);
      try {
        if (peerConnection.current && peerConnection.current.remoteDescription) {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("Added ICE candidate successfully");
        } else {
          console.log("Queuing ICE candidate, remote description not set yet");
          // Store candidates received before remote description is set
          // You could implement a queue here to handle this case
        }
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    });

    socket.on("user-disconnected", () => {
      console.log("Remote user disconnected");
      setIsConnected(false);
      setConnectionState("disconnected");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });
  
    startCall();
  
    return () => {
      localStream.current?.getTracks().forEach((track) => track.stop());
      if (peerConnection.current) {
        peerConnection.current.close();
        window.peerConnection = null; // Clean up the global reference
      }
      socket.emit("leave-room", roomId);
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-disconnected");
    };
  }, [roomId, navigate]);
  

  const toggleMic = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setMicEnabled((prev) => !prev);
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setVideoEnabled((prev) => !prev);
    }
  };

  const endCall = () => {
    navigate("/");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 text-white overflow-hidden">
      <h1 className="absolute top-4 left-4 z-10 text-lg font-semibold">Room: {roomId}</h1>
      {error && (
        <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
          {error}
        </div>
      )}

      <div className="relative w-full h-full max-h-[calc(100vh-100px)]">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full max-h-[calc(100vh-100px)] object-cover rounded-lg border-2 border-gray-700"
        />

        {!isConnected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
            <div className="text-center p-4">
              <div className="mb-4 text-xl font-semibold">Waiting for someone to join...</div>
              <div className="text-sm text-gray-300">Share this room ID: {roomId}</div>
              <div className="mt-4 text-xs text-gray-400">Connection state: {connectionState}</div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-20 right-6 z-10 w-28 h-20 bg-black rounded-lg border-2 border-gray-600 overflow-hidden">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        {!videoEnabled && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center">
            <span>Video Off</span>
          </div>
        )}
      </div>

      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4 bg-gray-800 bg-opacity-80 px-6 py-3 rounded-full z-20 shadow-lg">
        <button
          onClick={toggleMic}
          className={`p-3 ${micEnabled ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-500"} rounded-full transition-colors`}
          aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"}
        >
          {micEnabled ? <IconMusic size={24} /> : <IconMusicOff size={24} />}
        </button>
        <button
          onClick={toggleVideo}
          className={`p-3 ${videoEnabled ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-500"} rounded-full transition-colors`}
          aria-label={videoEnabled ? "Turn off camera" : "Turn on camera"}
        >
          {videoEnabled ? <IconVideo size={24} /> : <IconVideoOff size={24} />}
        </button>
        <button
          onClick={endCall}
          className="p-3 bg-red-600 hover:bg-red-500 rounded-full transition-colors"
          aria-label="End call"
        >
          <IconPhoneOff size={24} />
        </button>
      </div>

      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-300 z-10">
        Status: {isConnected ? "Connected" : `Waiting (${connectionState})`}
      </div>
    </div>
  );
};

export default Meet;