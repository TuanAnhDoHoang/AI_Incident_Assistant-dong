// ===== Admin Bot Chat Page =====
import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { getServiceById, getUserRoleInService } from '../../data/mockData';
import styles from './AdminBotChatPage.module.css';

// ── Bot types ──
interface BotMessage {
  id: string;
  sender: 'bot' | 'admin';
  content: string;
  timestamp: string;
  isReport?: boolean;
}

const BOT_REPORTS = [
  '📊 Service health check complete. All endpoints responding within SLA thresholds. P95 latency: 128ms.',
  '⚠️ CPU utilization on node-3 reached 78%. Auto-scaling policy triggered. New instance provisioning in progress.',
  '✅ Memory usage nominal: 4.2 GB / 16 GB (26%). No memory leaks detected in the last 24h cycle.',
  '🔄 Scheduled maintenance window approaching in 2 hours. Pre-flight checks initiated across all regions.',
  '📈 Traffic spike detected: +340% requests in last 15 min. Load balancer redistributing across 4 availability zones.',
  '🛡️ Security scan completed. 0 critical vulnerabilities found. 2 low-severity advisories pending review.',
  '⏱️ Average response latency: 42ms (P50), 128ms (P95), 340ms (P99). All within acceptable SLA range.',
  '🔔 Alert: Database connection pool at 85% capacity. Recommend increasing max_connections to 200.',
  '📋 Daily digest: 99.97% uptime, 2.4M requests served, 3 incidents auto-resolved by remediation engine.',
  '🔍 Anomaly detection: Unusual pattern in /api/v2/payments endpoint. Investigating request distribution.',
  '🌐 CDN cache hit ratio: 94.2%. Edge node performance optimal. No origin shield overloads detected.',
  '🔐 Certificate rotation completed for 3 domains. All TLS handshakes verified. Next rotation in 60 days.',
];

const BOT_REPLIES: Record<string, string> = {
  status: '🟢 All systems operational.\n\n• Last incident: 12h ago (auto-resolved in 47s)\n• Current uptime streak: 14 days\n• Active instances: 4 primary, 2 standby\n• Error rate: 0.03%',
  health: '📊 Infrastructure Health Matrix:\n\n• CPU: 34% avg (peak 78% on node-3)\n• Memory: 26% (4.2/16 GB)\n• Disk I/O: 52% utilization\n• Network: 1.2 Gbps throughput\n• All metrics within normal parameters.',
  scale: '🔄 Auto-Scaling Report:\n\n• Active instances: 4\n• Standby instances: 2\n• CPU threshold: 70%\n• Memory threshold: 80%\n• Last scale event: 2h ago\n• Recommendation: No changes needed.',
  logs: '📝 Log Analysis (last 1h):\n\n• Total entries: 12,847\n• ERROR: 0 (0.00%)\n• WARN: 3 (non-critical)\n• INFO: 12,844\n• No anomalous patterns detected.\n• Top endpoint: /api/v2/users (3.2k req)',
  report: '📋 Full Service Report\n━━━━━━━━━━━━━━━━\n• Uptime (30d): 99.97%\n• Avg latency: 42ms\n• P99 latency: 340ms\n• Error rate: 0.03%\n• Requests served: 72.1M\n• Active alerts: 0\n• Pending maintenance: 1 scheduled\n• Cost optimization: -12% vs last month',
  security: '🛡️ Security Posture:\n\n• Last scan: 2h ago\n• Firewall rules: 24 active\n• WAF blocks (24h): 1,247\n• SSL certificates: Valid (89 days remaining)\n• IAM audit: Clean\n• Intrusion attempts: 0 detected',
  cost: '💰 Cost Analysis:\n\n• Current month: $4,230\n• Projected: $4,890\n• vs Last month: -12%\n• Biggest cost: Compute (68%)\n• Savings opportunity: Reserved instances could save ~$800/mo',
  default: 'Understood. I\'m processing your request and will update you with findings shortly. Running diagnostics now...',
};

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, reply] of Object.entries(BOT_REPLIES)) {
    if (key !== 'default' && lower.includes(key)) return reply;
  }
  return BOT_REPLIES.default;
}

export default function AdminBotChatPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const service = getServiceById(serviceId || '');
  const userRole = getUserRoleInService(user?.id || '', serviceId || '');

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const [messages, setMessages] = useState<BotMessage[]>([
    { id: 'sys-1', sender: 'bot', content: `🤖 IncidentX Bot online. Connected to ${service?.name || 'service'} monitoring pipeline.\nType a command or ask about: status, health, report, scale, logs, security, cost`, timestamp: now() },
    { id: 'report-1', sender: 'bot', content: BOT_REPORTS[0], timestamp: now(), isReport: true },
    { id: 'report-2', sender: 'bot', content: BOT_REPORTS[1], timestamp: now(), isReport: true },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reportIndex = useRef(2);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Bot sends periodic reports (every 15s)
  useEffect(() => {
    const interval = setInterval(() => {
      const idx = reportIndex.current % BOT_REPORTS.length;
      reportIndex.current++;
      setMessages(prev => [...prev, {
        id: `report-${Date.now()}`,
        sender: 'bot',
        content: BOT_REPORTS[idx],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isReport: true,
      }]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: `admin-${Date.now()}`,
      sender: 'admin',
      content: input,
      timestamp: now(),
    }]);
    const query = input;
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `reply-${Date.now()}`,
        sender: 'bot',
        content: getBotReply(query),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1000);
  }, [input]);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  if (!service) {
    return (
      <div className={styles.page}>
        <Sidebar />
        <main className={styles.main}>
          <p style={{ padding: 48 }}>Service not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Sidebar />
      <main className={`${styles.main} page-transition`}>
        {/* Back nav */}
        <button className={styles.backBtn} onClick={() => navigate(`/service/${service.id}`)}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          {service.name} / Bot Console
        </button>

        <div className={styles.chatContainer}>
          {/* ── Chat Area ── */}
          <div className={styles.chatArea}>
            {/* Header */}
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderInfo}>
                <div className={styles.chatTitleRow}>
                  <div className={styles.botIcon}>
                    <span className="material-symbols-outlined" style={{ color: '#2dd4bf', fontSize: 20, fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                  </div>
                  <div>
                    <h2 className={styles.chatTitle}>IncidentX Bot Console</h2>
                    <p className={styles.chatSubtitle}>{service.name} · Real-time monitoring & reports</p>
                  </div>
                </div>
                <div className={styles.headerBadges}>
                  <span className={styles.liveBadge}>
                    <span className={styles.liveDot} />
                    LIVE
                  </span>
                  <span className={styles.roleBadge}>
                    {userRole === 'admin' ? 'ADMIN' : 'VIEWER'}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className={styles.messages}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.msgRow} ${msg.sender === 'admin' ? styles.msgRowRight : styles.msgRowLeft}`}
                >
                  {/* Avatar */}
                  <div className={`${styles.msgAvatar} ${msg.sender === 'bot' ? styles.msgAvatarBot : styles.msgAvatarAdmin}`}>
                    {msg.sender === 'bot' ? (
                      <span className="material-symbols-outlined" style={{ color: '#2dd4bf', fontSize: 18, fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                    ) : user?.avatar ? (
                      <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      getInitials(user?.name || 'A')
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={`${styles.msgBody} ${msg.sender === 'admin' ? styles.msgBodyRight : ''}`}>
                    <div className={`${styles.msgMeta} ${msg.sender === 'admin' ? styles.msgMetaRight : ''}`}>
                      {msg.sender === 'admin' && <span className={styles.msgTime}>{msg.timestamp}</span>}
                      <span className={`${styles.msgSender} ${msg.sender === 'bot' ? styles.msgSenderBot : ''}`}>
                        {msg.sender === 'bot' ? 'IncidentX Bot' : `${user?.name || 'Admin'} (You)`}
                      </span>
                      {msg.sender === 'bot' && <span className={styles.msgTime}>{msg.timestamp}</span>}
                      {msg.isReport && <span className={styles.reportTag}>REPORT</span>}
                    </div>
                    <div className={`${styles.msgBubble} ${
                      msg.sender === 'bot'
                        ? (msg.isReport ? styles.msgBubbleReport : styles.msgBubbleBot)
                        : styles.msgBubbleAdmin
                    }`}>
                      <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={styles.chatInputArea}>
              <div className={styles.chatInputWrap}>
                <div className={styles.quickActions}>
                  {['status', 'health', 'report', 'logs'].map(cmd => (
                    <button
                      key={cmd}
                      className={styles.quickBtn}
                      onClick={() => {
                        setInput(cmd);
                        setTimeout(() => {
                          setMessages(prev => [...prev, {
                            id: `admin-${Date.now()}`,
                            sender: 'admin',
                            content: cmd,
                            timestamp: now(),
                          }]);
                          setTimeout(() => {
                            setMessages(prev => [...prev, {
                              id: `reply-${Date.now()}`,
                              sender: 'bot',
                              content: getBotReply(cmd),
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            }]);
                          }, 1000);
                          setInput('');
                        }, 100);
                      }}
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
                <div className={styles.inputRow}>
                  <textarea
                    id="bot-chat-input"
                    className={styles.chatTextarea}
                    placeholder="Ask the bot... (try: status, health, report, scale, logs, security, cost)"
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <button className={styles.sendBtn} onClick={handleSend}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Info Sidebar ── */}
          <div className={styles.infoSidebar}>
            <div className={styles.infoHeader}>
              <h3 className={styles.infoTitle}>Bot Intelligence</h3>
              <p className={styles.infoSub}>Monitoring Pipeline</p>
            </div>

            <div className={styles.infoSection}>
              <p className={styles.infoLabel}>STATUS</p>
              <div className={`${styles.statusCard} glass-panel`}>
                <div className={styles.statusRow}>
                  <span style={{ color: '#2dd4bf' }}>●</span>
                  <span>Online & Monitoring</span>
                </div>
                <div className={styles.statusRow}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#64748b' }}>schedule</span>
                  <span>Reports every 15s</span>
                </div>
                <div className={styles.statusRow}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#64748b' }}>speed</span>
                  <span>Latency: 42ms avg</span>
                </div>
              </div>
            </div>

            <div className={styles.infoSection}>
              <p className={styles.infoLabel}>CAPABILITIES</p>
              <div className={styles.capList}>
                {[
                  { icon: 'monitoring', label: 'Health Monitoring' },
                  { icon: 'security', label: 'Security Scanning' },
                  { icon: 'auto_fix_high', label: 'Auto-Remediation' },
                  { icon: 'analytics', label: 'Performance Analysis' },
                  { icon: 'scale', label: 'Auto-Scaling' },
                  { icon: 'receipt_long', label: 'Cost Reports' },
                ].map(cap => (
                  <div key={cap.icon} className={styles.capItem}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#2dd4bf' }}>{cap.icon}</span>
                    <span>{cap.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.infoSection}>
              <p className={styles.infoLabel}>QUICK COMMANDS</p>
              <div className={styles.cmdList}>
                {Object.keys(BOT_REPLIES).filter(k => k !== 'default').map(cmd => (
                  <button
                    key={cmd}
                    className={styles.cmdBtn}
                    onClick={() => {
                      setInput(cmd);
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>terminal</span>
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
