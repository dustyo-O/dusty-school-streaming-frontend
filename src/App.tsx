import React, { useRef } from 'react';

import './App.css';

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<Promise<MediaStream>>();
  const recorderRef = useRef<MediaRecorder>();

  const handleStart = () => {
    streamRef.current = navigator.mediaDevices.getUserMedia({ video: true });

    streamRef.current.then((stream) => {
      if (!videoRef.current) {
        return;
      }
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        if (!videoRef.current) {
          return;
        }

        videoRef.current.play();
      };

      recorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp9',
      });

      recorderRef.current.ondataavailable = (event) => {
        console.log('Записался кусок');

        const file = new File([event.data], 'video.webm');
        const data = new FormData();

        data.append('id', 'test');
        data.append('video', file);

        fetch('http://localhost:3000/files/_upload', {
          method: 'POST',
          body: data
        });
      };

      recorderRef.current.start(10000);
    });
  };

  return (
    <div className="App">
      <video ref={videoRef}></video>
      <button onClick={handleStart}>Start</button>
    </div>
  );
}

export default App;
