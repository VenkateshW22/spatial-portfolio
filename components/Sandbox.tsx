'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Play, ShieldAlert, Cpu, RefreshCw, CheckCircle2, Zap } from 'lucide-react';

interface SandboxProps {
  project: string;
}

export default function Sandbox({ project }: SandboxProps) {
  const isCodeSkill = project === 'CodeSkill';

  // State management
  const [step, setStep] = useState<number>(-1);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [isScaled, setIsScaled] = useState<boolean>(false);
  const [antiCheatAlert, setAntiCheatAlert] = useState<boolean>(false);
  const [activeLang, setActiveLang] = useState<'Java' | 'Python' | 'C++'>('Java');
  const [auditLog, setAuditLog] = useState<string[]>([]);

  // Node architecture definitions
  const initialNodes: Node[] = useMemo(() => {
    if (isCodeSkill) {
      return [
        {
          id: 'client',
          position: { x: 20, y: 110 },
          data: { label: '01 · Next.js 16 WebApp\n(Candidate IDE + Anti-Cheat)' },
          style: { background: '#ffffff', border: '2px solid #254be8', borderRadius: '8px', padding: '10px', fontSize: '11px', fontWeight: 600, color: '#0f172a', width: 175 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
        {
          id: 'gateway',
          position: { x: 240, y: 110 },
          data: { label: '02 · NestJS Gateway\n(Socket.IO + Auth Guards)' },
          style: { background: '#ffffff', border: '2px solid #94a3b8', borderRadius: '8px', padding: '10px', fontSize: '11px', fontWeight: 600, color: '#0f172a', width: 175 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
        {
          id: 'queue',
          position: { x: 460, y: 30 },
          data: { label: '03 · BullMQ on Redis\n(Async Job Queue)' },
          style: { background: '#ffffff', border: '2px solid #94a3b8', borderRadius: '8px', padding: '10px', fontSize: '11px', fontWeight: 600, color: '#0f172a', width: 175 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
        {
          id: 'sandbox',
          position: { x: 460, y: 190 },
          data: { label: '04 · Docker Sandboxes\n(Isolated Piston Runner)' },
          style: { background: '#ffffff', border: '2px solid #94a3b8', borderRadius: '8px', padding: '10px', fontSize: '11px', fontWeight: 600, color: '#0f172a', width: 175 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
        {
          id: 'shards',
          position: { x: 690, y: 110 },
          data: { label: '05 · PostgreSQL 128 Shards\n(Hash Partition Buckets)' },
          style: { background: '#ffffff', border: '2px solid #94a3b8', borderRadius: '8px', padding: '10px', fontSize: '11px', fontWeight: 600, color: '#0f172a', width: 185 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
      ];
    } else {
      // SyncDeck Architecture
      return [
        {
          id: 'host',
          position: { x: 20, y: 110 },
          data: { label: '01 · Instructor Host\n(React 19 + Whiteboard)' },
          style: { background: '#ffffff', border: '2px solid #254be8', borderRadius: '8px', padding: '10px', fontSize: '11px', fontWeight: 600, color: '#0f172a', width: 175 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
        {
          id: 'gateway',
          position: { x: 240, y: 110 },
          data: { label: '02 · Express + Socket.IO\n(Distributed State Sync)' },
          style: { background: '#ffffff', border: '2px solid #94a3b8', borderRadius: '8px', padding: '10px', fontSize: '11px', fontWeight: 600, color: '#0f172a', width: 175 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
        {
          id: 'redis',
          position: { x: 460, y: 30 },
          data: { label: '03 · Redis Pub/Sub Cluster\n(Replay Log & Delta Buffer)' },
          style: { background: '#ffffff', border: '2px solid #94a3b8', borderRadius: '8px', padding: '10px', fontSize: '11px', fontWeight: 600, color: '#0f172a', width: 180 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
        {
          id: 'webrtc',
          position: { x: 460, y: 190 },
          data: { label: '04 · WebRTC Screen Mesh\n(Low-latency Media Pipeline)' },
          style: { background: '#ffffff', border: '2px solid #94a3b8', borderRadius: '8px', padding: '10px', fontSize: '11px', fontWeight: 600, color: '#0f172a', width: 180 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
        {
          id: 'students',
          position: { x: 690, y: 110 },
          data: { label: '05 · Student Cohorts\n(3,000+ Synchronized Peers)' },
          style: { background: '#ffffff', border: '2px solid #94a3b8', borderRadius: '8px', padding: '10px', fontSize: '11px', fontWeight: 600, color: '#0f172a', width: 185 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
      ];
    }
  }, [isCodeSkill]);

  const initialEdges: Edge[] = useMemo(() => {
    const edgeColor = '#254be8';
    if (isCodeSkill) {
      return [
        { id: 'e1', source: 'client', target: 'gateway', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: edgeColor, strokeWidth: 2 } },
        { id: 'e2', source: 'gateway', target: 'queue', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: edgeColor, strokeWidth: 2 } },
        { id: 'e3', source: 'queue', target: 'sandbox', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: edgeColor, strokeWidth: 2 } },
        { id: 'e4', source: 'sandbox', target: 'shards', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: edgeColor, strokeWidth: 2 } },
      ];
    } else {
      return [
        { id: 'e1', source: 'host', target: 'gateway', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: edgeColor, strokeWidth: 2 } },
        { id: 'e2', source: 'gateway', target: 'redis', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: edgeColor, strokeWidth: 2 } },
        { id: 'e3', source: 'gateway', target: 'webrtc', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: edgeColor, strokeWidth: 2 } },
        { id: 'e4', source: 'redis', target: 'students', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: edgeColor, strokeWidth: 2 } },
        { id: 'e5', source: 'webrtc', target: 'students', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: edgeColor, strokeWidth: 2 } },
      ];
    }
  }, [isCodeSkill]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Simulation steps explanation
  const codeSkillSteps = [
    `[Client] Candidate submits ${activeLang} solution. Anti-cheat client integrity signed.`,
    `[Gateway] NestJS authenticates JWT & pushes payload to BullMQ queue.`,
    `[BullMQ] Redis assigns job #SUB-${1000 + completedCount}. Enforcing concurrency limit (max 16).`,
    `[Docker/Piston] Spun isolated sandbox with 256MB RAM / 2.0s CPU bounds. Verified 15/15 test cases.`,
    `[Database] Hash(userId) % 128 -> Partition Shard #${(completedCount * 17 + 23) % 128} committed successfully!`,
  ];

  const syncDeckSteps = [
    `[Presenter] Slide #4 and collaborative canvas strokes emitted by host.`,
    `[Socket.IO Gateway] Broadcast request parsed, assigned Sequence #SEQ-${500 + completedCount}.`,
    `[Redis Cluster] Pub/Sub fanout executed; delta frame cached in replay buffer for reconnects.`,
    `[WebRTC Engine] Screen stream synchronized via P2P mesh and selective forwarding.`,
    `[Student Peers] 1,000+ concurrent students rendered whiteboard updates with <45ms latency!`,
  ];

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
  }, [step, activeSteps, completedCount]);

  // Sync edge and node animation with active step
  useEffect(() => {
    setEdges((es) =>
      es.map((e, idx) => ({
        ...e,
        animated: step >= 0 && idx <= step,
        style: {
          stroke: step === idx ? '#254be8' : '#94a3b8',
          strokeWidth: step === idx ? 3 : 2,
        },
      }))
    );

    setNodes((ns) =>
      ns.map((n, idx) => {
        const isActive = step === idx;
        return {
          ...n,
          style: {
            ...n.style,
            borderColor: isActive ? '#254be8' : '#94a3b8',
            boxShadow: isActive ? '0 0 0 6px rgba(37, 75, 232, 0.18)' : 'none',
            transform: isActive ? 'scale(1.03)' : 'scale(1)',
            transition: 'all 0.25s ease',
          },
        };
      })
    );
  }, [step, setNodes, setEdges]);

  // Handle traffic scaling
  const handleScaleToggle = () => {
    setIsScaled((prev) => {
      const next = !prev;
      if (next) {
        // Add replica worker node
        setNodes((ns) => [
          ...ns,
          {
            id: 'replica-worker',
            position: { x: 460, y: isCodeSkill ? 280 : 280 },
            data: { label: isCodeSkill ? '04b · Worker Replica #2\n(Auto-Scaled ASG Container)' : '04b · Edge TURN/Relay\n(Auto-Scaled WebRTC)' },
            style: { background: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '8px', padding: '10px', fontSize: '11px', fontWeight: 600, color: '#166534', width: 185 },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
          },
        ]);
        setEdges((es) => [
          ...es,
          {
            id: 'scale-edge-1',
            source: isCodeSkill ? 'queue' : 'gateway',
            target: 'replica-worker',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: '#22c55e', strokeWidth: 2 },
          },
          {
            id: 'scale-edge-2',
            source: 'replica-worker',
            target: isCodeSkill ? 'shards' : 'students',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: '#22c55e', strokeWidth: 2 },
          },
        ]);
      } else {
        setNodes((ns) => ns.filter((n) => n.id !== 'replica-worker'));
        setEdges((es) => es.filter((e) => !e.id.startsWith('scale-edge')));
      }
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
      {/* Top Controls Toolbar */}
      <div className="sandbox-toolbar">
        <div className="toolbar-status">
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
                  `⚡ [RECONNECTION RECOVERY] Wi-Fi reconnection detected. Requesting missed frames seq #SEQ-498 to #SEQ-500 from Redis buffer. State restored seamlessly!`,
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

      {/* Visual React Flow Canvas */}
      <div className="flow-canvas-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          minZoom={0.4}
          maxZoom={1.2}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#cbd5e1" gap={24} size={1.2} />
          <Controls showInteractive={false} />
        </ReactFlow>

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
