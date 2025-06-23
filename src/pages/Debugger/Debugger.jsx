import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { SiArduino } from 'react-icons/si';
import './Debugger.css';

const Debugger = () => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleArduinoClick = async () => {
    try {
      setLoading(true);
      setStatusMessage('Launching Arduino IDE...');

      const res = await fetch('http://100.69.116.101:7417/launch_arduino');
      const data = await res.json();

      if (data.success === true && data.message === 'Arduino IDE launched') {
        setStatusMessage('Arduino launched. Waiting 30 seconds for initialization...');
        await wait(30000); // Wait for 30 seconds

        setStatusMessage('Connecting to Arduino stream...');

        try {
          const streamRes = await fetch('http://100.69.116.101:7417/', { method: 'HEAD' });
          if (streamRes.ok) {
            window.location.reload();
          } else {
            alert('Failed to connect to Arduino stream.');
            console.error('Stream API response:', streamRes.statusText);
          }
        } catch (streamError) {
          alert('Failed to connect to Arduino stream. Please check if the server is running.');
          console.error('Stream fetch error:', streamError);
        }
      } else {
        alert('Failed to launch Arduino.');
        console.error('API response:', data);
      }
    } catch (err) {
      alert('Error launching Arduino IDE.');
      console.error('Launch API error:', err);
    } finally {
      setLoading(false);
      setStatusMessage('');
    }
  };

  const handleSTM32Click = () => {
    alert('STM32 support will be added soon.');
  };

  return (
    <>
      <div className="debugger-header">
        <h2>Debugger</h2>
        <div>
          <button className="record" onClick={handleArduinoClick} disabled={loading}>
            <SiArduino size={18} style={{ marginRight: '5px', color: '#00979D' }} />
            {loading ? 'Launching...' : 'Arduino Uno'}
          </button>
          <button className="capture" onClick={handleSTM32Click} disabled={loading}>
            <Camera size={16} style={{ marginRight: '5px' }} />
            STM32F
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="status-banner">
          {statusMessage}
        </div>
      )}

      <div style={{ height: '100vh', width: '100%' }}>
        <iframe
          src="http://100.69.116.101:7417/"
          title="Debugger Stream"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    </>
  );
};

export default Debugger;