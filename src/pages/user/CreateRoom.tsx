import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const createRoom = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/meet/create-room');
      const roomId = response.data.roomId;
      // Navigate to the Meet page with the generated roomId
      navigate(`/meet/${roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create a New Meeting Room</h2>
      <button onClick={createRoom} disabled={loading}>
        {loading ? 'Creating...' : 'Create Room'}
      </button>
    </div>
  );
};

export default CreateRoom;
