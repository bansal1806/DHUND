import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const SimpleFaceModel = ({ scanningProgress = 0, isScanning = false, size = "small" }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const faceRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      size === "large" ? 50 : 75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create enhanced face geometry
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const positions = geometry.attributes.position.array;

    // Modify geometry to create realistic face shape
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      const phi = Math.atan2(y, x);
      const theta = Math.acos(z);

      // Eye sockets
      if (theta > 1.2 && theta < 1.6) {
        if ((phi > -0.7 && phi < -0.3) || (phi > 0.3 && phi < 0.7)) {
          positions[i + 2] = z - 0.15;
        }
      }

      // Nose bridge
      if (theta > 1.3 && theta < 1.8 && phi > -0.2 && phi < 0.2) {
        positions[i + 2] = z + 0.1;
      }

      // Mouth area
      if (theta > 2.0 && theta < 2.4 && phi > -0.4 && phi < 0.4) {
        positions[i + 2] = z - 0.08;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    // Materials
    const faceMaterial = new THREE.MeshPhongMaterial({
      color: isScanning ? 0x4ade80 : 0x60a5fa,
      transparent: true,
      opacity: 0.85,
      shininess: 100
    });

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: isScanning ? 0x06b6d4 : 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });

    // Face mesh
    const faceMesh = new THREE.Mesh(geometry, faceMaterial);
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);

    scene.add(faceMesh);
    scene.add(wireframeMesh);

    // Add facial landmark points
    const landmarkGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    const landmarkMaterial = new THREE.MeshBasicMaterial({
      color: isScanning ? 0xfbbf24 : 0x6b7280,
      transparent: true,
      opacity: 0.8
    });

    const landmarks = [
      [-0.4, 0.2, 0.8], [0.4, 0.2, 0.8], // Eyes
      [0, 0.1, 0.9], [-0.1, 0.05, 0.85], [0.1, 0.05, 0.85], // Nose
      [-0.2, -0.3, 0.8], [0, -0.25, 0.82], [0.2, -0.3, 0.8], // Mouth
      [-0.6, -0.5, 0.6], [0, -0.7, 0.7], [0.6, -0.5, 0.6], // Jaw
      [-0.3, 0.6, 0.7], [0, 0.7, 0.75], [0.3, 0.6, 0.7] // Forehead
    ];

    const landmarkMeshes = landmarks.map(([x, y, z]) => {
      const mesh = new THREE.Mesh(landmarkGeometry, landmarkMaterial.clone());
      mesh.position.set(x, y, z);
      scene.add(mesh);
      return mesh;
    });

    // Scanning line
    let scanLine = null;
    if (isScanning) {
      const scanGeometry = new THREE.PlaneGeometry(3, 0.02);
      const scanMaterial = new THREE.MeshPhongMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.8,
        emissive: new THREE.Color(0x06b6d4),
        emissiveIntensity: 0.5
      });
      scanLine = new THREE.Mesh(scanGeometry, scanMaterial);
      scene.add(scanLine);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    const pointLight1 = new THREE.PointLight(0x06b6d4, 0.5);
    const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.3);

    directionalLight.position.set(2, 2, 5);
    pointLight1.position.set(-2, 2, 2);
    pointLight2.position.set(2, -2, 2);

    scene.add(ambientLight);
    scene.add(directionalLight);
    scene.add(pointLight1);
    scene.add(pointLight2);

    // Camera position
    camera.position.z = 3;

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    faceRef.current = { faceMesh, wireframeMesh, landmarkMeshes, scanLine };

    // Animation loop
    const animate = () => {
      const time = Date.now() * 0.001;

      if (faceRef.current) {
        const { faceMesh, wireframeMesh, landmarkMeshes, scanLine } = faceRef.current;

        // Rotate face
        if (!isScanning) {
          faceMesh.rotation.y = Math.sin(time * 0.3) * 0.2;
          faceMesh.rotation.x = Math.sin(time * 0.2) * 0.1;
          wireframeMesh.rotation.copy(faceMesh.rotation);
        } else {
          faceMesh.rotation.y = time * 0.5 + (scanningProgress * 0.05);
          faceMesh.rotation.x = Math.sin(time * 0.8) * 0.15;
          wireframeMesh.rotation.copy(faceMesh.rotation);
        }

        // Animate landmarks
        landmarkMeshes.forEach((mesh, i) => {
          mesh.material.opacity = isScanning ?
            0.6 + Math.sin(time * 2 + i * 0.3) * 0.3 : 0.5;
        });

        // Animate scanning line
        if (scanLine && isScanning) {
          scanLine.position.y = -1 + (scanningProgress / 100) * 2;
          scanLine.material.opacity = 0.8 + Math.sin(time * 5) * 0.2;
        }

        // Update materials based on scanning state
        faceMesh.material.color.setHex(isScanning ? 0x4ade80 : 0x60a5fa);
        wireframeMesh.material.color.setHex(isScanning ? 0x06b6d4 : 0x3b82f6);
      }

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (mountRef.current && renderer && camera) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isScanning, scanningProgress, size]);

  const containerStyle = {
    width: size === "large" ? "400px" : "120px",
    height: size === "large" ? "300px" : "120px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    overflow: "hidden"
  };

  return <div ref={mountRef} style={containerStyle} />;
};

export default SimpleFaceModel;
