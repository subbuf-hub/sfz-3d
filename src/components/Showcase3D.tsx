import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Torus, Html } from '@react-three/drei';

// Простой вращающийся куб (без сложных вычислений)
const SimpleCube = () => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.012;
    }
  });
  
  return (
    <Box ref={meshRef} args={[1.5, 1.5, 1.5]} position={[-2, 0, 0]}>
      <meshStandardMaterial color="#ff6b6b" roughness={0.3} metalness={0.7} />
    </Box>
  );
};

// Простая сфера
const SimpleSphere = () => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.008;
    }
  });
  
  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={[2, 0, 0]}>
      <meshStandardMaterial color="#4ecdc4" roughness={0.2} metalness={0.3} />
    </Sphere>
  );
};

// Вращающийся тор
const SimpleTorus = () => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.5;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });
  
  return (
    <Torus ref={meshRef} args={[1.2, 0.3, 32, 64]} position={[0, -1, 0]}>
      <meshStandardMaterial color="#ffeaa7" roughness={0.4} metalness={0.6} />
    </Torus>
  );
};

// Компонент-обертка с обработкой ошибок
const Scene3D = () => {
  return (
    <>
      {/* Базовое освещение */}
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 3, 2]} intensity={0.5} color="#ff6b6b" />
      <directionalLight position={[2, 5, 3]} intensity={0.5} />
      
      {/* Вспомогательные элементы */}
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        zoomSpeed={0.8}
        rotateSpeed={0.8}
      />
      
      {/* 3D объекты */}
      <SimpleCube />
      <SimpleSphere />
      <SimpleTorus />
      
      {/* Простая сетка для ориентации */}
      <gridHelper args={[15, 20, '#888888', '#444444']} position={[0, -1.5, 0]} />
    </>
  );
};

// Fallback компонент на случай ошибки WebGL
const Fallback3D = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '600px', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      color: 'white'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎨</div>
      <h3>3D сцена не поддерживается вашим браузером</h3>
      <p className="text-center mt-3" style={{ maxWidth: '500px' }}>
        Пожалуйста, обновите браузер или включите аппаратное ускорение для просмотра 3D контента
      </p>
      <div className="mt-4">
        <button 
          className="btn btn-light" 
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
};

// Главный компонент с обработкой ошибок
const Showcase3D = () => {
  const [hasError, setHasError] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    // Проверка поддержки WebGL
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        setHasError(true);
      }
    } catch (e) {
      setWebglSupported(false);
      setHasError(true);
    }
  }, []);

  if (hasError || !webglSupported) {
    return <Fallback3D />;
  }

  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <Canvas
        camera={{ position: [5, 4, 8], fov: 45 }}
        gl={{ 
          preserveDrawingBuffer: false,
          antialias: true,
          powerPreference: "high-performance"
        }}
        onError={(error) => {
          console.error('WebGL Error:', error);
          setHasError(true);
        }}
        onCreated={({ gl }) => {
          console.log('WebGL успешно инициализирован');
        }}
      >
        <Scene3D />
      </Canvas>
    </div>
  );
};

export default Showcase3D;