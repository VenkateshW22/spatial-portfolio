'use client';

import { useState, useEffect } from 'react';
import { Play, RotateCcw, AlertTriangle, CheckCircle, Database, ShieldCheck, Zap, Activity, Cpu } from 'lucide-react';

interface ExplainerLabProps {
  initialLesson?: number;
  onSound?: () => void;
}

export default function ExplainerLab({ initialLesson = 0, onSound }: ExplainerLabProps) {
  const [activeTab, setActiveTab] = useState<number>(initialLesson);

  // Lesson 1: Sharding State
  const [candidateId, setCandidateId] = useState<string>('candidate_4821');
  const [calculatedShard, setCalculatedShard] = useState<number>(37);
  const [hashValue, setHashValue] = useState<number>(10405);

  const calculateHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const positiveHash = Math.abs(hash);
    const shard = positiveHash % 128;
    setHashValue(positiveHash);
    setCalculatedShard(shard);
    if (onSound) onSound();
  };

  useEffect(() => {
    calculateHash(candidateId);
  }, []);

  // Lesson 2: Circuit Breaker State (Resilience4j)
  const [cbState, setCbState] = useState<'CLOSED' | 'OPEN' | 'HALF_OPEN'>('CLOSED');
  const [requestHistory, setRequestHistory] = useState<Array<'SUCCESS' | 'FAIL'>>([
    'SUCCESS', 'SUCCESS', 'SUCCESS', 'SUCCESS'
  ]);
  const [cooldown, setCooldown] = useState<number>(0);

  const handleCbRequest = (isFail: boolean) => {
    if (onSound) onSound();
    if (cbState === 'OPEN') return;

    const newHistory: Array<'SUCCESS' | 'FAIL'> = [...requestHistory.slice(-9), isFail ? 'FAIL' : 'SUCCESS'];
    setRequestHistory(newHistory);

    const failCount = newHistory.filter((r) => r === 'FAIL').length;
    const failRate = (failCount / newHistory.length) * 100;

    if (cbState === 'HALF_OPEN') {
      if (isFail) {
        setCbState('OPEN');
        setCooldown(5);
      } else {
        setCbState('CLOSED');
      }
    } else if (failRate >= 50 && newHistory.length >= 4) {
      setCbState('OPEN');
      setCooldown(5);
    }
  };

  useEffect(() => {
    if (cbState !== 'OPEN' || cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          setCbState('HALF_OPEN');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cbState, cooldown]);

  // Lesson 3: BullMQ Job Queue
  const [queueJobs, setQueueJobs] = useState<Array<{ id: number; lang: string; status: 'queued' | 'running' | 'completed' }>>([
    { id: 101, lang: 'Java', status: 'completed' },
    { id: 102, lang: 'Python', status: 'completed' },
  ]);
  const [nextJobId, setNextJobId] = useState<number>(103);

  const handleEnqueue = (lang: string) => {
    if (onSound) onSound();
    const jobId = nextJobId;
    setNextJobId((id) => id + 1);
    const newJob = { id: jobId, lang, status: 'queued' as const };
    setQueueJobs((prev) => [...prev.slice(-4), newJob]);

    // Move to running
    setTimeout(() => {
      setQueueJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: 'running' } : j))
      );
      // Move to completed
      setTimeout(() => {
        setQueueJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: 'completed' } : j))
        );
      }, 1200);
    }, 600);
  };

  // Lesson 4: WebSocket Sync & Reconnect
  const [isClientConnected, setIsClientConnected] = useState<boolean>(true);
  const [serverSeq, setServerSeq] = useState<number>(105);
  const [clientSeq, setClientSeq] = useState<number>(105);
  const [reconnectLog, setReconnectLog] = useState<string>('Client synchronized with presenter at sequence #105');

  const handleHostAction = () => {
    if (onSound) onSound();
    const nextSeq = serverSeq + 1;
    setServerSeq(nextSeq);
    if (isClientConnected) {
      setClientSeq(nextSeq);
      setReconnectLog(`Broadcast slide update #SEQ-${nextSeq} rendered in real-time (<35ms).`);
    } else {
      setReconnectLog(`Slide update #SEQ-${nextSeq} buffered in Redis delta ring buffer (client is offline).`);
    }
  };

  const handleToggleConnection = () => {
    if (onSound) onSound();
    if (isClientConnected) {
      setIsClientConnected(false);
      setReconnectLog('Student disconnected (Wi-Fi dropped). Host updates will buffer in Redis.');
    } else {
      setIsClientConnected(true);
      const missedCount = serverSeq - clientSeq;
      setClientSeq(serverSeq);
      setReconnectLog(
        missedCount > 0
          ? `Reconnected! Client fetched ${missedCount} missed frame(s) from Redis delta buffer (#SEQ-${clientSeq + 1} to #SEQ-${serverSeq}). State restored!`
          : 'Reconnected! Client already up to date.'
      );
    }
  };

  return (
    <div className="explainer-lab-container">
      {/* Lesson Selector Tabs */}
      <div className="lab-tabs" role="tablist">
        {[
          { title: '128-Shard Partitioning', subtitle: 'PostgreSQL & Hash Routing', icon: Database },
          { title: 'Circuit Breaker Pattern', subtitle: 'Resilience4j at Oracle', icon: ShieldCheck },
          { title: 'Distributed Job Queue', subtitle: 'BullMQ + Redis Sandboxes', icon: Cpu },
          { title: 'State Sync & Recovery', subtitle: 'WebSocket & Redis Buffers', icon: Activity },
        ].map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === idx;
          return (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`lab-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(idx);
                if (onSound) onSound();
              }}
            >
              <div className="tab-icon-wrap">
                <Icon size={16} />
              </div>
              <div className="tab-meta">
                <span className="tab-title">{tab.title}</span>
                <span className="tab-subtitle">{tab.subtitle}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Lesson Body Content */}
      <div className="lab-viewport">
        {/* LESSON 0: 128-Bucket Sharding */}
        {activeTab === 0 && (
          <div className="lesson-panel">
            <div className="lesson-header">
              <span className="mono">EXPLAINER 01 / SCALABLE ARCHITECTURE</span>
              <h3>Logical Database Sharding across 128 Hash Buckets</h3>
              <p>
                In <strong>CodeSkill</strong>, storing 1,000+ concurrent multi-test submissions in a single monolithic table causes catastrophic row-locking and sequential scan degradation.
                By applying a deterministic hash function <code>hash(userId) % 128</code>, submissions are automatically distributed across 128 declarative PostgreSQL partition tables.
              </p>
            </div>

            <div className="interactive-sandbox-card">
              <div className="input-group">
                <label htmlFor="shard-input" className="mono">TEST WITH ANY USER OR STUDENT ID:</label>
                <div className="input-row">
                  <input
                    id="shard-input"
                    type="text"
                    value={candidateId}
                    onChange={(e) => {
                      setCandidateId(e.target.value);
                      calculateHash(e.target.value);
                    }}
                    placeholder="e.g. candidate_99, student_cu_102"
                  />
                  <button
                    type="button"
                    className="preset-btn"
                    onClick={() => {
                      const id = `user_${Math.floor(Math.random() * 9000 + 1000)}`;
                      setCandidateId(id);
                      calculateHash(id);
                    }}
                  >
                    Random ID ↗
                  </button>
                </div>
              </div>

              <div className="math-breakdown">
                <div className="math-step">
                  <span className="mono">INPUT KEY</span>
                  <strong>&quot;{candidateId}&quot;</strong>
                </div>
                <span className="math-op">→</span>
                <div className="math-step">
                  <span className="mono">DETERMINISTIC HASH</span>
                  <strong>{hashValue}</strong>
                </div>
                <span className="math-op">% 128 =</span>
                <div className="math-step highlight">
                  <span className="mono">ASSIGNED PARTITION</span>
                  <strong>Bucket #{calculatedShard}</strong>
                </div>
              </div>

              {/* 128 Bucket Visualizer Grid */}
              <div className="bucket-grid-label">
                <span className="mono">POSTGRESQL 128-PARTITION TABLE CLUSTER (BUCKETS 0–127):</span>
                <span className="mono highlight-text">TARGET: shard_p{calculatedShard.toString().padStart(3, '0')}</span>
              </div>
              <div className="bucket-visual-grid">
                {Array.from({ length: 128 }).map((_, i) => {
                  const isTarget = i === calculatedShard;
                  return (
                    <div
                      key={i}
                      className={`grid-cell ${isTarget ? 'cell-active' : ''}`}
                      title={`Partition Shard #${i}`}
                    >
                      {isTarget ? i : ''}
                    </div>
                  );
                })}
              </div>

              <div className="takeaway-box">
                <CheckCircle size={15} />
                <span>
                  <strong>Key Takeaway:</strong> Submissions are uniformly scattered with uniform O(1) partition indexing, allowing concurrent writers to operate without lock contention.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* LESSON 1: Circuit Breaker Pattern */}
        {activeTab === 1 && (
          <div className="lesson-panel">
            <div className="lesson-header">
              <span className="mono">EXPLAINER 02 / FAULT TOLERANCE AT ORACLE</span>
              <h3>Resilience4j Circuit Breaker Pattern</h3>
              <p>
                During enterprise AWS RDS migrations at <strong>Oracle</strong>, downstream database clusters experience latency spikes or transient restarts.
                Without a circuit breaker, cascading thread starvation freezes the entire microservice ecosystem. Resilience4j protects the service by cutting the circuit and returning instantaneous fallbacks.
              </p>
            </div>

            <div className="interactive-sandbox-card">
              <div className="cb-status-display">
                <div className={`cb-state-pill state-${cbState.toLowerCase()}`}>
                  <span className="state-dot" />
                  <span>CIRCUIT STATE: <strong>{cbState}</strong></span>
                </div>
                {cbState === 'OPEN' && (
                  <span className="cooldown-timer mono">
                    Auto-testing health in {cooldown}s…
                  </span>
                )}
              </div>

              <div className="cb-actions">
                <button
                  type="button"
                  className="action-btn success-btn"
                  onClick={() => handleCbRequest(false)}
                >
                  <CheckCircle size={14} /> Send Healthy Request (200 OK)
                </button>
                <button
                  type="button"
                  className="action-btn danger-btn"
                  onClick={() => handleCbRequest(true)}
                >
                  <AlertTriangle size={14} /> Simulate Downstream RDS Failure (500)
                </button>
                <button
                  type="button"
                  className="action-btn reset-btn"
                  onClick={() => {
                    setRequestHistory(['SUCCESS', 'SUCCESS', 'SUCCESS', 'SUCCESS']);
                    setCbState('CLOSED');
                    if (onSound) onSound();
                  }}
                >
                  <RotateCcw size={14} /> Reset Circuit
                </button>
              </div>

              {/* Sliding Window Ring */}
              <div className="window-track">
                <span className="mono">SLIDING CALL WINDOW (LAST 10 REQUESTS):</span>
                <div className="call-dots">
                  {requestHistory.map((res, i) => (
                    <span key={i} className={`call-dot dot-${res.toLowerCase()}`} title={res}>
                      {res === 'SUCCESS' ? '✓' : '✕'}
                    </span>
                  ))}
                </div>
              </div>

              <div className="cb-explanation-card">
                {cbState === 'CLOSED' && (
                  <p>
                    🟢 <strong>Closed State:</strong> All traffic flows directly to downstream Spring Boot microservices and AWS RDS. Error rate is below the 50% threshold.
                  </p>
                )}
                {cbState === 'OPEN' && (
                  <p>
                    🔴 <strong>Open State:</strong> Failure rate exceeded 50%! The circuit has tripped open. Incoming requests are intercepted immediately and returned with fallback responses (&lt;2ms) to prevent cascading thread exhaustion.
                  </p>
                )}
                {cbState === 'HALF_OPEN' && (
                  <p>
                    🟡 <strong>Half-Open State:</strong> Cooldown elapsed. The circuit allows a canary request to test if the database migration or service has recovered.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* LESSON 2: BullMQ Job Queue */}
        {activeTab === 2 && (
          <div className="lesson-panel">
            <div className="lesson-header">
              <span className="mono">EXPLAINER 03 / ASYNC DISTRIBUTED EXECUTION</span>
              <h3>BullMQ & Redis Sandboxed Code Judge</h3>
              <p>
                In <strong>CodeSkill</strong>, running untrusted code on the main web thread would open security vulnerabilities and freeze the event loop.
                Submissions are decoupled into a high-throughput Redis BullMQ queue and executed inside ephemeral Docker/Piston sandboxes with strict memory and time quotas.
              </p>
            </div>

            <div className="interactive-sandbox-card">
              <div className="queue-controls">
                <span className="mono">ENQUEUE UNTRUSTED CODE SUBMISSION:</span>
                <div className="btn-row">
                  {(['Java 21', 'Python 3.12', 'C++ 20'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      className="queue-enqueue-btn"
                      onClick={() => handleEnqueue(lang)}
                    >
                      <Play size={13} /> Enqueue {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="queue-lanes">
                <div className="lane">
                  <span className="lane-title mono">WAITING IN REDIS QUEUE</span>
                  <div className="lane-items">
                    {queueJobs.filter((j) => j.status === 'queued').length === 0 && (
                      <span className="lane-empty">Queue empty</span>
                    )}
                    {queueJobs.filter((j) => j.status === 'queued').map((j) => (
                      <div key={j.id} className="job-card queued">
                        <strong>#SUB-{j.id}</strong>
                        <span>{j.lang}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lane">
                  <span className="lane-title mono">ACTIVE DOCKER RUNNER</span>
                  <div className="lane-items">
                    {queueJobs.filter((j) => j.status === 'running').length === 0 && (
                      <span className="lane-empty">No active worker</span>
                    )}
                    {queueJobs.filter((j) => j.status === 'running').map((j) => (
                      <div key={j.id} className="job-card running">
                        <div className="runner-pulse" />
                        <div>
                          <strong>#SUB-{j.id} · {j.lang}</strong>
                          <small>256MB RAM · 2.0s Max CPU</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lane">
                  <span className="lane-title mono">PASSED & PERSISTED</span>
                  <div className="lane-items">
                    {queueJobs.filter((j) => j.status === 'completed').map((j) => (
                      <div key={j.id} className="job-card completed">
                        <CheckCircle size={13} />
                        <strong>#SUB-{j.id}</strong>
                        <span>15/15 Passed (320ms)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LESSON 3: State Sync & Reconnection */}
        {activeTab === 3 && (
          <div className="lesson-panel">
            <div className="lesson-header">
              <span className="mono">EXPLAINER 04 / REAL-TIME COLLABORATION</span>
              <h3>WebSocket Sequence Sync & Reconnection Recovery</h3>
              <p>
                In <strong>SyncDeck</strong>, virtual classroom sessions must keep hundreds of students aligned on whiteboard annotations and slides, even when student network connections drop.
                Every event carries a monotonically increasing sequence ID, and Redis maintains a circular delta buffer to instantly catch up reconnected peers.
              </p>
            </div>

            <div className="interactive-sandbox-card">
              <div className="sync-bar-controls">
                <button
                  type="button"
                  className="action-btn primary"
                  onClick={handleHostAction}
                >
                  <Play size={13} /> Presenter: Advance Slide & Draw (#SEQ-{serverSeq + 1})
                </button>
                <button
                  type="button"
                  className={`action-btn ${isClientConnected ? 'danger-btn' : 'success-btn'}`}
                  onClick={handleToggleConnection}
                >
                  <Zap size={13} /> {isClientConnected ? 'Simulate Wi-Fi Drop (Disconnect)' : 'Restore Student Wi-Fi (Reconnect)'}
                </button>
              </div>

              <div className="sync-status-grid">
                <div className="sync-node presenter-node">
                  <span className="mono">INSTRUCTOR (HOST SERVER)</span>
                  <div className="node-val">
                    <span>Current Sequence:</span>
                    <strong>#SEQ-{serverSeq}</strong>
                  </div>
                  <small>Broadcasting via Socket.IO + Redis</small>
                </div>

                <div className="sync-divider">
                  <span className={isClientConnected ? 'link-online' : 'link-offline'}>
                    {isClientConnected ? '◀── WEBSOCKET ACTIVE ──▶' : '✕ LINK BROKEN (OFFLINE) ✕'}
                  </span>
                </div>

                <div className="sync-node student-node">
                  <span className="mono">STUDENT CLIENT (PEER)</span>
                  <div className="node-val">
                    <span>Rendered Sequence:</span>
                    <strong className={clientSeq !== serverSeq ? 'text-lag' : 'text-synced'}>
                      #SEQ-{clientSeq}
                    </strong>
                  </div>
                  <small>{isClientConnected ? 'Status: In Sync' : 'Status: Offline (Lagging)'}</small>
                </div>
              </div>

              <div className="reconnect-log-box mono">
                <span>EVENT STREAM:</span>
                <p>{reconnectLog}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
