import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface PlywoodViewerProps {
  topColor: string;
  edgeColor: string;
}

// Компонент ДСП
const Chipboard: React.FC<PlywoodViewerProps> = ({ topColor, edgeColor }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const width = 1.375;
  const height = 0.915;
  const thickness = 0.016;

  // Создание текстуры для ДСП (низ)
  const createChipboardTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;

    const baseColor = '#8B7D6B';
    const colorObj = new THREE.Color(baseColor);
    
    ctx.fillStyle = `rgb(${colorObj.r * 255}, ${colorObj.g * 255}, ${colorObj.b * 255})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 300; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const chipWidth = 1 + Math.random() * 5;
      const chipHeight = 0.5 + Math.random() * 3;
      const angle = Math.random() * Math.PI * 2;
      
      const darken = 0.2 + Math.random() * 0.3;
      const r = colorObj.r * (1 - darken * (0.2 + Math.random() * 0.2));
      const g = colorObj.g * (1 - darken * (0.2 + Math.random() * 0.2));
      const b = colorObj.b * (1 - darken * (0.2 + Math.random() * 0.2));
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      ctx.fillStyle = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${0.3 + Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, chipWidth / 2, chipHeight / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    return texture;
  };

  const chipboardTexture = React.useMemo(() => createChipboardTexture(), []);

  // Создаем материалы
  const topMaterial = new THREE.MeshStandardMaterial({
    color: topColor,
    roughness: 0.4,
    metalness: 0.02,
  });

  const bottomMaterial = new THREE.MeshStandardMaterial({
    map: chipboardTexture || undefined,
    color: chipboardTexture ? 0xffffff : '#8B7D6B',
    roughness: 0.8,
    metalness: 0.02,
  });

  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: edgeColor,
    roughness: 0.5,
    metalness: 0.02,
  });

  // Материалы для 6 сторон куба: [+x, -x, +y, -y, +z, -z]
  const materials = [
    edgeMaterial,   // право (+x) - боковина
    edgeMaterial,   // лево (-x) - боковина
    topMaterial,    // верх (+y) - верх
    bottomMaterial, // низ (-y) - низ
    edgeMaterial,   // перед (+z) - боковина
    edgeMaterial,   // зад (-z) - боковина
  ];

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[width, thickness, height]} />
        {materials.map((mat, i) => (
          <primitive key={i} object={mat} attach={`material-${i}`} />
        ))}
      </mesh>
    </group>
  );
};

// Основной компонент
const PlywoodViewer: React.FC<PlywoodViewerProps> = ({ topColor, edgeColor }) => {
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

  const width = 1.375;
  const height = 0.915;
  const maxDim = Math.max(width, height);
  const cameraDistance = maxDim * 3.5;

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
        camera={{ 
          position: [cameraDistance * 0.7, cameraDistance * 0.5, cameraDistance * 0.7], 
          fov: 45 
        }}
        shadows
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <OrbitControls
          enableDamping={true}
          dampingFactor={0.08}
          enablePan={false}
          enableZoom={true}
          zoomSpeed={1.0}
          rotateSpeed={0.8}
          minDistance={maxDim * 1.5}
          maxDistance={maxDim * 8}
          target={[0, 0, 0]}
          makeDefault
        />
        
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
        
        <Environment preset="studio" />
        
        <Chipboard topColor={topColor} edgeColor={edgeColor} />
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[width * 1.5, height * 1.5]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default PlywoodViewer;