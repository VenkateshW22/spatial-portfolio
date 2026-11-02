'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Line, Float } from '@react-three/drei';
import { Physics, RigidBody, RapierRigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import * as THREE from 'three';
import { worldState } from './world-state';

// 3D Interactive Lanyard Badge (Vercel / Arthur Engel style)
function Badge() {
  const fixed = useRef<RapierRigidBody>(null!);
  const link = useRef<RapierRigidBody>(null!);
  const badge = useRef<RapierRigidBody>(null!);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const strap = useRef<any>(null);

  useRopeJoint(fixed, link, [[0, 0, 0], [0, 0, 0], 1.35]);
  useSphericalJoint(link, badge, [[0, 0, 0], [0, 1.35, 0]]);

  // Procedural Canvas Texture
  const texture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 768;
    c.height = 1024;
    const t = c.getContext('2d')!;

    // Background card (tactile off-white)
    t.fillStyle = '#f8faf6';
    t.fillRect(0, 0, 768, 1024);

    // Header bar (Engineering Blue)
    t.fillStyle = '#1d4ed8';
    t.fillRect(0, 0, 768, 160);

    t.fillStyle = '#ffffff';
    t.font = 'bold 30px "Courier New", monospace';
    t.fillText('VENKATESH K  //  SYSTEMS & TRAINING', 45, 95);

    // Holographic card area
    t.fillStyle = '#e2e8f0';
    t.fillRect(45, 195, 678, 430);

    // Circuit grid pattern
    t.strokeStyle = '#cbd5e1';
    t.lineWidth = 1.5;
    for (let i = 0; i < 15; i++) {
      t.beginPath();
      t.moveTo(45, 195 + i * 30);
      t.lineTo(723, 195 + i * 30);
      t.stroke();
      t.beginPath();
      t.moveTo(45 + i * 48, 195);
      t.lineTo(45 + i * 48, 625);
      t.stroke();
    }

    // Monogram Avatar
    t.fillStyle = '#1d4ed8';
    t.font = 'bold 220px -apple-system, sans-serif';
    t.fillText('VK', 220, 485);

    // Pill badge inside card
    t.fillStyle = '#22c55e';
    t.beginPath();
    t.arc(80, 565, 10, 0, Math.PI * 2);
    t.fill();
    t.fillStyle = '#0f172a';
    t.font = 'bold 22px monospace';
    t.fillText('ORACLE ALUM · CHANDIGARH UNIV', 105, 572);

    // Name & Title
    t.fillStyle = '#0f172a';
    t.font = 'bold 64px -apple-system, sans-serif';
    t.fillText('Venkatesh K', 45, 715);

    t.fillStyle = '#475569';
    t.font = 'bold 24px monospace';
    t.fillText('TECHNICAL TRAINER · SOFTWARE ENGINEER', 45, 765);

    // Status pill
    t.fillStyle = '#1d4ed8';
    t.beginPath();
    t.arc(63, 830, 8, 0, Math.PI * 2);
    t.fill();
    t.fillStyle = '#0f172a';
    t.font = 'bold 22px monospace';
    t.fillText('450+ HRS TAUGHT · 4K+ STUDENTS', 85, 838);

    // Barcode
    for (let i = 0; i < 78; i++) {
      t.fillStyle = '#0f172a';
      t.fillRect(45 + i * 6.5, 895, 2 + (i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1), 50);
    }
    t.font = 'bold 20px monospace';
    t.fillStyle = '#64748b';
    t.fillText('PASSPORT / VK-2026', 450, 928);

    return new THREE.CanvasTexture(c);
  }, []);

  useFrame((_, dt) => {
    if (!badge.current || !link.current) return;

    // Interactive grab and throw with momentum
    if (worldState.dragging) {
      badge.current.applyImpulse(
        {
          x: (worldState.x * 28 + worldState.vx * 15) * dt,
          y: (worldState.y * 24 + worldState.vy * 12) * dt,
          z: 0,
        },
        true
      );
    }

    // Update dynamic rope strap coordinates
    const a = fixed.current.translation();
    const b = link.current.translation();
    const d = badge.current.translation();
    const pts = [
      new THREE.Vector3(a.x, a.y, a.z),
      new THREE.Vector3(b.x, b.y, b.z),
      new THREE.Vector3(d.x, d.y + 1.35, d.z),
    ];
    if (strap.current) {
      strap.current.geometry.setPositions(pts.flatMap((p) => [p.x, p.y, p.z]));
    }
  });

  return (
    <>
      <RigidBody ref={fixed} type="fixed" position={[0, 3.9, 0]} />
      <RigidBody ref={link} position={[0, 2.6, 0]} colliders={false} />
      <RigidBody
        ref={badge}
        position={[0.2, 1.2, 0]}
        colliders="cuboid"
        linearDamping={3}
        angularDamping={4}
        rotation={[0, -0.12, -0.1]}
      >
        {/* Badge casing */}
        <RoundedBox args={[2, 2.7, 0.12]} radius={0.12} smoothness={4}>
          <meshStandardMaterial color="#e8ece6" roughness={0.3} metalness={0.2} />
        </RoundedBox>

        {/* Badge card face with dynamic canvas texture */}
        <mesh position={[0, 0, 0.067]}>
          <planeGeometry args={[1.91, 2.55]} />
          <meshStandardMaterial map={texture} roughness={0.7} />
        </mesh>

        {/* Metallic Lanyard Clamp Ring */}
        <mesh position={[0, 1.4, 0]}>
          <torusGeometry args={[0.15, 0.045, 12, 24]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
        </mesh>
      </RigidBody>

      {/* Lanyard Fabric Strap */}
      <Line
        ref={strap}
        points={[
          [0, 3.9, 0],
          [0, 2.6, 0],
          [0.2, 2.5, 0],
        ]}
        color="#254be8"
        lineWidth={12}
      />
    </>
  );
}

// Floating Spatial Nodes in Background (Arthur Engel / Linear depth)
function SpatialBackgroundNodes() {
  const group = useRef<THREE.Group>(null!);

  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 24; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 12 - 2,
          (Math.random() - 0.5) * 8 - 4,
        ] as [number, number, number],
        scale: 0.15 + Math.random() * 0.25,
        speed: 0.5 + Math.random() * 1.5,
      });
    }
    return arr;
  }, []);

  useFrame((_, dt) => {
    if (!group.current) return;
    // Rotate subtly and respond to scroll progress
    group.current.rotation.y += dt * 0.05;
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      -worldState.progress * 4,
      3,
      dt
    );
  });

  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <Float key={i} speed={n.speed} rotationIntensity={1} floatIntensity={1.5}>
          <mesh position={n.position} scale={n.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? '#254be8' : i % 2 === 0 ? '#38bdf8' : '#94a3b8'}
              wireframe
              transparent
              opacity={0.35}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Master Scene with Spline Camera Traversal
function Scene() {
  const group = useRef<THREE.Group>(null!);

  useFrame((state, dt) => {
    // Damp position of hero group based on viewport width & scroll progress
    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      state.viewport.width * 0.28,
      4,
      dt
    );
    group.current.scale.setScalar(state.size.width < 1000 ? 0.72 : 0.9);

    // Scroll progress translates the badge downward out of view as user enters deep project sections
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      -worldState.progress * 7.5 - 0.55,
      4,
      dt
    );

    // Camera moves through 3D depth along spline driven by Lenis scroll progress
    state.camera.position.z = THREE.MathUtils.damp(
      state.camera.position.z,
      8 + worldState.progress * 6,
      4,
      dt
    );
    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      (worldState.x || 0) * 0.35,
      3,
      dt
    );
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      (worldState.y || 0) * 0.25,
      3,
      dt
    );
  });

  return (
    <>
      {/* Studio Lighting */}
      <ambientLight intensity={1.8} />
      <directionalLight position={[4, 8, 6]} intensity={3.2} castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={1.2} color="#38bdf8" />
      <pointLight position={[0, -2, 4]} intensity={1.5} color="#254be8" />

      {/* Floating Spatial Background Nodes */}
      <SpatialBackgroundNodes />

      {/* Hero Badge in Physics World */}
      <group ref={group}>
        <Physics gravity={[0, -12, 0]}>
          <Badge />
        </Physics>
      </group>
    </>
  );
}

export default function World() {
  return (
    <div className="world" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
