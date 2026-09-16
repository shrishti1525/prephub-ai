import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ReadinessOrb3D({ score = 75, tier = 'Level 2' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = 160;
    const height = 160;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Determine colors based on score using user palette
    const isHigh = score >= 75;
    const isMed = score >= 40 && score < 75;
    const primaryColor = isHigh ? 0x5EF2D5 : isMed ? 0x60B5FF : 0xFFE588; // Aquamarine : Cool Sky : Jasmine
    const accentColor = isHigh ? 0x60B5FF : isMed ? 0xF79D65 : 0xF79D65;  // Cool Sky : Tangerine : Tangerine

    // 1. Central Core Mesh
    const coreGeo = new THREE.DodecahedronGeometry(1.0, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: primaryColor,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
      emissive: primaryColor,
      emissiveIntensity: 0.5
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: accentColor,
      wireframe: false
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    group.add(inner);

    // 2. Outer Ring
    const ringGeo = new THREE.TorusGeometry(1.65, 0.035, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: 0.8
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    group.add(ring);

    // 3. Mini Satellite Orbiting Dot
    const dotGeo = new THREE.SphereGeometry(0.1, 12, 12);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    group.add(dot);

    // Lighting
    const light = new THREE.PointLight(primaryColor, 3, 10);
    light.position.set(2, 2, 3);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      core.rotation.y = t * 0.4;
      core.rotation.x = t * 0.2;
      ring.rotation.z = t * 0.5;
      ring.rotation.y = Math.sin(t * 0.5) * 0.3;

      dot.position.x = Math.cos(t * 1.5) * 1.65;
      dot.position.y = Math.sin(t * 1.5) * Math.cos(Math.PI / 3) * 1.65;
      dot.position.z = Math.sin(t * 1.5) * Math.sin(Math.PI / 3) * 1.65;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      renderer.dispose();
    };
  }, [score, tier]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '160px',
        height: '160px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
      title={`3D Placement Readiness Energy Core (${tier})`}
    />
  );
}
