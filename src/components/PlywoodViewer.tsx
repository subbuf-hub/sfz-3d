import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface PlywoodViewerProps {
  primaryColor: string;
}

// Компонент фанеры
const Plywood: React.FC<{ color: string }> = ({ color }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Создание текстуры дерева
  const createWoodTexture = (baseColor: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;

    const colorObj = new THREE.Color(baseColor);
    ctx.fillStyle = `rgb(${colorObj.r * 255}, ${colorObj.g * 255}, ${colorObj.b * 255})`;
    ctx.fillRect(0, 0, 512, 512);

    // Рисуем линии текстуры
    const lines = 30 + Math.random() * 20;
    for (let i = 0; i < lines; i++) {
      const y = Math.random() * 512;
      const width = 1 + Math.random() * 3;
      const alpha = 0.1 + Math.random() * 0.3;
      
      const darken = 0.4;
      const r = colorObj.r * (1 - darken * (0.3 + Math.random() * 0.3));
      const g = colorObj.g * (1 - darken * (0.3 + Math.random() * 0.3));
      const b = colorObj.b * (1 - darken * (0.3 + Math.random() * 0.3));
      
      ctx.strokeStyle = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${alpha})`;
      ctx.lineWidth = width;
      
      ctx.beginPath();
      let x = 0;
      while (x < 512) {
        const yOffset = Math.sin(x * 0.01 + i) * 20 + Math.sin(x * 0.005 + i * 2) * 30;
        if (x === 0) {
          ctx.moveTo(x, y + yOffset);
        } else {
          ctx.lineTo(x, y + yOffset);
        }
        x += 2;
      }
      ctx.stroke();
    }

    // Сучки
    for (let i = 0; i < 5 + Math.random() * 5; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = 10 + Math.random() * 30;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(0,0,0,${0.1 + Math.random() * 0.2})`);
      gradient.addColorStop(1, `rgba(0,0,0,0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(x, y, radius, radius * (0.5 + Math.random()), 0, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.5, 1.5);
    return texture;
  };

  // Создаем текстуру при изменении цвета
  const texture = React.useMemo(() => {
    return createWoodTexture(color);
  }, [color]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Только одна фанера */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3, 0.08, 2]} />
        <meshStandardMaterial
          map={texture || undefined}
          color={texture ? 0xffffff : color}
          roughness={0.5}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
};

// Основной компонент
const PlywoodViewer: React.FC<PlywoodViewerProps> = ({ primaryColor }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: '100%', 
          minHeight: '500px',
          backgroundColor: '#1a1410',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#888'
        }}
      >
        Загрузка 3D сцены...
      </div>
    );
  }

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '500px',
        backgroundColor: '#1a1410',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Canvas
        camera={{ position: [3.5, 2.5, 3.5], fov: 45 }}
        shadows
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        {/* Орбит контролы - полное вращение на 360 градусов */}
        <OrbitControls
          enableDamping={true}
          dampingFactor={0.08}
          enablePan={false}
          enableZoom={true}
          zoomSpeed={1.0}
          rotateSpeed={0.8}
          minDistance={1.5}
          maxDistance={20}
          target={[0, 0, 0]}
          makeDefault
        />
        
        {/* Минимальное освещение */}
        <ambientLight intensity={0.5} color="#ffffff" />
        <directionalLight
          position={[5, 10, 7]}
          intensity={1.0}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 0, 5]} intensity={0.3} color="#ffffff" />
        <directionalLight position={[0, 0, -5]} intensity={0.2} color="#ffffff" />
        
        {/* Окружение */}
        <Environment preset="studio" />
        
        {/* Только фанера */}
        <Plywood color={primaryColor} />
      </Canvas>
    </div>
  );
};

export default PlywoodViewer;