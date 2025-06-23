import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
 
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import DeviceList from './components/DeviceList/DeviceList';
import VideoStream from './pages/VideoStream/VideoStream';
import Audio from './pages/Audio/Audio';
import ThermoCam from './pages/ThermoCam/ThermoCam';
import Settings from './pages/Settings/Settings';
import Debugger from './pages/Debugger/Debugger';
import UsbIp from './pages/UsbIp/UsbIp';
 
function LayoutWithSidebar() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Navbar />
        <div style={{ padding: '1rem', flex: 1, overflowY: 'auto' }}>
          <AppContent />
        </div>
      </div>
    </div>
  );
}
 
function AppContent() {
  return (
    <Routes>
      <Route path="/videostream" element={<VideoStream />} />
      <Route path="/audio"       element={<Audio />} />
      <Route path="/thermocam"   element={<ThermoCam />} />
      <Route path="/debugger"    element={<Debugger />} />
      <Route path="/settings"    element={<Settings />} />
      <Route path="/UsbIp"       element={<UsbIp />} />
    </Routes>
  );
}
 
function AppWrapper() {
  const location = useLocation();
  const path = location.pathname;
 
  // Only show DeviceList at root path (no sidebar or navbar)
  if (path === '/') {
    return <DeviceList />;
  }
 
  // For all other routes, show sidebar layout
  return <LayoutWithSidebar />;
}
 
export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}