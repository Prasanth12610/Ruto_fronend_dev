import React, { useState } from 'react';
import { ArrowLeft, Copy } from 'lucide-react';
import './UsbIp.css';

function UsbIp() {
  const [fpgaInfo, setFpgaInfo] = useState(null);
  const [connectedFpga, setConnectedFpga] = useState(null);

  const handleFPGAConnect = (device) => {
    setFpgaInfo({ loading: true, ...device });
    setTimeout(() => {
      setFpgaInfo({ loading: false, ...device });
      setConnectedFpga(device.name);
    }, 2000);
  };

  const closeFPGAInfo = () => setFpgaInfo(null);
  const handleDisconnect = () => {
    setConnectedFpga(null);
    setFpgaInfo(null);
  };

  return (
    <div>
      <div className="UsbIp-header">
        <h2>USB Over Network</h2>
      </div>
      <div className="container">
        <h1 className="title">Select FPGA Device</h1>
        <div className="cards-grid">
          <FPGACard
            title="FPGA Device 180"
            desc="High-performance computing device"
            onConnect={() => handleFPGAConnect({ name: 'FPGA Device 180' })}
            isConnected={connectedFpga === 'FPGA Device 180'}
          />
          <FPGACard
            title="FPGA Device 190"
            desc="Low-latency optimization device"
            onConnect={() =>
              handleFPGAConnect({
                name: 'FPGA Device 190',
                details: 'Specialized low-latency device for real-time tasks.'
              })
            }
            isConnected={connectedFpga === 'FPGA Device 190'}
          />
        </div>
      </div>

      {fpgaInfo && (
        <FPGAInfoModal
          info={fpgaInfo}
          onClose={closeFPGAInfo}
          onDisconnect={handleDisconnect}
        />
      )}
    </div>
  );
}

// FPGACard Component
const FPGACard = ({ title, desc, onConnect, isConnected }) => (
  <div className="fpga-card">
    <div className="card-content">
      <div className="fpga-icon">
        <div className="circuit-lines" />
      </div>
      <h2>{title}</h2>
      <p>{desc}</p>
      <button
        className={`connect-btn ${isConnected ? 'connected' : ''}`}
        onClick={onConnect}
      >
        <span className="btn-text">{isConnected ? 'Connected' : 'Connect'}</span>
        {!isConnected && <span className="btn-icon">→</span>}
      </button>
    </div>
  </div>
);

// FPGAInfoModal Component
const FPGAInfoModal = ({ info, onClose, onDisconnect }) => {
  const [os, setOs] = useState('linux');
  const [protocol, setProtocol] = useState('jtag');
  const [action, setAction] = useState('attach');
  const [copied, setCopied] = useState(false);

  const handleOsChange = (event) => setOs(event.target.value);
  const handleProtocolSelect = (protocolType) => setProtocol(protocolType);

  const handleCopy = () => {
    const command = document.getElementById('command-text').innerText;
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const getMessage = () => {
    if (action === 'attach') {
      if (protocol === 'jtag' && os === 'linux') {
        return 'sudo usbip attach --remote=<replace your tailscale ip> --busid=1-1.1';
      } else if (protocol === 'jtag' && os === 'windows') {
        return 'usbip.exe attach -r <usbip server ip> -b 1-1.1';
      } else if (protocol === 'uart' && os === 'linux') {
        return 'sudo usbip attach --remote=<replace your tailscale ip> --busid=1-1.3';
      } else if (protocol === 'uart' && os === 'windows') {
        return 'usbip.exe attach -r <usbip server ip> -b 1-1.3';
      }
    } else if (action === 'detach') {
      if (protocol === 'jtag') return 'usbip.exe detach -p 01';
      if (protocol === 'uart') return 'usbip.exe detach -p 00';
    }
    return 'Command Generation ...';
  };

  return (
    <div className="fpga-info">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        {info.loading ? (
          <div className="connection-status">
            <div className="loading-spinner"></div>
            <h2>Establishing Connection...</h2>
          </div>
        ) : (
          <>
            <h1>{info.name}</h1>
            <div className="modal-options">
              <div className="right-select">
                <label htmlFor="os-select">Choose OS:</label>
                <select
                  id="os-select"
                  className="os-dropdown"
                  value={os}
                  onChange={handleOsChange}
                >
                  <option value="linux">Linux</option>
                  <option value="windows">Windows</option>
                </select>
              </div>

              <div className="protocol-radio-group">
                <label>Choose Protocol:</label>
                <div className="radio-options">
                  <input
                    type="radio"
                    id="jtag"
                    name="protocol"
                    value="jtag"
                    checked={protocol === 'jtag'}
                    onChange={() => handleProtocolSelect('jtag')}
                  />
                  <label htmlFor="jtag" className={`radio-label ${protocol === 'jtag' ? 'selected' : ''}`}>
                    JTAG
                  </label>

                  <input
                    type="radio"
                    id="uart"
                    name="protocol"
                    value="uart"
                    checked={protocol === 'uart'}
                    onChange={() => handleProtocolSelect('uart')}
                  />
                  <label htmlFor="uart" className={`radio-label ${protocol === 'uart' ? 'selected' : ''}`}>
                    UART
                  </label>
                </div>
              </div>

              <div className="action-radio">
                <label>Choose Action:</label>
                <label>
                  <input
                    type="radio"
                    value="attach"
                    checked={action === 'attach'}
                    onChange={() => setAction('attach')}
                  />
                  Attach
                </label>
                <label>
                  <input
                    type="radio"
                    value="detach"
                    checked={action === 'detach'}
                    onChange={() => setAction('detach')}
                  />
                  Detach
                </label>
              </div>
            </div>

            <div className="os-message-container">
              <div className="command-wrapper">
                <p id="command-text">{getMessage()}</p>
                <button className="copy-btn" onClick={handleCopy}>
                  <Copy size={18} />
                </button>
                {copied && <span className="tooltip">Command copied</span>}
              </div>
            </div>

            <button className="disconnect-btn" onClick={onDisconnect}>
              Disconnect
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UsbIp;
