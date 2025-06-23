import React, { useState, useRef } from 'react';
import { Airplay, Camera, Maximize2, Minimize2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import styles from './VideoStream.module.css';

const VideoStream = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoContainerRef = useRef(null);

  const handleStartStreaming = () => {
    setLoading(true);
    setTimeout(() => {
      setIsStreaming(true);
      setLoading(false);
    }, 5000);
  };

  const handleStopStreaming = () => {
    setIsStreaming(false);
  };


  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>VirtualDesk</h2>
          <div>
            <button
              className={styles.record}
              onClick={isStreaming ? handleStopStreaming : handleStartStreaming}
              disabled={loading}
            >
              <Airplay size={20} color={isStreaming ? 'red' : 'green'} />
              {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
            </button>
          </div>
        </div>

        <div className={styles.video} ref={videoContainerRef}>
          <button
            className={styles.fullscreenToggle}
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          {loading ? (
            <div className={styles.videoSpinnerOverlay}>
              <div className={styles.miniSpinner}></div>
              <p style={{ color: 'white', marginTop: '10px' }}>Connecting...</p>
            </div>
          ) : isStreaming ? (
            <iframe
              src="http://100.86.180.85/"
              title="TinyPilot Stream"
              className={styles.videoFeed}
              allow="fullscreen"
              frameBorder="0"
            />
          ) : (
            <div className={styles.noSignal}>
              <p>
                <Camera size={20} style={{ marginRight: '5px' }} />
                No video signal
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoStream;
