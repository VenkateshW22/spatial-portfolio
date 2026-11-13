'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
  Handle,
  Node,
  Edge,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Play, ShieldAlert, Cpu, RefreshCw, CheckCircle2, Zap } from 'lucide-react';

interface SandboxProps {
  project: string;
}

interface CustomNodeData {
  step: string;
  title: string;
  subtitle: string;
  badge?: string;
  isDark?: boolean;
  isActive?: boolean;
  isScaleNode?: boolean;
  hasAlert?: boolean;
}

// Custom Architecture Node Component for Pixel-Perfect Layout
function ArchNode({ data }: { data: CustomNodeData }) {
  const isDark = !!data.isDark;
  const isActive = !!data.isActive;
  const isScaleNode = !!data.isScaleNode;
  const hasAlert = !!data.hasAlert;

  const bg = hasAlert
    ? (isDark ? '#450a0a' : '#fef2f2')
    : isScaleNode
    ? (isDark ? '#064e3b' : '#f0fdf4')
    : isActive
    ? (isDark ? '#1e293b' : '#ffffff')
    : (isDark ? '#131c26' : '#ffffff');

  const border = hasAlert
    ? '#ef4444'
    : isActive
    ? '#254be8'
    : isScaleNode
    ? '#22c55e'
    : (isDark ? '#2e4156' : '#cbd5e1');

  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const subColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div
      className={`arch-node ${isActive ? 'active' : ''} ${isScaleNode ? 'scale-node' : ''} ${hasAlert ? 'alert-node' : ''}`}
      style={{
        width: 180,
        minHeight: 74,
        background: bg,
        border: `2px solid ${border}`,
        borderRadius: '10px',
        padding: '10px 12px',
        boxShadow: hasAlert
          ? '0 0 0 4px rgba(239, 68, 68, 0.25)'
          : isActive
          ? '0 0 0 4px rgba(37, 75, 232, 0.22), 0 8px 20px rgba(37, 75, 232, 0.12)'
          : '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.22s ease-in-out',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 8,
          height: 8,
          background: isActive ? '#254be8' : (isDark ? '#475569' : '#94a3b8'),
          border: `2px solid ${isDark ? '#0b1015' : '#ffffff'}`,
          left: -5,
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '5px',
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '9px',
            fontWeight: 800,
            color: hasAlert ? '#ef4444' : isActive ? '#254be8' : (isScaleNode ? '#16a34a' : '#64748b'),
            letterSpacing: '0.8px',
          }}
        >
          {data.step}
        </span>
        {data.badge && (
          <span
            style={{
              fontSize: '8px',
              fontFamily: 'monospace',
              fontWeight: 700,
              padding: '2px 5px',
              borderRadius: '4px',
              background: isScaleNode ? '#dcfce7' : (isDark ? '#1e293b' : '#f1f5f9'),
              color: isScaleNode ? '#15803d' : (isDark ? '#94a3b8' : '#475569'),
              border: `1px solid ${isScaleNode ? '#86efac' : (isDark ? '#334155' : '#e2e8f0')}`,
            }}
          >
            {data.badge}
          </span>
        )}
      </div>

      <div
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: textColor,
          lineHeight: 1.3,
          marginBottom: '3px',
          letterSpacing: '-0.2px',
        }}
      >
        {data.title}
      </div>

      <div
        style={{
          fontSize: '9.5px',
          color: subColor,
          lineHeight: 1.35,
          fontWeight: 500,
        }}
      >
        {data.subtitle}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 8,
          height: 8,
          background: isActive ? '#254be8' : (isDark ? '#475569' : '#94a3b8'),
          border: `2px solid ${isDark ? '#0b1015' : '#ffffff'}`,
          right: -5,
        }}
      />
    </div>
  );
}

const nodeTypes = {
  archNode: ArchNode,
};

function FlowCanvas({
  isCodeSkill,
  isDark,
  step,
  isScaled,
  antiCheatAlert,
  onFitComplete,
}: {
  isCodeSkill: boolean;
  isDark: boolean;
  step: number;
  isScaled: boolean;
  antiCheatAlert: boolean;
  onFitComplete?: () => void;
}) {
  const { fitView } = useReactFlow();

  // Grid coordinates:
  // Column 1: x = 30
  // Column 2: x = 245
  // Column 3: x = 460
  // Column 4: x = 675
  // Column 5: x = 890
  // Row center: y = 140
  // Row top: y = 65
  // Row bottom: y = 215

  const nodes: Node[] = useMemo(() => {
    if (isCodeSkill) {
      const baseNodes: Node[] = [
        {
          id: 'client',
          type: 'archNode',
          position: { x: 30, y: 140 },
          data: {
            step: 'STAGE 01',
            title: 'Next.js 16 WebApp',
            subtitle: 'Candidate IDE & Integrity',
            badge: 'INGEST',
            isDark,
            isActive: step === 0,
            hasAlert: antiCheatAlert,
          },
        },
        {
          id: 'gateway',
          type: 'archNode',
          position: { x: 245, y: 140 },
          data: {
            step: 'STAGE 02',
            title: 'NestJS Gateway',
            subtitle: 'Socket.IO + Auth Guards',
            badge: 'ROUTER',
            isDark,
            isActive: step === 1,
          },
        },
        {
          id: 'queue',
          type: 'archNode',
          position: { x: 460, y: 140 },
          data: {
            step: 'STAGE 03',
            title: 'BullMQ on Redis',
            subtitle: 'Priority Job Queue',
            badge: 'BUFFER',
            isDark,
            isActive: step === 2,
          },
        },
        {
          id: 'sandbox',
          type: 'archNode',
          position: { x: 675, y: isScaled ? 65 : 140 },
          data: {
            step: isScaled ? 'STAGE 04a' : 'STAGE 04',
            title: isScaled ? 'Worker Replica #1' : 'Docker Sandboxes',
            subtitle: 'Isolated Piston Runner',
            badge: 'PISTON',
            isDark,
            isActive: step === 3,
          },
        },
        {
          id: 'shards',
          type: 'archNode',
          position: { x: 890, y: 140 },
          data: {
            step: 'STAGE 05',
            title: 'PostgreSQL Shards',
            subtitle: '128 Hash Partitions',
            badge: '128 DB',
            isDark,
            isActive: step === 4,
          },
        },
      ];

      if (isScaled) {
        baseNodes.push({
          id: 'replica-worker',
          type: 'archNode',
          position: { x: 675, y: 215 },
          data: {
            step: 'STAGE 04b',
            title: 'Worker Replica #2',
            subtitle: 'Auto-Scaled Container',
            badge: 'AWS ASG',
            isDark,
            isActive: step === 3,
            isScaleNode: true,
          },
        });
      }

      return baseNodes;
    } else {
      // SyncDeck Architecture
      const baseNodes: Node[] = [
        {
          id: 'host',
          type: 'archNode',
          position: { x: 30, y: 140 },
          data: {
            step: 'STAGE 01',
            title: 'Instructor Host',
            subtitle: 'React 19 + Whiteboard',
            badge: 'PRESENTER',
            isDark,
            isActive: step === 0,
          },
        },
        {
          id: 'gateway',
          type: 'archNode',
          position: { x: 245, y: 140 },
          data: {
            step: 'STAGE 02',
            title: 'Express + Socket.IO',
            subtitle: 'Distributed State Sync',
            badge: 'GATEWAY',
            isDark,
            isActive: step === 1,
          },
        },
        {
          id: 'redis',
          type: 'archNode',
          position: { x: 460, y: 65 },
          data: {
            step: 'STAGE 03a',
            title: 'Redis Pub/Sub',
            subtitle: 'Replay Buffer & Log',
            badge: 'REPLAY',
            isDark,
            isActive: step === 2 || step === 3,
          },
        },
        {
          id: 'webrtc',
          type: 'archNode',
          position: { x: 460, y: 215 },
          data: {
            step: 'STAGE 03b',
            title: 'WebRTC Media Mesh',
            subtitle: 'Low-latency Pipeline',
            badge: 'WEBRTC',
            isDark,
            isActive: step === 2 || step === 3,
          },
        },
        {
          id: 'relay',
          type: 'archNode',
          position: { x: 675, y: isScaled ? 65 : 140 },
          data: {
            step: isScaled ? 'STAGE 04a' : 'STAGE 04',
            title: isScaled ? 'Primary SFU Node' : 'Edge Dist. Gateway',
            subtitle: 'State & A/V Multiplexer',
            badge: 'EDGE',
            isDark,
            isActive: step === 3,
          },
        },
        {
          id: 'students',
          type: 'archNode',
          position: { x: 890, y: 140 },
          data: {
            step: 'STAGE 05',
            title: 'Student Cohorts',
            subtitle: '3,000+ Synced Peers',
            badge: '<45ms',
            isDark,
            isActive: step === 4,
          },
        },
      ];

      if (isScaled) {
        baseNodes.push({
          id: 'replica-worker',
          type: 'archNode',
          position: { x: 675, y: 215 },
          data: {
            step: 'STAGE 04b',
            title: 'Edge TURN/Relay',
            subtitle: 'Auto-Scaled Mesh Node',
            badge: 'TURN SFU',
            isDark,
            isActive: step === 3,
            isScaleNode: true,
          },
        });
      }

      return baseNodes;
    }
  }, [isCodeSkill, isDark, step, isScaled, antiCheatAlert]);

  const edges: Edge[] = useMemo(() => {
    const activeColor = '#254be8';
    const inactiveColor = isDark ? '#334155' : '#cbd5e1';
    const scaleColor = '#22c55e';

    if (isCodeSkill) {
      const eList: Edge[] = [
        {
          id: 'e1',
          source: 'client',
          target: 'gateway',
          animated: step >= 1,
          markerEnd: { type: MarkerType.ArrowClosed, color: step >= 1 ? activeColor : inactiveColor },
          style: { stroke: step >= 1 ? activeColor : inactiveColor, strokeWidth: step === 1 ? 3 : 2 },
        },
        {
          id: 'e2',
          source: 'gateway',
          target: 'queue',
          animated: step >= 2,
          markerEnd: { type: MarkerType.ArrowClosed, color: step >= 2 ? activeColor : inactiveColor },
          style: { stroke: step >= 2 ? activeColor : inactiveColor, strokeWidth: step === 2 ? 3 : 2 },
        },
        {
          id: 'e3',
          source: 'queue',
          target: 'sandbox',
          animated: step >= 3,
          markerEnd: { type: MarkerType.ArrowClosed, color: step >= 3 ? activeColor : inactiveColor },
          style: { stroke: step >= 3 ? activeColor : inactiveColor, strokeWidth: step === 3 ? 3 : 2 },
        },
        {
          id: 'e4',
          source: 'sandbox',
          target: 'shards',
          animated: step >= 4,
          markerEnd: { type: MarkerType.ArrowClosed, color: step >= 4 ? activeColor : inactiveColor },
          style: { stroke: step >= 4 ? activeColor : inactiveColor, strokeWidth: step === 4 ? 3 : 2 },
        },
      ];

      if (isScaled) {
        eList.push(
          {
            id: 'e-scale-1',
            source: 'queue',
            target: 'replica-worker',
            animated: step >= 3,
            markerEnd: { type: MarkerType.ArrowClosed, color: step >= 3 ? scaleColor : '#86efac' },
            style: { stroke: step >= 3 ? scaleColor : '#86efac', strokeWidth: step === 3 ? 3 : 2 },
          },
          {
            id: 'e-scale-2',
            source: 'replica-worker',
            target: 'shards',
            animated: step >= 4,
            markerEnd: { type: MarkerType.ArrowClosed, color: step >= 4 ? scaleColor : '#86efac' },
            style: { stroke: step >= 4 ? scaleColor : '#86efac', strokeWidth: step === 4 ? 3 : 2 },
          }
        );
      }

      return eList;
    } else {
      // SyncDeck Edges
      const eList: Edge[] = [
        {
          id: 'e1',
          source: 'host',
          target: 'gateway',
          animated: step >= 1,
          markerEnd: { type: MarkerType.ArrowClosed, color: step >= 1 ? activeColor : inactiveColor },
          style: { stroke: step >= 1 ? activeColor : inactiveColor, strokeWidth: step === 1 ? 3 : 2 },
        },
        {
          id: 'e2',
          source: 'gateway',
          target: 'redis',
          animated: step >= 2,
          markerEnd: { type: MarkerType.ArrowClosed, color: step >= 2 ? activeColor : inactiveColor },
          style: { stroke: step >= 2 ? activeColor : inactiveColor, strokeWidth: step === 2 ? 3 : 2 },
        },
        {
          id: 'e3',
          source: 'gateway',
          target: 'webrtc',
          animated: step >= 2,
          markerEnd: { type: MarkerType.ArrowClosed, color: step >= 2 ? activeColor : inactiveColor },
          style: { stroke: step >= 2 ? activeColor : inactiveColor, strokeWidth: step === 2 ? 3 : 2 },
        },
        {
          id: 'e4',
          source: 'redis',
          target: 'relay',
          animated: step >= 3,
          markerEnd: { type: MarkerType.ArrowClosed, color: step >= 3 ? activeColor : inactiveColor },
          style: { stroke: step >= 3 ? activeColor : inactiveColor, strokeWidth: step === 3 ? 3 : 2 },
        },
        {
          id: 'e5',
          source: 'webrtc',
          target: isScaled ? 'replica-worker' : 'relay',
          animated: step >= 3,
          markerEnd: { type: MarkerType.ArrowClosed, color: step >= 3 ? (isScaled ? scaleColor : activeColor) : inactiveColor },
          style: { stroke: step >= 3 ? (isScaled ? scaleColor : activeColor) : inactiveColor, strokeWidth: step === 3 ? 3 : 2 },
        },
        {
          id: 'e6',
          source: 'relay',
          target: 'students',
          animated: step >= 4,
          markerEnd: { type: MarkerType.ArrowClosed, color: step >= 4 ? activeColor : inactiveColor },
          style: { stroke: step >= 4 ? activeColor : inactiveColor, strokeWidth: step === 4 ? 3 : 2 },
        },
      ];

      if (isScaled) {
        eList.push({
          id: 'e-scale-relay',
          source: 'replica-worker',
          target: 'students',
          animated: step >= 4,
          markerEnd: { type: MarkerType.ArrowClosed, color: step >= 4 ? scaleColor : '#86efac' },
          style: { stroke: step >= 4 ? scaleColor : '#86efac', strokeWidth: step === 4 ? 3 : 2 },
        });
      }

      return eList;
    }
  }, [isCodeSkill, isDark, step, isScaled]);

  // Initial and reactive fitView to ensure clean positioning
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.16, duration: 400 });
      onFitComplete?.();
    }, 60);
    return () => clearTimeout(timer);
  }, [fitView, isCodeSkill, isScaled, onFitComplete]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.16 }}
      minZoom={0.45}
      maxZoom={1.2}
      colorMode={isDark ? 'dark' : 'light'}
      proOptions={{ hideAttribution: true }}
    >
      <Background color={isDark ? '#233245' : '#cbd5e1'} gap={24} size={1.2} />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

export default function Sandbox({ project }: SandboxProps) {
  const isCodeSkill = project === 'CodeSkill';

  // Dynamic theme detection for dark mode support
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.dataset.theme === 'dark');
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  // State management
  const [step, setStep] = useState<number>(-1);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [isScaled, setIsScaled] = useState<boolean>(false);
  const [antiCheatAlert, setAntiCheatAlert] = useState<boolean>(false);
  const [activeLang, setActiveLang] = useState<'Java' | 'Python' | 'C++'>('Java');
  const [auditLog, setAuditLog] = useState<string[]>([]);

  // Simulation steps explanation
  const codeSkillSteps = useMemo(
    () => [
      `[STAGE 01 · Client] Candidate submits ${activeLang} solution. Anti-cheat integrity hash signed.`,
      `[STAGE 02 · Gateway] NestJS authenticates JWT & pushes payload to BullMQ queue.`,
      `[STAGE 03 · BullMQ] Redis assigns job #SUB-${1000 + completedCount}. Concurrency bounded (max 16/worker).`,
      `[STAGE 04 · Docker/Piston] Spun isolated sandbox with 256MB RAM / 2.0s CPU bounds. Verified 15/15 test cases.`,
      `[STAGE 05 · Database] Hash(userId) % 128 -> Partition Shard #${(completedCount * 17 + 23) % 128} committed successfully!`,
    ],
    [activeLang, completedCount]
  );

  const syncDeckSteps = useMemo(
    () => [
      `[STAGE 01 · Presenter] Slide #4 and collaborative canvas strokes emitted by host.`,
      `[STAGE 02 · Gateway] Socket.IO broadcast request parsed, assigned Sequence #SEQ-${500 + completedCount}.`,
      `[STAGE 03 · Pub/Sub & WebRTC] Dual fanout executed: delta frames to Redis buffer, screen mesh stream active.`,
      `[STAGE 04 · Edge Distribution] Media routed via edge relay nodes; delta buffer cached for instant reconnection.`,
      `[STAGE 05 · Student Cohorts] 3,000+ concurrent students rendered whiteboard updates with <45ms latency!`,
    ],
    [completedCount]
  );

  const activeSteps = isCodeSkill ? codeSkillSteps : syncDeckSteps;

  // Run simulation sequence
  useEffect(() => {
    if (step < 0) return;
    const timer = setTimeout(() => {
      if (step < 4) {
        setStep((s) => s + 1);
        setAuditLog((prev) => [activeSteps[step + 1], ...prev.slice(0, 4)]);
      } else {
        setStep(-1);
        setCompletedCount((c) => c + 1);
      }
    }, 850);
    return () => clearTimeout(timer);
  }, [step, activeSteps]);

  // Handle traffic scaling
  const handleScaleToggle = () => {
    setIsScaled((prev) => {
      const next = !prev;
      setAuditLog((prevLogs) => [
        next
          ? (isCodeSkill
              ? `🚀 [AUTO-SCALING TRIGGERED] Concurrency spike > 1,000 active contestants. Spun Worker Replica #2 in AWS ASG container cluster!`
              : `🚀 [AUTO-SCALING TRIGGERED] Student attendance > 1,000. Deployed dynamic Edge TURN/SFU relay node to distribute WebRTC mesh load!`)
          : (isCodeSkill
              ? `📉 [SCALE DOWN] Test traffic stabilized. Worker Replica #2 terminated to optimize cloud infrastructure costs.`
              : `📉 [SCALE DOWN] Room capacity normalized. TURN relays returned to standby state.`),
        ...prevLogs.slice(0, 4),
      ]);
      return next;
    });
  };

  // Simulate Anti-Cheat / Integrity Violation
  const handleAntiCheatTest = () => {
    setAntiCheatAlert(true);
    setAuditLog((prev) => [
      `🚨 [ANTI-CHEAT DETECTED] Client Tab Switch & DevTools Inspection flagged at timestamp ${new Date().toLocaleTimeString()}! Real-time audit logged to PostgreSQL.`,
      ...prev.slice(0, 4),
    ]);
    setTimeout(() => {
      setAntiCheatAlert(false);
    }, 3500);
  };

  return (
    <div className="sandbox-wrapper">
      {/* Top Controls Toolbar with Unified VK Logo */}
      <div className="sandbox-toolbar">
        <div className="toolbar-status">
          <span className="brand sandbox-brand" aria-label="VK Brand">
            vk<span>.</span>
          </span>
          <span className="live-badge">
            <span className="live-dot" /> LIVE ARCHITECTURE SIMULATOR
          </span>
          <span className="toolbar-counter">
            {completedCount} {isCodeSkill ? 'Submissions Judged' : 'Broadcasts Synced'}
          </span>
        </div>

        <div className="toolbar-actions">
          {isCodeSkill && (
            <div className="lang-selector">
              {(['Java', 'Python', 'C++'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`lang-btn ${activeLang === lang ? 'active' : ''}`}
                  onClick={() => setActiveLang(lang)}
                  disabled={step >= 0}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            className="action-btn primary"
            disabled={step >= 0}
            onClick={() => {
              setStep(0);
              setAuditLog((prev) => [activeSteps[0], ...prev.slice(0, 4)]);
            }}
          >
            {step >= 0 ? (
              <>
                <RefreshCw size={13} className="spin" /> Executing {isCodeSkill ? `${activeLang} submission` : 'sync payload'}…
              </>
            ) : (
              <>
                <Play size={13} /> {isCodeSkill ? `Submit ${activeLang} Solution` : 'Broadcast Live Frame'}
              </>
            )}
          </button>

          {isCodeSkill ? (
            <button
              type="button"
              className={`action-btn ${antiCheatAlert ? 'alert-active' : 'secondary'}`}
              onClick={handleAntiCheatTest}
            >
              <ShieldAlert size={13} /> {antiCheatAlert ? 'Violation Flagged!' : 'Test Anti-Cheat Signal'}
            </button>
          ) : (
            <button
              type="button"
              className="action-btn secondary"
              onClick={() => {
                setAuditLog((prev) => [
                  `⚡ [RECONNECTION RECOVERY] Wi-Fi drop detected. Requesting missed frames seq #SEQ-498 to #SEQ-500 from Redis buffer. State restored seamlessly!`,
                  ...prev.slice(0, 4),
                ]);
              }}
            >
              <Zap size={13} /> Simulate Reconnection
            </button>
          )}

          <button
            type="button"
            className={`action-btn ${isScaled ? 'scaled-active' : 'secondary'}`}
            onClick={handleScaleToggle}
          >
            <Cpu size={13} /> {isScaled ? 'Scale Down Workers' : 'Simulate 1,000+ Spike'}
          </button>
        </div>
      </div>

      {/* Visual React Flow Canvas Wrapped in Provider */}
      <div className="flow-canvas-container">
        <ReactFlowProvider>
          <FlowCanvas
            isCodeSkill={isCodeSkill}
            isDark={isDark}
            step={step}
            isScaled={isScaled}
            antiCheatAlert={antiCheatAlert}
          />
        </ReactFlowProvider>

        {antiCheatAlert && (
          <div className="anti-cheat-overlay">
            <ShieldAlert size={20} />
            <div>
              <strong>ANTI-CHEAT SIGNAL DETECTED</strong>
              <p>Tab Blur + DevTools inspection audit logged. Candidate video feed flag raised.</p>
            </div>
          </div>
        )}
      </div>

      {/* Live Telemetry / Audit Log */}
      <div className="telemetry-bar">
        <div className="telemetry-header">
          <span className="mono">SYSTEM PIPELINE AUDIT LOG</span>
          <span className="status-label">
            {step < 0 ? (
              <span className="text-ready">● SYSTEM READY FOR EVENT</span>
            ) : (
              <span className="text-active">● PIPELINE STAGE {step + 1} OF 5 RUNNING</span>
            )}
          </span>
        </div>

        <div className="audit-feed">
          {auditLog.length > 0 ? (
            auditLog.map((log, i) => (
              <div key={i} className={`log-entry ${i === 0 ? 'latest' : ''}`}>
                <span className="log-bullet">›</span>
                <span className="log-text">{log}</span>
              </div>
            ))
          ) : (
            <div className="log-entry empty">
              <span className="log-text">
                Press &quot;Submit {isCodeSkill ? `${activeLang} Solution` : 'Broadcast Live Frame'}&quot; to trace data flow through {isCodeSkill ? 'NestJS, BullMQ, Docker sandboxes, and 128 database shards' : 'Express, Socket.IO, Redis pub/sub, and WebRTC'}.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
