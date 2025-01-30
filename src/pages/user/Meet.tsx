import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io, { Socket } from "socket.io-client";

const Meet = () => {
  const { roomId } = useParams();
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);
  const navigate = useNavigate();
  
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  
  useEffect(() => {
    const socketConnection = io("http://localhost:5000");
    setSocket(socketConnection);

    socketConnection.emit("join-room", roomId);

    socketConnection.on("offer", handleOffer);
    socketConnection.on("answer", handleAnswer);
    socketConnection.on("candidate", handleCandidate);
    
    // Fetch available devices
    navigator.mediaDevices.enumerateDevices().then(devices => {
      setVideoDevices(devices.filter(device => device.kind === "videoinput"));
      setAudioDevices(devices.filter(device => device.kind === "audioinput"));
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [roomId]);

  const startVideoCall = async (videoDeviceId: string, audioDeviceId: string) => {
    try {
      const constraints = {
        video: {
          deviceId: videoDeviceId ? { exact: videoDeviceId } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
          facingMode: "user"
        },
        audio: {
          deviceId: audioDeviceId ? { exact: audioDeviceId } : undefined,
          echoCancellation: true,
          noiseSuppression: true
        }
      };

      // Get media devices
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Assign to video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      console.log("Video call started successfully");
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const handleOffer = async (data: { offer: RTCSessionDescriptionInit }) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnectionRef.current = peerConnection;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit("candidate", { roomId, candidate: event.candidate });
        }
      };

      if (socket) socket.emit("answer", { roomId, answer });
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  };

  const handleAnswer = async (data: { answer: RTCSessionDescriptionInit }) => {
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      processPendingCandidates();
    }
  };

  const handleCandidate = (data: { candidate: RTCIceCandidateInit | undefined }) => {
    if (peerConnectionRef.current && data.candidate) {
      if (!peerConnectionRef.current.remoteDescription) {
        pendingCandidates.current.push(data.candidate);
      } else {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(console.error);
      }
    }
  };

  const processPendingCandidates = () => {
    if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
      while (pendingCandidates.current.length) {
        const candidate = pendingCandidates.current.shift();
        if (candidate) {
          peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center">
        <video ref={localVideoRef} autoPlay muted className="w-64 h-48 bg-black rounded-md shadow-md" />
        <video ref={remoteVideoRef} autoPlay className="w-64 h-48 bg-black rounded-md shadow-md" />
        
        {/* Video Device Selection */}
        <select
          onChange={(e) => startVideoCall(e.target.value, "")}
          defaultValue=""
        >
          <option value="">Select Video Device</option>
          {videoDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>

        {/* Audio Device Selection */}
        <select
          onChange={(e) => startVideoCall("", e.target.value)}
          defaultValue=""
        >
          <option value="">Select Audio Device</option>
          {audioDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>

        <button onClick={() => startVideoCall("", "")}>Start Video Call</button>
      </div>
    </div>
  );
};

export default Meet;
