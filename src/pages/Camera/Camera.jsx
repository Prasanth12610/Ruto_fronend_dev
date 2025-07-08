import React, { useRef, useState } from 'react';
import {
  Camera as CameraIcon,
  Maximize2,
  X,
  RefreshCw
} from 'lucide-react';
import './Camera.css';

export default function Camera() {
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const videoRef3 = useRef(null);
  const canvasRef = useRef(null);

  const [started, setStarted] = useState(false);
  const [image, setImage] = useState(null);
  const [servo, setServo] = useState({ horizontal: 90, vertical: 90 });
  const [activeCamera, setActiveCamera] = useState('ALL');
  const [selectedCamera, setSelectedCamera] = useState('ALL');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);  // NEW

  const cameraAPIMap = {
    'camera-1': 'https://100.68.107.103:7123/camera.mjpg',
    'camera-2': '',
    'camera-3': ''
  };

  const Cors = async () => {
    window.open('https://100.68.107.103:7123/camera_verified', '_blank');
    try {
      const response = await fetch('https://100.68.107.103:7123/camera_verified', {
        method: 'GET',
        mode: 'cors'
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('Verification API Response:', data);

      if (data.ok && data.status === 'verified') {
        alert('Camera is verified!');
      } else {
        alert('Camera verification failed.');
      }
    } catch (error) {
      console.error('Verification API Error:', error);
      alert('Verifying camera permission.');
    }
  };

  const startStreaming = async () => {
    setIsConnecting(true);

    try {
      const response = await fetch('http://100.68.107.103:8000/start-camera', {
        method: 'POST'
      });

      const data = await response.json();
      console.log('Start Camera Response:', data);

      setTimeout(() => {
        setIsConnecting(false);

        if (response.ok && data.status === 'success') {
          setStarted(true);
          alert('Camera script started successfully');
        } else {
          alert('Failed to start camera script');
        }
      }, 5000);

    } catch (error) {
      console.error('Error starting camera:', error);
      setIsConnecting(false);
      alert('Error contacting backend');
    }
  };

  const stopStreaming = async () => {
    setIsStopping(true);  // show stop loading overlay

    try {
      const response = await fetch('http://100.68.107.103:8000/stop-camera', {
        method: 'POST'
      });

      const data = await response.json();
      console.log('Stop Camera Response:', data);

      setTimeout(() => {
        setIsStopping(false);

        if (response.ok && data.status === 'success') {
          alert('Camera script stopped successfully');
          setStarted(false);
        } else {
          alert('Failed to stop camera script');
        }
      }, 5000);

    } catch (error) {
      console.error('Error stopping camera:', error);
      setIsStopping(false);
      alert('Error contacting backend');
    }
  };

  const capture = () => {
    const video = videoRef1.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    setImage(canvas.toDataURL('image/png'));
  };

  const handleServoChange = (axis) => (e) => {
    const val = parseInt(e.target.value, 10);
    setServo(s => ({ ...s, [axis]: val }));
    console.log(`Servo ${axis}: ${val}°`);
  };

  const toggleFullscreen = (cameraIndex) => {
    if (activeCamera === cameraIndex) {
      setActiveCamera('ALL');
      setSelectedCamera('ALL');
    } else {
      setActiveCamera(cameraIndex);
      setSelectedCamera(cameraIndex);
    }
  };

  const handleDropdownChange = (e) => {
    const selected = e.target.value;
    setSelectedCamera(selected);
    setActiveCamera(selected);
    setStarted(true);
  };

  return (
    <div className="camera-container">
      <div className="camera-panel">
        <div className="camera-header">
          <h2>Camera Feed</h2>
          <div className="camera-header-buttons">
            <button className="camera-capture-button" onClick={startStreaming}>
              Start-Streaming
            </button>
            <button className="camera-capture-button" onClick={stopStreaming}>
              Stop-Streaming
            </button>
            <button className="refresh-icon-button" onClick={Cors} title="Refresh">
              <RefreshCw size={16} />
            </button>
          </div>
          <div className="camera-controls">
            <select
              className="camera-select"
              value={selectedCamera}
              onChange={handleDropdownChange}
            >
              <option value="ALL">ALL</option>
              <option value="camera-1">Camera 1</option>
              <option value="camera-2">Camera 2</option>
              <option value="camera-3">Camera 3</option>
            </select>
            <button className="camera-capture-button" onClick={capture}>
              <CameraIcon size={20} /> Capture
            </button>
          </div>
        </div>

        <div className="camera-feeds">
          {['camera-1', 'camera-2', 'camera-3'].map((camera) => {
            if (activeCamera === 'ALL' || activeCamera === camera) {
              const hasApi = cameraAPIMap[camera]?.trim() !== '';

              return (
                <div
                  className={`camera-feed ${camera} ${activeCamera === camera ? 'fullscreen' : ''}`}
                  onClick={() => toggleFullscreen(camera)}
                  key={camera}
                >
                  <div className="camera-feed-container">
                    {/* Show connecting overlay on start */}
                    {isConnecting && hasApi && (
                      <div className="camera-connecting-overlay">
                        <div className="mini-spinner" />
                        Connecting...
                      </div>
                    )}

                    {/* Show stopping overlay on stop */}
                    {isStopping && hasApi && (
                      <div className="camera-connecting-overlay">
                        <div className="mini-spinner" />
                        Disconnecting...
                      </div>
                    )}

                    {started && hasApi ? (
                      <img
                        src={cameraAPIMap[camera]}
                        alt={`${camera} stream`}
                        className="camera-stream"
                      />
                    ) : (
                      <div className="camera-placeholder">Select Camera to Start</div>
                    )}

                    <div className="fullscreen-icon">
                      {activeCamera === camera ? <X size={20} /> : <Maximize2 size={20} />}
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {image && (
          <div className="camera-feed">
            <img src={image} alt="captured" className="camera-stream" />
          </div>
        )}
      </div>

      <div className="servo-panel">
        <h3>Dual Servo Control</h3>

        <div className="servo-control">
          <label>Horizontal: {servo.horizontal}°</label>
          <input
            type="range"
            min="0"
            max="180"
            value={servo.horizontal}
            onChange={handleServoChange('horizontal')}
          />
        </div>

        <div className="servo-control">
          <label>Vertical: {servo.vertical}°</label>
          <input
            type="range"
            min="0"
            max="180"
            value={servo.vertical}
            onChange={handleServoChange('vertical')}
          />
        </div>
      </div>
    </div>
  );
}
