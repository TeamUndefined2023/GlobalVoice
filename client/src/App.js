import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

function App() {
  const videoRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [predictedWord, setPredictedWord] = useState('');

  useEffect(() => {
    // Initialize video stream
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => videoRef.current.srcObject = stream)
      .catch(error => console.error('Error accessing camera:', error));

    // Set up WebSocket connection
    const socket = io('http://127.0.0.1:5000');  // Replace with your backend URL
    setSocket(socket);

    socket.on('predicted_word', data => {
      setPredictedWord(data.predicted_word);
    });

    return () => {
      socket.close();
    };
  }, []);

  const sendFrameForPrediction = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const imageBlob = canvas.toDataURL('image/jpeg');

    // Send frame data to the backend using WebSocket
    socket.emit('send_frame', { image: imageBlob });
  };

  return (
    <div>
      <h1>Video Call with Real-time ASL Gesture Prediction</h1>
      <video ref={videoRef} autoPlay playsInline />
      <button onClick={sendFrameForPrediction}>Predict Gesture</button>
      <div>Predicted Word: {predictedWord}</div>
    </div>
  );
}

export default App;
