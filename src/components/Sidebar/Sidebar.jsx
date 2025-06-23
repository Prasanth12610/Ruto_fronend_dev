import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MonitorSmartphone,
  Volume2,
  Camera as CameraIcon,
  ThermometerSun,
  Usb,
  Bug,
  Share2,
  LayoutGrid,
  Brain,
  User,
  LogOut
} from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Mock user data (replace with real user context/state if needed)
  const user = {
    name: 'Admin',
    email: 'john@example.com',
  };

  const handleLogout = () => {
    // Add any logout logic (e.g., clearing auth tokens)
    navigate('/');
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const menuItems = [
    { to: '/videostream', label: 'VirtualDesk', icon: <MonitorSmartphone size={18} /> },
    { to: '/audio', label: 'Audio', icon: <Volume2 size={18} /> },
    {
      to: '/thermocam',
      label: 'ThermoCam',
      icon: (
        <span style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
          <ThermometerSun size={14} />
          <CameraIcon size={18} />
        </span>
      ),
    },
    //{ to: '/UsbIp', label: 'UON', icon: <Usb size={18} /> },
   // { to: '/debugger', label: 'Debugger', icon: <Bug size={18} /> },
   // { to: '/protocol', label: 'Protocol', icon: <Share2 size={18} /> },
   // { to: '/ruto-vault', label: 'RutoVault', icon: <Brain size={18} /> },
    { to: '/settings', label: 'Settings', icon: <LayoutGrid size={18} /> },
  ];

  return (
    <div className={styles.sidebar}>
      {/* Profile Section at Top */}
      <div className={styles.profileSection}>
        <button className={styles.profileButton} onClick={toggleProfileMenu}>
          <User size={20} />
        </button>
        {showProfileMenu && (
          <div className={styles.profileDropdown}>
            <div className={styles.profileContent}>
              <div className={styles.username}>{user.name}</div>
              <button className={styles.logoutButton} onClick={handleLogout}>
                <LogOut size={16} />
                <span className={styles.label}>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div className={styles.menu}>
        <ul>
          {menuItems.map((item, i) => (
            <li key={i}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                {item.icon}
                <span className={styles.label}>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
