import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { IconMusic, IconMusicOff, IconVideo, IconVideoOff, IconPhoneOff } from "@tabler/icons-react";

declare global {
  interface Window {
    peerConnection: RTCPeerConnection | null;
  }
}

// Create the socket connection outside the component to prevent multiple connections
const socket = io("https://server.octaview.tech", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
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
  // Store pending ICE candidates that arrive before remote description is set
  const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);

  useEffect(() => {
    if (!roomId) {
      navigate("/");
      return;
    }

    // Check if socket is connected
    if (!socket.connected) {
      console.log("Socket not connected, connecting now...");
      socket.connect();
    }
    
    const initializePeerConnection = async () => {
      if (peerConnection.current) {
        console.log("Closing existing peer connection");
        peerConnection.current.close();
      }
  
      try {
        // Enhanced ICE server configuration with multiple STUN and TURN servers
        const iceServers = [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          // Add more diversity with non-Google STUN servers
          { urls: "stun:stun.stunprotocol.org:3478" },
          { urls: "stun:openrelay.metered.ca:80" },
          // TURN servers are critical for NAT traversal
          {
            urls: "turn:global.relay.metered.ca:80",
            username: "3e80be6ddc838075dfff6666",
            credential: "zAEDcjL7uGfwlNVT",
          },
          {
            urls: "turn:global.relay.metered.ca:443",
            username: "3e80be6ddc838075dfff6666",
            credential: "zAEDcjL7uGfwlNVT",
          },
          {
            urls: "turn:global.relay.metered.ca:80?transport=tcp",
            username: "3e80be6ddc838075dfff6666",
            credential: "zAEDcjL7uGfwlNVT",
          },
          {
            urls: "turn:global.relay.metered.ca:443?transport=tcp",
            username: "3e80be6ddc838075dfff6666",
            credential: "zAEDcjL7uGfwlNVT",
          },
        ];
  
        console.log("Initializing peer connection with ICE servers:", iceServers);
  
        const config: RTCConfiguration = {
          iceServers,
          iceTransportPolicy: "all", // Try all connection methods
          iceCandidatePoolSize: 10,
          bundlePolicy: "max-bundle", // Bundle ICE candidates when possible
          rtcpMuxPolicy: "require", // This is the default and generally better for NAT traversal
        };
  
        // Create the RTCPeerConnection
        const pc = new RTCPeerConnection(config);
        peerConnection.current = pc;
        
        // Expose for debugging
        window.peerConnection = pc;
  
        // Clear the ICE candidates queue
        iceCandidatesQueue.current = [];
        
        // When we get an ICE candidate locally, send it to the remote peer
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("Generated local ICE candidate:", event.candidate.candidate);
            socket.emit("ice-candidate", { 
              roomId, 
              candidate: event.candidate 
            });
          } else {
            console.log("All ICE candidates have been generated");
          }
        };
  
        // When ICE gathering state changes
        pc.onicegatheringstatechange = () => {
          console.log("ICE gathering state changed to:", pc.iceGatheringState);
          
          // When gathering is complete, log a summary
          if (pc.iceGatheringState === 'complete') {
            console.log("ICE gathering complete, all candidates collected");
          }
        };
        
        // When ICE connection state changes
        pc.oniceconnectionstatechange = () => {
          const iceState = pc.iceConnectionState;
          console.log("ICE connection state changed to:", iceState);
  
          // Handle different ICE states
          switch (iceState) {
            case "connected":
              console.log("ICE connected successfully!");
              setError("");
              break;
            case "failed":
              console.error("ICE connection failed");
              setError("Connection failed. Please check your network and try again.");
              // Try ICE restart if connection fails
              if (pc.signalingState === "stable") {
                console.log("Attempting ICE restart...");
                pc.restartIce();
              }
              break;
            case "disconnected":
              console.log("ICE connection disconnected, may recover automatically");
              setError("Connection temporarily disconnected. Attempting to reconnect...");
              // May recover automatically, but can also try to restart ICE
              setTimeout(() => {
                if (pc.iceConnectionState === "disconnected") {
                  console.log("Still disconnected after timeout, restarting ICE");
                  pc.restartIce();
                }
              }, 3000);
              break;
          }
        };
  
        // When the overall connection state changes
        pc.onconnectionstatechange = () => {
          const state = pc.connectionState || "unknown";
          console.log("Connection state changed to:", state);
          setConnectionState(state);
          
          if (state === "connected") {
            setIsConnected(true);
            setError("");
            // Try to apply any queued candidates once connected
            processIceCandidateQueue();
          } else {
            setIsConnected(state === 'connected' as RTCPeerConnectionState);
            
            if (state === "failed" || state === "closed") {
              setError(`Connection ${state}. You might need to refresh and try again.`);
            }
          }
        };
  
        // When we receive tracks from the remote peer
        pc.ontrack = (event) => {
          console.log("Received remote track:", event.track.kind);
          if (remoteVideoRef.current && event.streams && event.streams[0]) {
            console.log("Setting remote stream to video element");
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };
        
        return pc;
      } catch (error) {
        console.error("Failed to initialize peer connection:", error);
        setError("Failed to initialize connection. Please try again.");
        return null;
      }
    };
    
    // Process any ICE candidates that were received before the remote description was set
    const processIceCandidateQueue = async () => {
      if (peerConnection.current && peerConnection.current.remoteDescription) {
        console.log(`Processing queued ICE candidates (${iceCandidatesQueue.current.length})`);
        
        while (iceCandidatesQueue.current.length > 0) {
          const candidate = iceCandidatesQueue.current.shift();
          try {
            await peerConnection.current.addIceCandidate(candidate!);
            console.log("Added queued ICE candidate");
          } catch (error) {
            console.error("Error adding queued ICE candidate:", error);
          }
        }
      }
    };
  
    const startCall = async () => {
      try {
        console.log("Requesting user media...");
        localStream.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        
        console.log("Got local media stream");
  
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current;
        }
  
        const pc = await initializePeerConnection();
  
        if (pc && localStream.current) {
          // Add all local tracks to the peer connection
          localStream.current.getTracks().forEach((track) => {
            console.log(`Adding local ${track.kind} track to peer connection`);
            pc.addTrack(track, localStream.current!);
          });
        }
  
        console.log("Emitting join-room for roomId:", roomId);
        socket.emit("join-room", roomId);
      } catch (err) {
        console.error("Error starting call:", err);
        setError("Failed to access camera/microphone. Please ensure permissions are granted.");
      }
    };
  
    // Socket event handlers
    socket.on("user-joined", async () => {
      console.log("Remote user joined room:", roomId);
      try {
        if (peerConnection.current) {
          console.log("Creating offer as initiator");
          const offer = await peerConnection.current.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
            iceRestart: true 
          });
          
          console.log("Setting local description (offer)");
          await peerConnection.current.setLocalDescription(offer);
          
          console.log("Sending offer to remote peer");
          socket.emit("offer", { roomId, offer });
        }
      } catch (error) {
        console.error("Error creating offer:", error);
        setError("Failed to create connection offer. Please try again.");
      }
    });

    socket.on("offer", async ({ offer }) => {
      console.log("Received offer from remote peer");
      try {
        if (!peerConnection.current) {
          console.log("No peer connection, initializing one first");
          await initializePeerConnection();
        }
        
        if (peerConnection.current) {
          const signalingState = peerConnection.current.signalingState;
          console.log("Current signaling state:", signalingState);
          
          // Handle the case where we might receive an offer while not in stable state
          if (signalingState !== "stable") {
            console.log("Signaling state not stable, rolling back");
            await Promise.all([
              peerConnection.current.setLocalDescription({type: "rollback"}),
              peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer))
            ]);
          } else {
            console.log("Setting remote description from offer");
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
          }
          
          console.log("Creating answer");
          const answer = await peerConnection.current.createAnswer();
          
          console.log("Setting local description (answer)");
          await peerConnection.current.setLocalDescription(answer);
          
          console.log("Sending answer to remote peer");
          socket.emit("answer", { roomId, answer });
          
          // Process any ICE candidates that came before the remote description was set
          processIceCandidateQueue();
        }
      } catch (error) {
        console.error("Error handling offer:", error);
        setError("Failed to handle connection offer. Please try again.");
      }
    });

    socket.on("answer", async ({ answer }) => {
      console.log("Received answer from remote peer");
      try {
        if (peerConnection.current) {
          console.log("Setting remote description from answer");
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
          console.log("Remote description set successfully");
          
          // Process any ICE candidates that came before the remote description was set
          processIceCandidateQueue();
        }
      } catch (error) {
        console.error("Error handling answer:", error);
        setError("Failed to handle connection answer. Please try again.");
      }
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      console.log("Received ICE candidate from remote peer");
      
      try {
        const iceCandidate = new RTCIceCandidate(candidate);
        
        if (peerConnection.current) {
          // Only add ice candidates after the remote description has been set
          if (peerConnection.current.remoteDescription && peerConnection.current.remoteDescription.type) {
            console.log("Adding remote ICE candidate");
            await peerConnection.current.addIceCandidate(iceCandidate);
            console.log("Remote ICE candidate added successfully");
          } else {
            console.log("Queueing ICE candidate until remote description is set");
            iceCandidatesQueue.current.push(iceCandidate);
          }
        }
      } catch (error) {
        console.error("Error handling ICE candidate:", error);
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

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setError("Server connection error. Please check your internet connection.");
    });
    
    socket.on("connect", () => {
      console.log("Socket connected successfully");
      setError("");
    });
    
    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, reconnect manually
        socket.connect();
      }
    });
  
    // Start the call process
    startCall();
  
    // Cleanup function when component unmounts
    return () => {
      console.log("Cleaning up Meet component");
      
      // Stop all tracks in the local stream
      localStream.current?.getTracks().forEach((track) => {
        console.log(`Stopping ${track.kind} track`);
        track.stop();
      });
      
      // Close the peer connection
      if (peerConnection.current) {
        console.log("Closing peer connection");
        peerConnection.current.close();
        window.peerConnection = null;
      }
      
      // Leave the room
      console.log("Emitting leave-room for roomId:", roomId);
      socket.emit("leave-room", roomId);
      
      // Remove all socket listeners to prevent memory leaks
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-disconnected");
      socket.off("connect_error");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [roomId, navigate]);
  
  // Toggle microphone
  const toggleMic = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        console.log(`Microphone ${track.enabled ? 'enabled' : 'disabled'}`);
      });
      setMicEnabled((prev) => !prev);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
        console.log(`Video ${track.enabled ? 'enabled' : 'disabled'}`);
      });
      setVideoEnabled((prev) => !prev);
    }
  };

  // End call and navigate away
  const endCall = () => {
    navigate("/");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 text-white overflow-hidden">
      <h1 className="absolute top-4 left-4 z-10 text-lg font-semibold">Room: {roomId}</h1>
      
      {/* Error notification */}
      {error && (
        <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
          {error}
        </div>
      )}

      {/* Remote video (main display) */}
      <div className="relative w-full h-full max-h-[calc(100vh-100px)]">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full max-h-[calc(100vh-100px)] object-cover rounded-lg border-2 border-gray-700"
        />

        {/* Waiting screen when not connected */}
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

      {/* Local video (small overlay) */}
      <div className="absolute bottom-20 right-6 z-10 w-28 h-20 bg-black rounded-lg border-2 border-gray-600 overflow-hidden">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        {!videoEnabled && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center">
            <span>Video Off</span>
          </div>
        )}
      </div>

      {/* Controls bar */}
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

      {/* Status indicator */}
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-300 z-10">
        Status: {isConnected ? "Connected" : `Waiting (${connectionState})`}
      </div>
    </div>
  );
};

export default Meet;