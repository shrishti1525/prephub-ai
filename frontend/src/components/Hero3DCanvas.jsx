import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3DCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 500;
    const height = currentMount.clientHeight || 480;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 8.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Group to hold all 3D elements for mouse parallax rotation
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central 3D Core: Wireframe Icosahedron (Cool Sky)
    const coreGeometry = new THREE.IcosahedronGeometry(1.8, 1);
    const coreWireMaterial = new THREE.MeshStandardMaterial({
      color: 0x60B5FF,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x3ea0ff,
      emissiveIntensity: 0.6
    });
    const coreWireMesh = new THREE.Mesh(coreGeometry, coreWireMaterial);
    mainGroup.add(coreWireMesh);

    // Inner glowing solid crystal (Aquamarine with refractive depth)
    const innerGeometry = new THREE.OctahedronGeometry(1.1, 0);
    const innerMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x5EF2D5,
      roughness: 0.1,
      metalness: 0.8,
      transmission: 0.6,
      thickness: 1.2,
      emissive: 0x5EF2D5,
      emissiveIntensity: 0.5
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    mainGroup.add(innerMesh);

    // 2. Orbiting Torus Ring 1 (Aquamarine)
    const ring1Geo = new THREE.TorusGeometry(2.8, 0.035, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x5EF2D5,
      emissive: 0x5EF2D5,
      emissiveIntensity: 0.85,
      roughness: 0.3
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    mainGroup.add(ring1);

    // 3. Orbiting Torus Ring 2 (Tangerine Dream)
    const ring2Geo = new THREE.TorusGeometry(3.3, 0.025, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xF79D65,
      emissive: 0xF79D65,
      emissiveIntensity: 0.85,
      roughness: 0.3
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 4;
    mainGroup.add(ring2);

    // 4. Orbiting Mini Data Satellites (Aquamarine, Jasmine, Strawberry Red)
    const satelliteGeo = new THREE.SphereGeometry(0.14, 16, 16);
    
    const sat1Mat = new THREE.MeshStandardMaterial({
      color: 0x5EF2D5,
      emissive: 0x5EF2D5,
      emissiveIntensity: 1
    });
    const sat1 = new THREE.Mesh(satelliteGeo, sat1Mat);
    
    const sat2Mat = new THREE.MeshStandardMaterial({
      color: 0xFFE588,
      emissive: 0xFFE588,
      emissiveIntensity: 1
    });
    const sat2 = new THREE.Mesh(satelliteGeo, sat2Mat);

    const sat3Mat = new THREE.MeshStandardMaterial({
      color: 0xF35252,
      emissive: 0xF35252,
      emissiveIntensity: 1
    });
    const sat3 = new THREE.Mesh(satelliteGeo, sat3Mat);

    mainGroup.add(sat1);
    mainGroup.add(sat2);
    mainGroup.add(sat3);

    // 5. 3D Floating Particle Constellation with User Palette
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x60B5FF), // Cool Sky
      new THREE.Color(0x5EF2D5), // Aquamarine
      new THREE.Color(0xF79D65), // Tangerine Dream
      new THREE.Color(0xFFE588)  // Jasmine
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 3.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleSystem);

    // 6. Lighting with Palette Colors
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x60B5FF, 4, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x5EF2D5, 3, 20);
    pointLight2.position.set(-5, -4, 3);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xF79D65, 3, 15);
    pointLight3.position.set(0, 4, -4);
    scene.add(pointLight3);

    // 7. Mouse Parallax Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (event.clientX - windowHalfX) * 0.0012;
      mouseY = (event.clientY - windowHalfY) * 0.0012;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 8. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      mainGroup.rotation.y = targetX * 1.5;
      mainGroup.rotation.x = targetY * 1.5;

      // Rotate central wireframe & crystal
      coreWireMesh.rotation.y = elapsedTime * 0.25;
      coreWireMesh.rotation.x = elapsedTime * 0.15;
      innerMesh.rotation.y = -elapsedTime * 0.4;
      innerMesh.rotation.z = elapsedTime * 0.3;

      // Orbit rings
      ring1.rotation.z = elapsedTime * 0.3;
      ring1.rotation.x = Math.PI / 3 + Math.sin(elapsedTime * 0.5) * 0.1;

      ring2.rotation.z = -elapsedTime * 0.22;
      ring2.rotation.y = Math.PI / 4 + Math.cos(elapsedTime * 0.4) * 0.1;

      // Orbit satellites along ring paths
      const sat1Angle = elapsedTime * 1.2;
      sat1.position.x = Math.cos(sat1Angle) * 2.8;
      sat1.position.y = Math.sin(sat1Angle) * Math.cos(Math.PI / 3) * 2.8;
      sat1.position.z = Math.sin(sat1Angle) * Math.sin(Math.PI / 3) * 2.8;

      const sat2Angle = -elapsedTime * 0.9 + Math.PI;
      sat2.position.x = Math.cos(sat2Angle) * 3.3;
      sat2.position.y = Math.sin(sat2Angle) * Math.sin(-Math.PI / 4) * 3.3;
      sat2.position.z = Math.sin(sat2Angle) * Math.cos(-Math.PI / 4) * 3.3;

      const sat3Angle = elapsedTime * 1.5 + Math.PI / 2;
      sat3.position.x = Math.sin(sat3Angle) * 2.5;
      sat3.position.y = Math.cos(sat3Angle) * 2.2;
      sat3.position.z = Math.sin(sat3Angle * 0.5) * 1.5;

      // Particle system gentle rotation
      particleSystem.rotation.y = elapsedTime * 0.05;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.03) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth || 500;
      const newHeight = currentMount.clientHeight || 480;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      coreGeometry.dispose();
      coreWireMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      satelliteGeo.dispose();
      sat1Mat.dispose();
      sat2Mat.dispose();
      sat3Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '460px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}
    />
  );
}
