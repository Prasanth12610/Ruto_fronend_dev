import React, { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import logo from '../../assets/RutoMatrix_Nonbackground.png';

// 3D Model Component
const Model = ({ url }) => {
  const { scene } = useGLTF(url || 'fallback_path.glb'); // default to prevent error

  if (!scene) {
    return null; // or a loader
  }

  return <primitive object={scene} scale={2.5} />;
};

const ThreeDModelWithLogo = ({ url }) => {
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  return (
    <div style={styles.container}>
      <img src={logo} alt="Rutomatrix Logo" style={styles.logo} />
      <div style={styles.canvasWrapper}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />
          <Suspense fallback={null}>
            <Model url={url} />
          </Suspense>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
        </Canvas>
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    background: 'transparent',
    marginTop: 100,
  },
  logo: {
    width: '800px',
    height: '100px',
    animation: 'fadeIn 1.5s ease-in-out',
  },
  canvasWrapper: {
    width: '500px',
    height: '500px',
    position: 'relative',
    bottom: '90px',
  },
};

export default ThreeDModelWithLogo;
 