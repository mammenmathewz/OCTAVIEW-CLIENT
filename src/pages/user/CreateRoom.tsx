import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";

const CreateRoom = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomId = uuidv4();
    navigate(`/meet/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      navigate(`/meet/${roomId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">WebRTC Video Call</h1>
      <div className="flex gap-2">
        <button onClick={createRoom} className="px-4 py-2 bg-blue-500 text-white rounded">Create Room</button>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={joinRoom} className="px-4 py-2 bg-green-500 text-white rounded">Join Room</button>
      </div>
    </div>
  );
};

export default CreateRoom;

