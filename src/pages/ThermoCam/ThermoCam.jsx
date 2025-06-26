import React, { useRef, useState } from 'react';
import {
  Camera as CameraIcon,
  Maximize2,
  X,
  RefreshCw,
  ThermometerSun,
  Minimize2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import './ThermoCam.css';

export default function MergedCamera() {
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // State
  const [streamingStatus, setStreamingStatus] = useState({
    'camera-1': false,
    'camera-2': false,
    'camera-3': false
  });
  const [image, setImage] = useState(null);
  const [servo, setServo] = useState({ horizontal: 90, vertical: 90 });
  const [activeCamera, setActiveCamera] = useState('ALL');
  const [selectedCamera, setSelectedCamera] = useState('ALL');
  const [connectingStatus, setConnectingStatus] = useState({
    'camera-1': false,
    'camera-2': false,
    'camera-3': false
  });
  const [stoppingStatus, setStoppingStatus] = useState({
    'camera-1': false,
    'camera-2': false,
    'camera-3': false
  });
  const [tempStats, setTempStats] = useState({
    maxTemp: 78.7,
    minTemp: 78.7,
    avgTemp: 78.7,
    centerTemp: 78.7,
  });

  // API endpoints
  const cameraAPIMap = {
    'camera-1': 'https://100.68.107.103:8001/camera.mjpg',
    'camera-2': '',
    'camera-3': ''
  };

  const thermalAPIMap = {
    'camera-1': 'https://100.68.107.103:7123/thermal',
    'camera-2': '',
    'camera-3': ''
  };

  const handleCors = async () => {
    // Open both verification endpoints in new tabs
    window.open('https://100.68.107.103:7123/thermal_verified', '_blank');
    window.open('https://100.68.107.103:8001/camera_verified', '_blank');
    
    try {
      // Make API calls to both verification endpoints
      const [cameraResponse, thermalResponse] = await Promise.all([
        fetch('https://100.68.107.103:8001/camera_verified', { 
          method: 'GET', 
          mode: 'cors' 
        }),
        fetch('https://100.68.107.103:7123/thermal_verified', { 
          method: 'GET', 
          mode: 'cors' 
        })
      ]);

      if (!cameraResponse.ok) throw new Error(`Camera verification HTTP error! status: ${cameraResponse.status}`);
      if (!thermalResponse.ok) throw new Error(`Thermal verification HTTP error! status: ${thermalResponse.status}`);
      
      const [cameraData, thermalData] = await Promise.all([
        cameraResponse.json(),
        thermalResponse.json()
      ]);

      console.log('Verification API Responses:', {
        camera: cameraData,
        thermal: thermalData
      });

    } catch (error) {
      console.error('Verification API Error:', error);
    }
  };

  const startStreaming = async (cameraId) => {
    setConnectingStatus(prev => ({...prev, [cameraId]: true}));

    try {
      // Start both regular and thermal streams
      const [regularResponse, thermalResponse] = await Promise.all([
        fetch('https://100.68.107.103:8000/start-camera', { method: 'POST' }),
        fetch('https://100.68.107.103:8000/start-thermal', { method: 'POST' })
      ]);

      const [regularData, thermalData] = await Promise.all([
        regularResponse.json(),
        thermalResponse.json()
      ]);

      console.log('Start Responses:', { regular: regularData, thermal: thermalData });

      setTimeout(() => {
        setConnectingStatus(prev => ({...prev, [cameraId]: false}));
        setStreamingStatus(prev => ({...prev, [cameraId]: true}));
      }, 5000);

    } catch (error) {
      console.error('Error starting streams:', error);
      setConnectingStatus(prev => ({...prev, [cameraId]: false}));
    }
  };

  const stopStreaming = async (cameraId) => {
    setStoppingStatus(prev => ({...prev, [cameraId]: true}));

    try {
      // Stop both regular and thermal streams
      const [regularResponse, thermalResponse] = await Promise.all([
        fetch('https://100.68.107.103:8000/stop-camera', { method: 'POST' }),
        fetch('https://100.68.107.103:8000/stop-thermal', { method: 'POST' })
      ]);

      const [regularData, thermalData] = await Promise.all([
        regularResponse.json(),
        thermalResponse.json()
      ]);

      console.log('Stop Responses:', { regular: regularData, thermal: thermalData });

      setTimeout(() => {
        setStoppingStatus(prev => ({...prev, [cameraId]: false}));
        setStreamingStatus(prev => ({...prev, [cameraId]: false}));
      }, 5000);

    } catch (error) {
      console.error('Error stopping streams:', error);
      setStoppingStatus(prev => ({...prev, [cameraId]: false}));
    }
  };

  const capture = () => {
    html2canvas(document.body).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      setImage(imgData);
      // Optionally auto-download
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'camera_capture.png';
      link.click();
    });
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
  };

  return (
    <div className="merged-camera-container">
      <div className="merged-camera-panel">
        <div className="merged-camera-header">
          <h2>ThermoCam</h2>
          <div className="merged-camera-controls">
            <button className="merged-camera-button" onClick={capture}>
              <CameraIcon size={20} /> Capture
            </button>
            <button 
              className="refresh-icon-button" 
              onClick={handleCors} 
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        <div className="merged-camera-feeds">
          {['camera-1'].map((camera) => {
            if (activeCamera === 'ALL' || activeCamera === camera) {
              const hasRegularApi = cameraAPIMap[camera]?.trim() !== '';
              const hasThermalApi = thermalAPIMap[camera]?.trim() !== '';
              const isActive = activeCamera === camera;
              const isStreaming = streamingStatus[camera];
              const isConnecting = connectingStatus[camera];
              const isStopping = stoppingStatus[camera];

              return (
                <div
                  className={`merged-camera-feed ${camera} ${isActive ? 'fullscreen' : ''}`}
                  key={camera}
                >
                  <div className="merged-camera-feed-container">
                    {(isConnecting || isStopping) && (hasRegularApi || hasThermalApi) && (
                      <div className="camera-connecting-overlay">
                        <div className="mini-spinner" />
                        {isConnecting ? 'Starting streams...' : 'Stopping streams...'}
                      </div>
                    )}

                    {/* Red X stop button - top right corner */}
                    {isStreaming && (
                      <button 
                        className="stop-stream-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          stopStreaming(camera);
                        }}
                        disabled={isStopping}
                      >
                        <X size={20} />
                      </button>
                    )}

                    {/* Start stream button - centered */}
                    {!isStreaming && !isConnecting && (
                      <button 
                        className="start-stream-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startStreaming(camera);
                        }}
                        disabled={isConnecting || !hasRegularApi}
                      >
                        Start Stream
                      </button>
                    )}

                    <div className="dual-feed-container">
                      <div className="feed-wrapper">
                        <div className="feed-label">
                          <CameraIcon size={16} /> Camera
                        </div>
                        {isStreaming && hasRegularApi ? (
                          <img
                            src={cameraAPIMap[camera]}
                            alt={`${camera} regular stream`}
                            className="merged-camera-stream"
                          />
                        ) : (
                          <div className="merged-camera-placeholder">
                            {hasRegularApi ? 'Camera feed not started' : 'No Camera feed available'}
                          </div>
                        )}
                      </div>

                      <div className="feed-wrapper">
                        <div className="feed-label">
                          <ThermometerSun size={16} /> Thermal
                        </div>
                        {isStreaming && hasThermalApi ? (
                          <>
                            <img
                              src={thermalAPIMap[camera]}
                              alt={`${camera} thermal stream`}
                              className="merged-camera-stream"
                            />
                            <div className="temperature-overlay">
                              <div className="temperature-value">{tempStats.centerTemp}°F</div>
                            </div>
                          </>
                        ) : (
                          <div className="merged-camera-placeholder">
                            {hasThermalApi ? 'Thermal feed not started' : 'No thermal feed available'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Fullscreen button - bottom right */}
                    <button 
                      className="fullscreen-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFullscreen(camera);
                      }}
                    >
                      {isActive ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {image && (
          <div className="merged-camera-feed">
            <img src={image} alt="captured" className="merged-camera-stream" />
          </div>
        )}
      </div>
    </div>
  );
}