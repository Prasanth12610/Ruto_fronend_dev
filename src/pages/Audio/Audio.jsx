import React, { useState, useRef, useEffect } from 'react';
import './Audio.css';
import { AudioWaveform, AudioLines, Airplay } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import audioLoadingGif from '../../assets/audio-loading.gif';

const Audio = () => {
  const [activeTab, setActiveTab] = useState('streamer');
  const [volume, setVolume] = useState(70);
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showGif, setShowGif] = useState(false);
  const [selectedInputDevice, setSelectedInputDevice] = useState(null);

  const audioRef = useRef(null);
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  const inputDevices = ['Built-in Microphone', 'External Microphone', 'Line In'];

  useEffect(() => {
    if (!waveformRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#1281D6',
      progressColor: '#FF6A00',
      cursorColor: 'transparent',
      barWidth: 3,
      barRadius: 4,
      cursorWidth: 0,
      height: 150,
      barGap: 3,
      responsive: true,
      backend: 'MediaElement',
      normalize: true,
      partialRender: true,
      interact: false,
    });

    wavesurferRef.current = wavesurfer;

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!wavesurferRef.current || !audioRef.current) return;

    const handleCanPlay = () => {
      if (isStreaming && wavesurferRef.current) {
        wavesurferRef.current.load(audioRef.current);
      }
    };

    audioRef.current.addEventListener('canplay', handleCanPlay);
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplay', handleCanPlay);
      }
    };
  }, [isStreaming]);

  const handleToggleStream = async () => {
    if (!isStreaming) {
      setLoading(true);
      setLoadingMessage('Starting audio stream...');
      setShowGif(true);

      try {
        await fetch('https://100.68.107.103:8000/start-audio', { method: 'POST' });

        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.src = 'https://100.68.107.103:8002/audio';
            audioRef.current.play().catch(err => console.error('Playback error:', err));
          }
          setIsStreaming(true);
          setLoading(false);
        }, 5000);
      } catch (err) {
        console.error('Failed to start audio stream:', err);
        setLoading(false);
        setShowGif(false);
      }
    } else {
      setLoading(true);
      setLoadingMessage('Stopping audio stream...');
      setShowGif(true);

      try {
        await fetch('https://100.68.107.103:8000/stop-audio', { method: 'POST' });

        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
          }
          if (wavesurferRef.current) {
            wavesurferRef.current.empty();
          }

          setIsStreaming(false);
          setLoading(false);
          setShowGif(false);
        }, 5000);
      } catch (err) {
        console.error('Failed to stop audio stream:', err);
        setLoading(false);
        setShowGif(false);
      }
    }
  };

  return (
    <div className="audio-container">
      <div className="header">
        <h2>Audio Streamer</h2>
        <button className="stream-btn" onClick={handleToggleStream} disabled={loading}>
          <Airplay
            size={20}
            style={{ marginRight: '8px', color: isStreaming ? 'Red' : 'white' }}
          />
          {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
        </button>
      </div>

      {showGif && (
        <div className="inline-loading">
          <img src={audioLoadingGif} alt="Loading" className="loading-gif-inline" />
          {loading && <p>{loadingMessage}</p>}
        </div>
      )}

      <audio ref={audioRef} controls className="audio" />

      <div className="monitor">
        <label>🎧 Volume</label>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => {
            const newVolume = e.target.value;
            setVolume(newVolume);
            if (audioRef.current) {
              audioRef.current.volume = newVolume / 100;
            }
            if (wavesurferRef.current) {
              wavesurferRef.current.setVolume(newVolume / 100);
            }
          }}
        />
        <span>{volume}%</span>
      </div>

      <div className="device-section">
        <div className="device-box">
          <h3>🎙️ Input Devices</h3>
          {inputDevices.map((device, index) => (
            <button
              key={index}
              className={`device-btn ${selectedInputDevice === device ? 'selected' : ''}`}
              onClick={() => setSelectedInputDevice(device)}
            >
              {device}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Audio;
