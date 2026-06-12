import { useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  useTexture
} from '@react-three/drei'

import * as THREE from 'three'

import plywoodBase from '../assets/plywood_base.jpg'
import plywoodNormal from '../assets/plywood_normal.jpg'
import plywoodRoughness from '../assets/plywood_roughness.jpg'

type PlywoodProps = {
  color: string
}

function Plywood({ color }: PlywoodProps) {
  const [
    baseTexture,
    normalTexture,
    roughnessTexture
  ] = useTexture([
    plywoodBase,
    plywoodNormal,
    plywoodRoughness
  ])

  useMemo(() => {
    baseTexture.wrapS = THREE.RepeatWrapping
    baseTexture.wrapT = THREE.RepeatWrapping
    baseTexture.repeat.set(2, 2)

    normalTexture.wrapS = THREE.RepeatWrapping
    normalTexture.wrapT = THREE.RepeatWrapping

    roughnessTexture.wrapS = THREE.RepeatWrapping
    roughnessTexture.wrapT = THREE.RepeatWrapping
  }, [
    baseTexture,
    normalTexture,
    roughnessTexture
  ])

  const woodMaterial =
    new THREE.MeshPhysicalMaterial({
      map: baseTexture,
      normalMap: normalTexture,
      roughnessMap: roughnessTexture,
      roughness: 0.85,
      clearcoat: 0.2
    })

  const paintedMaterial =
    new THREE.MeshPhysicalMaterial({
      map: baseTexture,
      color: color,
      normalMap: normalTexture,
      roughnessMap: roughnessTexture,
      roughness: 0.45,
      clearcoat: 1,
      clearcoatRoughness: 0.05
    })

  const materials = [
    woodMaterial,
    woodMaterial,
    paintedMaterial,
    woodMaterial,
    woodMaterial,
    woodMaterial
  ]

  return (
    <mesh material={materials}>
      <boxGeometry args={[4, 2.5, 0.18]} />
    </mesh>
  )
}

export default function PlywoodViewer() {
  const [color, setColor] =
    useState('#2196f3')

  const colors = [
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffffff',
    '#000000',
    '#ffd700',
    '#8b4513'
  ]

  return (
    <div className="row h-100">

      <div
        className="col-3 bg-light p-4"
        style={{
          overflowY: 'auto'
        }}
      >
        <h4>Покраска фанеры</h4>

        <label className="form-label">
          Цвет
        </label>

        <input
          type="color"
          className="form-control form-control-color"
          value={color}
          onChange={(e) =>
            setColor(e.target.value)
          }
        />

        <div className="mt-4">
          <div className="mb-2">
            Быстрые цвета
          </div>

          <div className="d-flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() =>
                  setColor(c)
                }
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 4,
                  border:
                    '1px solid #999',
                  background: c
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="col-9 p-0">
        <Canvas
          shadows
          camera={{
            position: [0, 0, 6],
            fov: 45
          }}
        >
          <color
            attach="background"
            args={['#111111']}
          />

          <ambientLight
            intensity={0.5}
          />

          <directionalLight
            position={[10, 10, 5]}
            intensity={3}
            castShadow
          />

          <directionalLight
            position={[-10, 5, -5]}
            intensity={1.5}
          />

          <spotLight
            position={[0, 8, 5]}
            intensity={2}
            angle={0.4}
          />

          <Environment preset="city" />

          <Plywood color={color} />

          <OrbitControls
            enablePan={false}
            enableZoom
            minDistance={3}
            maxDistance={12}
          />
        </Canvas>
      </div>
    </div>
  )
}