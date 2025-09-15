import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Advanced 3D Face Geometry with Movie-Quality Topology
function FaceGeometry({ scanningProgress, isScanning }) {
  const meshRef = useRef();
  const scanLineRef = useRef();
  const pointsRef = useRef();
  const wireframeRef = useRef();

  // Create detailed face geometry with proper topology
  const faceGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const positions = geometry.attributes.position.array;
    
    // Modify geometry to create realistic face shape
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      // Create face-like indentations and features
      const phi = Math.atan2(y, x);
      const theta = Math.acos(z);
      
      // Eye sockets
      if (theta > 1.2 && theta < 1.6) {
        if ((phi > -0.7 && phi < -0.3) || (phi > 0.3 && phi < 0.7)) {
          positions[i + 2] = z - 0.15; // Create eye socket depth
        }
      }
      
      // Nose bridge
      if (theta > 1.3 && theta < 1.8 && phi > -0.2 && phi < 0.2) {
        positions[i + 2] = z + 0.1; // Nose protrusion
      }
      
      // Mouth area
      if (theta > 2.0 && theta < 2.4 && phi > -0.4 && phi < 0.4) {
        positions[i + 2] = z - 0.08; // Mouth indentation
      }
      
      // Cheekbones
      if (theta > 1.5 && theta < 2.0) {
        if ((phi > -1.2 && phi < -0.8) || (phi > 0.8 && phi < 1.2)) {
          positions[i + 2] = z + 0.05; // Cheekbone prominence
        }
      }
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  // Create facial landmark points
  const facialLandmarks = useMemo(() => {
    const landmarks = [];
    
    // Eye landmarks
    landmarks.push(new THREE.Vector3(-0.4, 0.2, 0.8));  // Left eye corner
    landmarks.push(new THREE.Vector3(-0.2, 0.3, 0.85)); // Left eye center
    landmarks.push(new THREE.Vector3(0.2, 0.3, 0.85));  // Right eye center
    landmarks.push(new THREE.Vector3(0.4, 0.2, 0.8));   // Right eye corner
    
    // Nose landmarks
    landmarks.push(new THREE.Vector3(0, 0.1, 0.9));     // Nose tip
    landmarks.push(new THREE.Vector3(-0.1, 0.05, 0.85)); // Left nostril
    landmarks.push(new THREE.Vector3(0.1, 0.05, 0.85));  // Right nostril
    
    // Mouth landmarks
    landmarks.push(new THREE.Vector3(-0.2, -0.3, 0.8));  // Left mouth corner
    landmarks.push(new THREE.Vector3(0, -0.25, 0.82));   // Mouth center
    landmarks.push(new THREE.Vector3(0.2, -0.3, 0.8));   // Right mouth corner
    
    // Jawline landmarks
    landmarks.push(new THREE.Vector3(-0.6, -0.5, 0.6));  // Left jaw
    landmarks.push(new THREE.Vector3(0, -0.7, 0.7));     // Chin
    landmarks.push(new THREE.Vector3(0.6, -0.5, 0.6));   // Right jaw
    
    // Forehead landmarks
    landmarks.push(new THREE.Vector3(-0.3, 0.6, 0.7));   // Left forehead
    landmarks.push(new THREE.Vector3(0, 0.7, 0.75));     // Center forehead
    landmarks.push(new THREE.Vector3(0.3, 0.6, 0.7));    // Right forehead
    
    return landmarks;
  }, []);

  // Animation loop
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation when not scanning
      if (!isScanning) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      } else {
        // More dynamic rotation during scanning
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.5 + (scanningProgress * 0.05);
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
      }
    }

    // Animate scanning line
    if (scanLineRef.current && isScanning) {
      scanLineRef.current.position.y = -1 + (scanningProgress / 100) * 2;
      scanLineRef.current.material.opacity = 0.8 + Math.sin(state.clock.elapsedTime * 5) * 0.2;
    }

    // Animate point cloud
    if (pointsRef.current && isScanning) {
      const positions = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += Math.sin(state.clock.elapsedTime * 2 + i) * 0.001;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Main face mesh */}
      <mesh ref={meshRef} geometry={faceGeometry}>
        <meshPhongMaterial
          color={isScanning ? "#4ade80" : "#60a5fa"}
          transparent
          opacity={0.85}
          wireframe={false}
          shininess={100}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh ref={wireframeRef} geometry={faceGeometry}>
        <meshBasicMaterial
          color={isScanning ? "#06b6d4" : "#3b82f6"}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Facial landmark points */}
      {facialLandmarks.map((landmark, index) => (
        <mesh key={index} position={landmark}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial
            color={isScanning ? "#fbbf24" : "#6b7280"}
            transparent
            opacity={isScanning ? 0.8 + Math.sin(Date.now() * 0.01 + index) * 0.2 : 0.5}
          />
        </mesh>
      ))}

      {/* Scanning line effect */}
      {isScanning && (
        <mesh ref={scanLineRef} position={[0, -1, 0]}>
          <planeGeometry args={[3, 0.02]} />
          <meshBasicMaterial
            color="#06b6d4"
            transparent
            opacity={0.8}
            emissive="#06b6d4"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {/* Scanning point cloud */}
      {isScanning && (
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={200}
              array={new Float32Array(
                Array.from({ length: 600 }, () => (Math.random() - 0.5) * 3)
              )}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#fbbf24"
            size={0.01}
            transparent
            opacity={0.6}
          />
        </points>
      )}

      {/* Depth contour lines using basic geometry */}
      {isScanning && Array.from({ length: 5 }).map((_, i) => {
        const radius = 0.6 + i * 0.1;
        return (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius, radius + 0.02, 32]} />
            <meshBasicMaterial
              color={`hsl(${180 + i * 15}, 70%, 60%)`}
              transparent
              opacity={0.3 + Math.sin(Date.now() * 0.001 + i) * 0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Scanning effects and analysis overlay
function ScanningEffects({ scanningProgress, isScanning }) {
  const scanPlaneRef = useRef();

  useFrame((state) => {
    if (scanPlaneRef.current && isScanning) {
      scanPlaneRef.current.position.z = -1 + (scanningProgress / 100) * 2;
      scanPlaneRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  if (!isScanning) return null;

  return (
    <>
      {/* Vertical scanning plane */}
      <mesh ref={scanPlaneRef} position={[0, 0, -1]}>
        <planeGeometry args={[4, 4]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Analysis grid */}
      <gridHelper args={[3, 10, "#4ade80", "#4ade80"]} position={[0, -1.5, 0]} />
    </>
  );
}

// Main 3D Face Model Component
const ThreeDFaceModel = ({ scanningProgress = 0, isScanning = false, size = "small" }) => {
  const canvasStyle = {
    width: size === "large" ? "400px" : "120px",
    height: size === "large" ? "300px" : "120px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
  };

  return (
    <div style={canvasStyle}>
      <Canvas
        camera={{ 
          position: [0, 0, 3], 
          fov: size === "large" ? 50 : 75,
          near: 0.1,
          far: 1000 
        }}
        style={{ borderRadius: "8px" }}
      >
        {/* Lighting setup for movie-quality rendering */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[2, 2, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-2, 2, 2]} intensity={0.5} color="#06b6d4" />
        <pointLight position={[2, -2, 2]} intensity={0.3} color="#8b5cf6" />

        {/* 3D Face Model */}
        <FaceGeometry scanningProgress={scanningProgress} isScanning={isScanning} />
        
        {/* Scanning Effects */}
        <ScanningEffects scanningProgress={scanningProgress} isScanning={isScanning} />

      </Canvas>
    </div>
  );
};

export default ThreeDFaceModel;
