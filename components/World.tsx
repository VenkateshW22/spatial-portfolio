'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';
import { worldState } from './world-state';

// Helper to draw a sleek procedural texture for a cube face
function createFaceTexture({
  title,
  sub,
  metric,
  badge,
  badgeColor,
  bullets,
  cornerTag,
  theme = 'light',
}: {
  title: string;
  sub: string;
  metric: string;
  badge: string;
  badgeColor: string;
  bullets: string[];
  cornerTag: string;
  theme?: 'light' | 'dark';
}) {
  const c = document.createElement('canvas');
  c.width = 768;
  c.height = 768;
  const ctx = c.getContext('2d')!;

  const isDark = theme === 'dark';

  // Base background fill
  ctx.fillStyle = isDark ? '#0b1015' : '#ffffff';
  ctx.fillRect(0, 0, 768, 768);

  // Subtle interior grid pattern
  ctx.strokeStyle = isDark ? '#1a2332' : '#f1f5f9';
  ctx.lineWidth = 1.5;
  for (let i = 48; i < 768; i += 48) {
    ctx.beginPath();
    ctx.moveTo(i, 40);
    ctx.lineTo(i, 728);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(40, i);
    ctx.lineTo(728, i);
    ctx.stroke();
  }

  // Inner card boundary border
  ctx.strokeStyle = isDark ? '#2a3b4f' : '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, 696, 696);

  // Top Accent Header Strip
  ctx.fillStyle = badgeColor;
  ctx.fillRect(36, 36, 696, 16);

  // Top Tag & Corner Step
  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.font = 'bold 22px monospace';
  ctx.fillText(badge, 64, 96);

  ctx.fillStyle = badgeColor;
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(cornerTag, 704, 96);
  ctx.textAlign = 'left';

  // Big Bold Milestone Title
  ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
  ctx.font = '900 68px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText(title, 64, 184);

  // Subtitle / Organization Role
  ctx.fillStyle = badgeColor;
  ctx.font = 'bold 28px monospace';
  ctx.fillText(sub, 64, 230);

  // Big Metric Highlight Box
  ctx.fillStyle = isDark ? '#131c26' : '#f8fafc';
  ctx.fillRect(64, 260, 640, 104);
  ctx.strokeStyle = isDark ? '#233245' : '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.strokeRect(64, 260, 640, 104);

  // Metric Accent Left Border
  ctx.fillStyle = badgeColor;
  ctx.fillRect(64, 260, 8, 104);

  ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('KEY IMPACT METRIC', 92, 298);

  ctx.fillStyle = isDark ? '#f1f5f9' : '#0f172a';
  ctx.font = '900 36px monospace';
  ctx.fillText(metric, 92, 342);

  // Key Technical Achievements (Bullets)
  let y = 412;
  bullets.forEach((b) => {
    // Bullet marker
    ctx.fillStyle = badgeColor;
    ctx.beginPath();
    ctx.arc(80, y - 8, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
    ctx.font = 'bold 26px -apple-system, sans-serif';
    ctx.fillText(b, 106, y);
    y += 58;
  });

  // Bottom Technical Barcode & Hash
  ctx.strokeStyle = isDark ? '#1e293b' : '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(64, 660);
  ctx.lineTo(704, 660);
  ctx.stroke();

  // Procedural barcode bars
  for (let i = 0; i < 48; i++) {
    ctx.fillStyle = isDark ? '#475569' : '#94a3b8';
    ctx.fillRect(64 + i * 8, 678, (i % 3 === 0 ? 3 : 1.5), 32);
  }

  ctx.font = 'bold 20px monospace';
  ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
  ctx.textAlign = 'right';
  ctx.fillText('CRC32 · VERIFIED_MILESTONE', 704, 700);
  ctx.textAlign = 'left';

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  return tex;
}

// The 3D Kinetic Milestone Cube
function MilestoneCube() {
  const group = useRef<THREE.Group>(null!);

  // Kinetic rotational physics tracking
  const currentRot = useRef({ x: 0.35, y: 0.55 });
  const targetRot = useRef({ x: 0.35, y: 0.55 });
  const angularVel = useRef({ x: 0.04, y: 0.35 }); // Idle spin speed

  const theme = worldState.theme || 'light';

  // Generate 6 high-definition procedural textures for all 6 cube faces
  const textures = useMemo(() => {
    // Face 1: Front (+Z) -> Oracle Enterprise Systems
    const front = createFaceTexture({
      title: 'ORACLE',
      sub: 'SOFTWARE ENGINEER · 2022—2024',
      metric: '20% RDS COST REDUCTION',
      badge: 'ENTERPRISE MICROSERVICES',
      badgeColor: '#254be8',
      bullets: [
        'High-Throughput Microservices (10k+ QPS)',
        'AWS Aurora PostgreSQL Migration Lead',
        'Resilience4j Circuit Breakers',
        'Oracle Rockstar Engineering Award',
      ],
      cornerTag: '01 / CLOUD',
      theme,
    });

    // Face 2: Right (+X) -> Chandigarh University & EdTech
    const right = createFaceTexture({
      title: '4,000+ TAUGHT',
      sub: 'TECHNICAL TRAINER · 2025—PRES',
      metric: '450+ TRAINING HOURS DELIVERED',
      badge: 'CHANDIGARH UNIVERSITY FACULTY',
      badgeColor: '#10b981',
      bullets: [
        'Teaching Titan Award (CU Faculty)',
        'Competitive Coding & DSA Architectures',
        'Bootcamp Tours: NIET, Chitkara, LPU',
        'Engineers Placed in Tier-1 Product Roles',
      ],
      cornerTag: '02 / EDTECH',
      theme,
    });

    // Face 3: Back (-Z) -> CodeSkill Distributed Sandbox
    const back = createFaceTexture({
      title: 'CODESKILL',
      sub: 'PRODUCTION DISTRIBUTED JUDGE',
      metric: '1,000+ CONCURRENT CONTESTANTS',
      badge: '128-BUCKET SHARDED RUNNER',
      badgeColor: '#3b82f6',
      bullets: [
        'PostgreSQL 128 Hash Shards (CRC32)',
        'Docker & Piston Sandboxed Runtimes',
        'BullMQ Async Task Queue on Redis',
        'Multi-Signal Anti-Cheat Integrity',
      ],
      cornerTag: '03 / SCALE',
      theme,
    });

    // Face 4: Left (-X) -> SyncDeck Realtime Classroom
    const left = createFaceTexture({
      title: 'SYNCDECK',
      sub: 'COLLABORATIVE CLASSROOM PLATFORM',
      metric: '<45ms ULTRA-LOW LATENCY',
      badge: 'WEBRTC MESH + REDIS PUB/SUB',
      badgeColor: '#8b5cf6',
      bullets: [
        'Low-Latency WebRTC P2P Screen Mesh',
        'Redis Pub/Sub State Fanout & Delta Buffer',
        'Zero-Loss Frame Reconnection Replay',
        'Multi-User Interactive Whiteboard',
      ],
      cornerTag: '04 / REALTIME',
      theme,
    });

    // Face 5: Top (+Y) -> Academic Scholar & Foundations
    const top = createFaceTexture({
      title: 'AMRITA UNIV',
      sub: 'MCA & BCA DISTINCTION · 2017—22',
      metric: '5 YEARS CORE SYSTEMS RESEARCH',
      badge: 'COMPUTER SCIENCE SCHOLAR',
      badgeColor: '#0284c7',
      bullets: [
        'Algorithms & Distributed Systems Engines',
        'Assistive Eye-Movement Research Lead',
        'C/C++, Java & Linux OS Internals',
        'Polyglot Fluency: 6 Indian Languages',
      ],
      cornerTag: '05 / ACADEMIC',
      theme,
    });

    // Face 6: Bottom (-Y) -> Venkatesh K Signature
    const bottom = createFaceTexture({
      title: 'VENKATESH K',
      sub: 'ENGINEER & TECHNICAL EDUCATOR',
      metric: 'HIGH CONCURRENCY + EDUCATION',
      badge: 'CRAFT & HUMAN IMPACT',
      badgeColor: '#f59e0b',
      bullets: [
        '"Build things. Teach things. Stay curious."',
        'Open to Relocation & Senior Product Roles',
        'Mysuru → Bengaluru → NCR → Punjab',
        'venkateshwork2212@gmail.com',
      ],
      cornerTag: '06 / PROFILE',
      theme,
    });

    return { front, right, back, left, top, bottom };
  }, [theme]);

  // Frame tick animation & kinetic rotation handling
  useFrame((_, dt) => {
    if (!group.current) return;

    if (worldState.dragging) {
      // User is actively grabbing & dragging the cube
      const dragSpeedX = worldState.vx * 6.0;
      const dragSpeedY = worldState.vy * 6.0;
      angularVel.current.x = -dragSpeedY;
      angularVel.current.y = dragSpeedX;
      targetRot.current.x += angularVel.current.x * dt;
      targetRot.current.y += angularVel.current.y * dt;
    } else {
      // Free-spinning flick momentum with realistic damping
      angularVel.current.x *= Math.pow(0.92, dt * 60);
      angularVel.current.y *= Math.pow(0.92, dt * 60);

      // Once inertia slows, seamlessly resume gentle idle spin
      const currentSpeed = Math.hypot(angularVel.current.x, angularVel.current.y);
      if (currentSpeed < 0.25) {
        angularVel.current.y = THREE.MathUtils.damp(angularVel.current.y, 0.35, 1.8, dt);
        angularVel.current.x = THREE.MathUtils.damp(angularVel.current.x, 0.04, 1.8, dt);
      }

      targetRot.current.x += angularVel.current.x * dt;
      targetRot.current.y += angularVel.current.y * dt;
    }

    // Smooth interpolation to target rotation
    currentRot.current.x = THREE.MathUtils.damp(currentRot.current.x, targetRot.current.x, 14, dt);
    currentRot.current.y = THREE.MathUtils.damp(currentRot.current.y, targetRot.current.y, 14, dt);

    // Subtle parallax tilt from cursor position
    const parallaxX = (worldState.x || 0) * 0.22;
    const parallaxY = (worldState.y || 0) * 0.18;

    group.current.rotation.x = currentRot.current.x + parallaxY;
    group.current.rotation.y = currentRot.current.y + parallaxX;

    // Scroll reaction: cube translates downward & scales down as visitor scrolls
    const scrollSink = -worldState.progress * 8.0 + 0.1;
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, scrollSink, 4, dt);

    // Responsive position: centered on right side
    group.current.position.x = 2.1;
    group.current.position.z = 0;

    const targetScale = Math.max(0.35, 1 - worldState.progress * 0.55);
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, targetScale, 4, dt));
  });

  const casingColor = theme === 'dark' ? '#161e27' : '#334155';
  const half = 1.255;

  return (
    <group ref={group}>
      {/* Heavy Beveled Metallic Casing */}
      <RoundedBox args={[2.5, 2.5, 2.5]} radius={0.14} smoothness={5}>
        <meshStandardMaterial
          color={casingColor}
          roughness={0.25}
          metalness={0.75}
        />
      </RoundedBox>

      {/* Face 1: Front (+Z) · Oracle Enterprise Systems */}
      <mesh position={[0, 0, half]}>
        <planeGeometry args={[2.34, 2.34]} />
        <meshStandardMaterial map={textures.front} roughness={0.65} />
      </mesh>

      {/* Face 2: Right (+X) · Chandigarh University */}
      <mesh position={[half, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.34, 2.34]} />
        <meshStandardMaterial map={textures.right} roughness={0.65} />
      </mesh>

      {/* Face 3: Back (-Z) · CodeSkill Distributed Runner */}
      <mesh position={[0, 0, -half]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.34, 2.34]} />
        <meshStandardMaterial map={textures.back} roughness={0.65} />
      </mesh>

      {/* Face 4: Left (-X) · SyncDeck Realtime Classroom */}
      <mesh position={[-half, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[2.34, 2.34]} />
        <meshStandardMaterial map={textures.left} roughness={0.65} />
      </mesh>

      {/* Face 5: Top (+Y) · Academic Scholar & Research */}
      <mesh position={[0, half, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.34, 2.34]} />
        <meshStandardMaterial map={textures.top} roughness={0.65} />
      </mesh>

      {/* Face 6: Bottom (-Y) · Venkatesh K Profile & Signature */}
      <mesh position={[0, -half, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.34, 2.34]} />
        <meshStandardMaterial map={textures.bottom} roughness={0.65} />
      </mesh>
    </group>
  );
}

// Background Floating Wireframe Geometries
function SpatialBackgroundNodes() {
  const mesh1 = useRef<THREE.Mesh>(null!);
  const mesh2 = useRef<THREE.Mesh>(null!);

  useFrame((_, dt) => {
    if (mesh1.current) mesh1.current.rotation.x += dt * 0.15;
    if (mesh1.current) mesh1.current.rotation.y += dt * 0.2;
    if (mesh2.current) mesh2.current.rotation.y -= dt * 0.18;
  });

  return (
    <>
      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={mesh1} position={[-4.5, 2.2, -4]}>
          <octahedronGeometry args={[1.4, 0]} />
          <meshBasicMaterial color="#3b82f6" wireframe opacity={0.25} transparent />
        </mesh>
      </Float>

      <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh ref={mesh2} position={[5.2, -2.5, -3]}>
          <dodecahedronGeometry args={[1.2, 0]} />
          <meshBasicMaterial color="#10b981" wireframe opacity={0.22} transparent />
        </mesh>
      </Float>
    </>
  );
}

function Scene() {
  return (
    <>
      {/* Studio Lighting with Warm/Cool Split for Specular Edges */}
      <ambientLight intensity={1.6} />
      <directionalLight position={[6, 9, 7]} intensity={3.0} />
      <directionalLight position={[-6, 3, -3]} intensity={1.6} color="#38bdf8" />
      <pointLight position={[2, -1, 4]} intensity={2.2} color="#254be8" />

      {/* Background Floating Spatial Nodes */}
      <SpatialBackgroundNodes />

      {/* Kinetic 3D Milestone Cube */}
      <Float speed={2.0} rotationIntensity={0.15} floatIntensity={0.4}>
        <MilestoneCube />
      </Float>
    </>
  );
}

export default function World() {
  return (
    <div className="world" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7.5], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
