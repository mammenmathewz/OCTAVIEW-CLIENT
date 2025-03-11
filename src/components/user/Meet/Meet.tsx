import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {  useNavigate } from "react-router-dom";
import { IconMusic, IconMusicOff, IconVideo, IconVideoOff, IconPhoneOff } from "@tabler/icons-react";

const socket = io("https://server.octaview.tech", {
  transports: ["websocket"],
  reconnection: true
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
  const pendingCandidates = useRef<RTCIceCandidate[]>([]);

  useEffect(() => {
    if (!roomId) {
      navigate("/");
      return;
    }

    const initializePeerConnection = () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      //udated ice servers to xirsys

      const config: RTCConfiguration = {
        iceServers: [
          { urls: ["stun:ss-turn1.xirsys.com"] },
          {
            username: "BUlATLtKwWzdRro0Wkr0yAVKI9jtAnONM3c7RME-RY55elCsAfa-dO_CYgFLiNLcAAAAAGfQcqNNYW1tZW5NQXRoZXc=",
            credential: "2ff98a68-fe9e-11ef-866a-0242ac140004",
            urls: [
              "turn:ss-turn1.xirsys.com:80?transport=udp",
              "turn:ss-turn1.xirsys.com:3478?transport=udp",
              "turn:ss-turn1.xirsys.com:80?transport=tcp",
              "turn:ss-turn1.xirsys.com:3478?transport=tcp",
              "turns:ss-turn1.xirsys.com:443?transport=tcp",
              "turns:ss-turn1.xirsys.com:5349?transport=tcp",
            ],
          },
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

      // Add connection state change handler
      peerConnection.current.onconnectionstatechange = () => {
        console.log("Connection state:", peerConnection.current?.connectionState);
        setIsConnected(peerConnection.current?.connectionState === 'connected');
      };
    };

    const startCall = async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current;
        }

        initializePeerConnection();

        localStream.current.getTracks().forEach((track) => {
          peerConnection.current?.addTrack(track, localStream.current!);
        });

        socket.emit("join-room", roomId);
      } catch (err) {
        console.error("Error starting call:", err);
        setError("Failed to access camera/microphone.");
      }
    };

    socket.on("user-joined", async () => {
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
      try {
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          socket.emit("answer", { roomId, answer });

          // Process any pending candidates
          while (pendingCandidates.current.length) {
            const candidate = pendingCandidates.current.shift();
            if (candidate) {
              await peerConnection.current.addIceCandidate(candidate);
            }
          }
        }
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    });

    socket.on("answer", async ({ answer }) => {
      try {
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } catch (err) {
        console.error("Error handling answer:", err);
      }
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        if (peerConnection.current?.remoteDescription) {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          // Store candidate if remote description isn't set yet
          pendingCandidates.current.push(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error("Error handling ICE candidate:", err);
      }
    });

    startCall();

    return () => {
      localStream.current?.getTracks().forEach(track => track.stop());
      peerConnection.current?.close();
      socket.emit("leave-room", roomId);
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [roomId, navigate]);

  const toggleMic = () => {
    localStream.current?.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    setMicEnabled(prev => !prev);
  };

  const toggleVideo = () => {
    localStream.current?.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    setVideoEnabled(prev => !prev);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="absolute top-4 left-4 text-lg font-semibold">Room: {roomId}</h1>
      {error && <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded">{error}</div>}

      <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover rounded-lg border-2 border-gray-700" />

      <div className="absolute bottom-20 right-6 w-28 h-20 bg-black rounded-lg border-2 border-gray-600 overflow-hidden">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 bg-gray-800 bg-opacity-80 px-6 py-3 rounded-full">
        <button onClick={toggleMic} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full">
          {micEnabled ? <IconMusic size={24} /> : <IconMusicOff size={24} />}
        </button>
        <button onClick={toggleVideo} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full">
          {videoEnabled ? <IconVideo size={24} /> : <IconVideoOff size={24} />}
        </button>
        <button onClick={() => navigate("/")} className="p-3 bg-red-600 hover:bg-red-500 rounded-full">
          <IconPhoneOff size={24} />
        </button>
      </div>

      <div className="absolute bottom-2 text-sm text-gray-300">
        Status: {isConnected ? "Connected" : "Connecting..."}
      </div>
    </div>
  );
};

export default Meet;