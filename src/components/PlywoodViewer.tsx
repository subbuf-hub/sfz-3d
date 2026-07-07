import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface PlywoodViewerProps {
  topColor: string;
  edgeColor: string;
  decorImage?: string;
  decorName?: string;
}

// Компонент ДСП
const Chipboard: React.FC<PlywoodViewerProps> = ({ 
  topColor, 
  edgeColor, 
  decorImage,
  decorName
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [textureLoaded, setTextureLoaded] = useState(false);
  
  const width = 1.375;
  const height = 0.915;
  const thickness = 0.016;

  // Загрузка текстуры декора с настройкой масштаба
  const decorTexture = useMemo(() => {
    if (!decorImage) return null;
    
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      decorImage,
      (loadedTexture) => {
        setTextureLoaded(true);
        
        // Настройка текстуры после загрузки
        if (loadedTexture.image) {
          const img = loadedTexture.image;
          const imgAspect = img.width / img.height;
          const panelAspect = width / height; // 1.375 / 0.915 ≈ 1.503
          
          // Вариант 1: Растянуть на всю панель (может искажать)
          // loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
          // loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
          // loadedTexture.repeat.set(1, 1);
          // loadedTexture.offset.set(0, 0);
          
          // Вариант 2: Сохранить пропорции (рекомендуется)
          loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
          loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
          
          if (imgAspect > panelAspect) {
            // Изображение шире - масштабируем по ширине
            const scaleX = panelAspect / imgAspect;
            loadedTexture.repeat.set(scaleX, 1);
            loadedTexture.offset.set((1 - scaleX) / 2, 0);
          } else {
            // Изображение выше - масштабируем по высоте
            const scaleY = imgAspect / panelAspect;
            loadedTexture.repeat.set(1, scaleY);
            loadedTexture.offset.set(0, (1 - scaleY) / 2);
          }
          
          // Вариант 3: Повторение текстуры (для бесшовных текстур)
          // loadedTexture.wrapS = THREE.RepeatWrapping;
          // loadedTexture.wrapT = THREE.RepeatWrapping;
          // loadedTexture.repeat.set(2, 2); // 2x2 повторения
          // loadedTexture.offset.set(0, 0);
          
          loadedTexture.anisotropy = 4;
          loadedTexture.needsUpdate = true;
        }
      },
      undefined,
      (err) => {
        console.error('Ошибка загрузки декора:', err);
        setTextureLoaded(false);
      }
    );
    
    return texture;
  }, [decorImage, width, height]);

  // Создание текстуры для ДСП (верх/низ)
  const createChipboardTexture = useMemo(() => {
    if (decorImage) return null;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;

    const baseColor = new THREE.Color(topColor);
    
    ctx.fillStyle = `rgb(${baseColor.r * 255}, ${baseColor.g * 255}, ${baseColor.b * 255})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Крупная стружка
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const chipWidth = 2 + Math.random() * 8;
      const chipHeight = 1 + Math.random() * 4;
      const angle = Math.random() * Math.PI * 2;
      
      const darken = 0.1 + Math.random() * 0.4;
      const r = baseColor.r * (1 - darken);
      const g = baseColor.g * (1 - darken * 0.9);
      const b = baseColor.b * (1 - darken * 0.8);
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      ctx.fillStyle = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${0.4 + Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, chipWidth / 2, chipHeight / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = `rgba(${r * 200}, ${g * 190}, ${b * 180}, 0.2)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      
      ctx.restore();
    }

    // Мелкая стружка
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 1 + Math.random() * 3;
      const angle = Math.random() * Math.PI * 2;
      
      const darken = 0.2 + Math.random() * 0.3;
      const r = baseColor.r * (1 - darken * 0.8);
      const g = baseColor.g * (1 - darken * 0.7);
      const b = baseColor.b * (1 - darken * 0.6);
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      ctx.fillStyle = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${0.5 + Math.random() * 0.4})`;
      ctx.fillRect(-size/2, -size/4, size, size/2);
      
      ctx.restore();
    }

    // Тёмные вкрапления
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 0.5 + Math.random() * 1.5;
      
      const darken = 0.5 + Math.random() * 0.3;
      const r = baseColor.r * (1 - darken);
      const g = baseColor.g * (1 - darken * 0.9);
      const b = baseColor.b * (1 - darken * 0.8);
      
      ctx.fillStyle = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${0.3 + Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    texture.anisotropy = 4;
    return texture;
  }, [topColor, decorImage]);

  // Фиксированная текстура внутреннего слоя ДСП (цвет #c9b99a)
  const createInnerTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;

    const baseColor = new THREE.Color('#c9b99a');
    
    ctx.fillStyle = `rgb(${baseColor.r * 255}, ${baseColor.g * 255}, ${baseColor.b * 255})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Более крупная и хаотичная стружка для внутреннего слоя
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const chipWidth = 3 + Math.random() * 12;
      const chipHeight = 1 + Math.random() * 6;
      const angle = Math.random() * Math.PI * 2;
      
      const darken = 0.1 + Math.random() * 0.5;
      const r = baseColor.r * (1 - darken);
      const g = baseColor.g * (1 - darken * 0.9);
      const b = baseColor.b * (1 - darken * 0.8);
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      ctx.fillStyle = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${0.3 + Math.random() * 0.5})`;
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
  }, []);

  // Создаем материалы
  const topMaterial = new THREE.MeshStandardMaterial({
    map: decorTexture || createChipboardTexture || undefined,
    color: (decorTexture || createChipboardTexture) ? 0xffffff : topColor,
    roughness: decorTexture ? 0.3 : 0.6,
    metalness: decorTexture ? 0.05 : 0.0,
    emissive: new THREE.Color(topColor).multiplyScalar(0.02),
  });

  const bottomMaterial = new THREE.MeshStandardMaterial({
    map: createChipboardTexture || undefined,
    color: createChipboardTexture ? 0xffffff : topColor,
    roughness: 0.6,
    metalness: 0.0,
    emissive: new THREE.Color(topColor).multiplyScalar(0.02),
  });

  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: edgeColor,
    roughness: 0.7,
    metalness: 0.0,
  });

  // Материалы для 6 сторон куба
  const materials = [
    edgeMaterial, edgeMaterial,
    topMaterial, bottomMaterial,
    edgeMaterial, edgeMaterial,
  ];

  // Внутренняя структура ДСП (постоянная, фиксированный цвет #c9b99a)
  const structureGroup = (
    <group>
      {/* Горизонтальные линии - имитация слоёв прессования */}
      {Array.from({ length: 12 }).map((_, i) => {
        const yPos = -thickness/2 + ((i + 1) / 13) * thickness;
        const lineMat = new THREE.LineBasicMaterial({ 
          color: 0x8d7a6b, 
          transparent: true, 
          opacity: 0.15 
        });
        
        const points = [];
        const segments = 30;
        for (let j = 0; j <= segments; j++) {
          const t = j / segments;
          const x = -width/2 + t * width;
          const z = -height/2 + (Math.sin(t * 15 + i * 2) * 0.02 + 0.5) * height;
          points.push(new THREE.Vector3(x, yPos, z));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMat);
        return <primitive key={`layer-${i}`} object={line} />;
      })}

      {/* Текстура внутреннего слоя (видна только сверху) */}
      <mesh position={[0, thickness/2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 0.95, height * 0.95]} />
        <meshStandardMaterial
          map={createInnerTexture || undefined}
          color={createInnerTexture ? 0xffffff : '#c9b99a'}
          transparent
          opacity={0.25}
          roughness={0.8}
          metalness={0.0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Основная панель */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[width, thickness, height]} />
        {materials.map((mat, i) => (
          <primitive key={i} object={mat} attach={`material-${i}`} />
        ))}
      </mesh>

      {/* Внутренняя структура ДСП - всегда отображается */}
      {structureGroup}
    </group>
  );
};

// Основной компонент
const PlywoodViewer: React.FC<PlywoodViewerProps> = ({ 
  topColor, 
  edgeColor, 
  decorImage,
  decorName
}) => {
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
        
        <Chipboard 
          topColor={topColor} 
          edgeColor={edgeColor}
          decorImage={decorImage}
          decorName={decorName}
        />
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[width * 1.5, height * 1.5]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default PlywoodViewer;