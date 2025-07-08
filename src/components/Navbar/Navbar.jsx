import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  MonitorSmartphone,
  Volume2,
  Camera as CameraIcon,
  Usb,
  Bug,
  Share2,
  LayoutGrid,
  Brain,
  ThermometerSun,
} from 'lucide-react';

import RutomatrixLogo from '../../assets/RutoMatrix_Nonbackground.png';
import TessolveLogo from '../../assets/tessolve.png';

import styles from './Navbar.module.css';

const routeIcons = {
  '/':            <MonitorSmartphone size={20} color="#fff" />,
  '/streamer':    <MonitorSmartphone size={20} color="#fff" />,
  '/audio':       <Volume2 size={20} color="#fff" />,
  '/camera':      <CameraIcon size={20} color="#fff" />,
  '/thermal':     <ThermometerSun size={20} color="#fff" />,
  '/UsbIp':       <Usb size={20} color="#fff" />,
  '/debugger':    <Bug size={20} color="#fff" />,
  '/protocol':    <Share2 size={20} color="#fff" />,
  '/ruto-vault':  <Brain size={20} color="#fff" />,
  '/settings':    <LayoutGrid size={20} color="#fff" />,
};

const Navbar = () => {
  const location = useLocation();
  const icon = routeIcons[location.pathname] || <MonitorSmartphone size={20} color="#fff" />;

  const openRutomatrix = () => {
    window.open('https://embedded.tessolve.com/rutomatrix/', '_blank');
  };

  const openTessolve = () => {
    window.open('https://www.tessolve.com/', '_blank');
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <img
          src={RutomatrixLogo}
          alt="Rutomatrix Logo"
          className={styles.logo}
          onClick={openRutomatrix}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className={styles.center}>
        {icon}
      </div>

      <div className={styles.right}>
        <img
          src={TessolveLogo}
          alt="Tessolve Logo"
          className={styles.logo}
          onClick={openTessolve}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
};

export default Navbar;
