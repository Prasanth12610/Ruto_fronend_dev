import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';

import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import DeviceList from './components/DeviceList/DeviceList';
import VideoStream from './pages/VideoStream/VideoStream';
import Audio from './pages/Audio/Audio';
import Thermal from './pages/Thermal/Thermal';
import Camera from './pages/Camera/Camera';
import LoginSignupPage from './components/Auth/LoginSignupPage';
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
          <Routes>
            <Route path="/videostream" element={<VideoStream />} />
            <Route path="/audio"       element={<Audio />} />
            <Route path="/thermal"     element={<Thermal />} />
            <Route path="/camera"      element={<Camera />} />
            <Route path="/debugger"      element={<Debugger />} />
            <Route path="/settings"    element={<Settings />} />
            <Route path="/UsbIp"    element={<UsbIp />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function AppRoutes({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const path = location.pathname;

  // If not logged in, redirect everything except /auth to /auth
  if (!isAuthenticated && path !== '/auth') {
    return <Navigate to="/auth" replace />;
  }

  // Auth page (login/signup)
  if (path === '/auth') {
    return (
      <Routes>
        <Route
          path="/auth"
          element={<LoginSignupPage setIsAuthenticated={setIsAuthenticated} />}
        />
      </Routes>
    );
  }

  // Root device list
  if (path === '/') {
    return (
      <Routes>
        <Route path="/" element={<DeviceList />} />
      </Routes>
    );
  }

  // All other routes under sidebar layout
  return <LayoutWithSidebar />;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      
      <AppRoutes
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
    </Router>
  );
}
