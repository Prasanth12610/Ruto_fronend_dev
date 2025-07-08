import React, { useRef, useState } from 'react';
import { Camera as CameraIcon, Maximize2, X, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import './Thermal.css';

export default function Thermal() {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [servo, setServo] = useState({ horizontal: 90, vertical: 90 });
  const [activeCamera, setActiveCamera] = useState('ALL');
  const [selectedCamera, setSelectedCamera] = useState('ALL');
  const [startedCameras, setStartedCameras] = useState({});
  const [connectingStatus, setConnectingStatus] = useState({}); // 'connecting' | 'disconnecting' | false

  const [tempStats, setTempStats] = useState({
    maxTemp: 0,
    minTemp: 0,
    avgTemp: 0,
    centerTemp: 0,
  });

  const cameraAPIMap = {
    'camera-1': 'https://100.68.107.103:7123/thermal',
    'camera-2': '',
    'camera-3': '',
  };

  const Cors = async () => {
    window.open('https://100.68.107.103:7123/thermal_verified', '_blank');
    try {
      const response = await fetch('https://100.68.107.103:7123/thermal_verified', {
        method: 'GET',
        mode: 'cors',
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('Verification API Response:', data);

      if (data.ok && data.status === 'verified') {
        alert('Thermal Camera is verified!');
      } else {
        alert('Thermal Camera verification failed.');
      }
    } catch (error) {
      console.error('Verification API Error:', error);
      alert('Verifying Thermal camera Permission.');
    }
  };

  const startStreaming = async () => {
    // Show "connecting" for cameras with URLs
    ['camera-1', 'camera-2', 'camera-3'].forEach((cameraKey) => {
      if (cameraAPIMap[cameraKey]) {
        setConnectingStatus((prev) => ({ ...prev, [cameraKey]: 'connecting' }));
        setStartedCameras((prev) => ({ ...prev, [cameraKey]: false })); // hide streams while connecting
      }
    });

    try {
      await fetch('http://100.68.107.103:8001/start-thermal', { method: 'POST' });
    } catch (error) {
      console.error('Error starting thermal stream:', error);
    }

    // After 5 sec, hide overlay and show streams
    setTimeout(() => {
      ['camera-1', 'camera-2', 'camera-3'].forEach((cameraKey) => {
        if (cameraAPIMap[cameraKey]) {
          setConnectingStatus((prev) => ({ ...prev, [cameraKey]: false }));
          setStartedCameras((prev) => ({ ...prev, [cameraKey]: true }));
        }
      });
    }, 5000);
  };

  const stopStreaming = async () => {
    // Show "disconnecting" for cameras with URLs
    ['camera-1', 'camera-2', 'camera-3'].forEach((cameraKey) => {
      if (cameraAPIMap[cameraKey]) {
        setConnectingStatus((prev) => ({ ...prev, [cameraKey]: 'disconnecting' }));
        setStartedCameras((prev) => ({ ...prev, [cameraKey]: false })); // hide streams immediately
      }
    });

    try {
      await fetch('http://100.68.107.103:8001/stop-thermal', { method: 'POST' });
    } catch (error) {
      console.error('Error stopping thermal stream:', error);
    }

    // After 5 sec, hide overlay
    setTimeout(() => {
      ['camera-1', 'camera-2', 'camera-3'].forEach((cameraKey) => {
        setConnectingStatus((prev) => ({ ...prev, [cameraKey]: false }));
      });
    }, 5000);
  };

  const handleServoChange = (axis) => (e) => {
    const val = parseInt(e.target.value, 10);
    setServo((s) => ({ ...s, [axis]: val }));
    console.log(`Servo ${axis}: ${val}°`);
  };

  const toggleFullscreen = (cameraIndex) => {
    if (activeCamera === cameraIndex) {
      setActiveCamera('ALL');
      setSelectedCamera('ALL');
    } else {
      setActiveCamera(cameraIndex);
      setSelectedCamera(cameraIndex);
      if (cameraAPIMap[cameraIndex]) {
        setStartedCameras((prev) => ({ ...prev, [cameraIndex]: true }));
      }
    }
  };

  const handleDropdownChange = (e) => {
    const selected = e.target.value;
    setSelectedCamera(selected);
    setActiveCamera(selected);
    if (selected !== 'ALL' && cameraAPIMap[selected]) {
      setStartedCameras((prev) => ({ ...prev, [selected]: true }));
    }
  };

  const capture = () => {
    html2canvas(document.body).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'full_page_capture.png';
      link.click();
      setImage(imgData);
    });
  };

  return (
    <div className="thermal-container">
      <div className="thermal-panel">
        <div className="thermal-header">
          <h2>Thermal Feed</h2>
          <div className="thermal-header-buttons">
            <button className="thermal-capture-button" onClick={startStreaming}>
              Start-Streaming
            </button>
            <button className="thermal-capture-button" onClick={stopStreaming}>
              Stop-Streaming
            </button>
            <button className="refresh-icon-button" onClick={Cors} title="Refresh">
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="thermal-controls">
            <select
              className="thermal-select"
              value={selectedCamera}
              onChange={handleDropdownChange}
            >
              <option value="ALL">ALL</option>
              <option value="camera-1">Camera 1</option>
              <option value="camera-2">Camera 2</option>
              <option value="camera-3">Camera 3</option>
            </select>
            <button className="thermal-capture-button" onClick={capture}>
              <CameraIcon size={20} /> Capture
            </button>
          </div>
        </div>

        <div className={`thermal-feeds ${activeCamera !== 'ALL' ? 'fullscreen-active' : ''}`}>
          {['camera-1', 'camera-2', 'camera-3'].map((camera) => {
            if (activeCamera === 'ALL' || activeCamera === camera) {
              return (
                <div
                  className={`thermal-feed ${camera} ${activeCamera === camera ? 'fullscreen' : ''}`}
                  key={camera}
                  onClick={() => toggleFullscreen(camera)}
                >
                  <div className="thermal-feed-container" style={{ position: 'relative' }}>
                    {startedCameras[camera] ? (
                      <>
                        <img
                          src={cameraAPIMap[camera]}
                          alt={`${camera} stream`}
                          className="thermal-stream"
                        />
                        {(connectingStatus[camera] === 'connecting' ||
                          connectingStatus[camera] === 'disconnecting') && (
                          <div className="camera-connecting-overlay">
                            <div className="mini-spinner" />
                            {connectingStatus[camera] === 'connecting'
                              ? 'Connecting...'
                              : 'Disconnecting...'}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Show overlay even when not started but status is connecting/disconnecting */}
                        {(connectingStatus[camera] === 'connecting' ||
                          connectingStatus[camera] === 'disconnecting') ? (
                          <div className="camera-connecting-overlay">
                            <div className="mini-spinner" />
                            {connectingStatus[camera] === 'connecting'
                              ? 'Connecting...'
                              : 'Disconnecting...'}
                          </div>
                        ) : (
                          <div className="thermal-placeholder">
                            Click to Start {camera.replace('-', ' ')}
                          </div>
                        )}
                      </>
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
          <div className="thermal-feed">
            <img src={image} alt="captured" className="thermal-stream" />
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

        <div className="thermal-analysis">
          <h3 className="thermal-analysis-title">Temperature Analysis</h3>
          <div className="thermal-stats">
            <div className="thermal-stat">
              <span>Maximum Temp:</span>
              <span className="thermal-high">{tempStats.maxTemp}°C</span>
            </div>
            <div className="thermal-stat">
              <span>Minimum Temp:</span>
              <span className="thermal-low">{tempStats.minTemp}°C</span>
            </div>
            <div className="thermal-stat">
              <span>Average Temp:</span>
              <span>{tempStats.avgTemp}°C</span>
            </div>
            <div className="thermal-stat">
              <span>Center Temp:</span>
              <span>{tempStats.centerTemp}°C</span>
            </div>
          </div>
          <button className="thermal-export-button">Export Thermal Data</button>
        </div>
      </div>
    </div>
  );
}
