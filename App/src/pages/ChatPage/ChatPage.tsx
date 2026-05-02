// ===== Chat Page (chatting) =====
import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useAuth } from '../../context/AuthContext';
import {
  getAppById,
  getChatParticipantsForService,
  getChatMessagesForClient,
  getClientListForService,
  getUserRoleInService,
  incidentXBot,
} from '../../data/mockData';
import type { ChatMessage, ChatParticipant } from '../../types';
import styles from './ChatPage.module.css';

export default function ChatPage() {
  const { serviceId, appId } = useParams<{ serviceId: string; appId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const result = getAppById(serviceId || '', appId || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // User's role in this service
  const userRole = getUserRoleInService(user?.id || '', serviceId || '');
  const isStaffOrAdmin = userRole === 'staff' || userRole === 'admin';

  // All clients available for this service (for switching)
  const allClients = useMemo(
    () => getClientListForService(serviceId || ''),
    [serviceId]
  );

  // Active client being chatted with (only relevant for staff/admin)
  const [activeClientId, setActiveClientId] = useState<string | null>(
    allClients.length > 0 ? allClients[0].id : null
  );

  // Build participants from real data
  const participants = useMemo(
    () => getChatParticipantsForService(serviceId || '', activeClientId || undefined),
    [serviceId, activeClientId]
  );

  const allParticipants = useMemo(() => {
    return [...participants.clients, ...participants.staff, participants.bot];
  }, [participants]);

  // Messages for the current client conversation
  const initialMessages = useMemo(
    () => getChatMessagesForClient(serviceId || '', appId || '', activeClientId || ''),
    [serviceId, appId, activeClientId]
  );

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');

  // Reset messages when switching client
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!result) {
    return (
      <div className={styles.page}>
        <Sidebar />
        <main className={styles.main}>
          <p style={{ padding: 48 }}>App not found.</p>
        </main>
      </div>
    );
  }

  const { service, app } = result;

  // Current user as a participant (for sending messages)
  const currentUserParticipant: ChatParticipant = {
    id: user?.id || 'unknown',
    name: user?.name || 'You',
    role: userRole || 'Staff',
    avatar: user?.avatar || '',
    type: isStaffOrAdmin ? 'staff' : 'customer',
    isOnline: true,
  };

  // Simulated API for Bot Commands
  const mockBotApi = async (command: string, params?: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    switch (command) {
      case '/bug':
        return `[AIA] ✅ Đã ghi nhận sự cố mới\n\nTicket: SUP-102\nTitle: Su co General: ${params || 'N/A'}\nSeverity: P1\nSLA: 30 phút\nStatus: Open`;
      case '/status':
        return `📋 Incident đang mở (5):\n\n• SUP-101 [P1] Sự cố Payment: /bug Khách hàng báo lỗi không thể thanh toán qua VNPay trên iOS\n• SUP-101 [P1] Su co Payment: Hệ thống thanh toán bị lỗi, nhiều khách không checkout được\n• SUP-102 [P1] P1 incident: Payment failed for all users since 10am, system is down\n• SUP-101 [P1] Su co Login: @incident_assist_bot Mọi người ơi hình như hệ thống đang sập à? Nhiều \n• SUP-102 [P1] Su co General: @kudoissei Anh check giúp em lỗi xuất file Excel báo cáo doanh thu trê`;
      case '/help':
        return `Lệnh hỗ trợ:\n/bug [mô tả] – Báo cáo lỗi ngay lập tức\n/status – Xem danh sách incident đang xử lý\n/help – Hướng dẫn này`;
      default:
        return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessageContent = input.trim();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: currentUserParticipant,
      content: userMessageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: isStaffOrAdmin ? 'staff' : 'customer',
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Bot command logic: only responds if command is at the start
    const firstWord = userMessageContent.split(' ')[0];
    const isCommand = ['/bug', '/status', '/help'].includes(firstWord);

    if (isCommand) {
      const params = userMessageContent.substring(firstWord.length).trim();
      const botReplyContent = await mockBotApi(firstWord, params);

      if (botReplyContent) {
        const botReply: ChatMessage = {
          id: `msg-bot-${Date.now()}`,
          sender: incidentXBot,
          content: botReplyContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'bot',
        };
        setMessages(prev => [...prev, botReply]);
      }
    }
  };

  const handleSwitchClient = (clientId: string) => {
    setActiveClientId(clientId);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  const activeClient = allClients.find(c => c.id === activeClientId);

  return (
    <div className={styles.page}>
      <Sidebar />
      <main className={`${styles.main} page-transition`}>
        <button className={styles.backBtn} onClick={() => navigate(`/service/${service.id}`)}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          {service.name} / {app.name}
        </button>

        <div className={styles.chatContainer}>
          {/* Chat Area */}
          <div className={styles.chatArea}>
            {/* Header */}
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderInfo}>
                <div className={styles.chatTitleRow}>
                  <h2 className={styles.chatTitle}>
                    {activeClient ? `Chat — ${activeClient.name}` : `${app.name} Incident Channel`}
                  </h2>
                  {activeClient && <span className={styles.criticalBadge}>ACTIVE</span>}
                </div>
                <p className={styles.chatSubtitle}>
                  {activeClient
                    ? `Client: ${activeClient.name} · ${app.name}`
                    : `${participants.staff.length} staff online · ${app.name}`
                  }
                </p>
              </div>
              <div className={styles.chatActions}>
                <button className={`${styles.chatActionBtn} glass-panel`}>
                  <span className="material-symbols-outlined">phone</span>
                </button>
                <button className={`${styles.chatActionBtn} glass-panel`}>
                  <span className="material-symbols-outlined">videocam</span>
                </button>
                <button className={`${styles.chatActionBtn} glass-panel`}>
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className={styles.messages}>
              {messages.map((msg) => {
                if (msg.type === 'system') {
                  return (
                    <div key={msg.id} className={styles.systemMessage}>
                      <div className={styles.systemPill}>
                        <span className="material-symbols-outlined">terminal</span>
                        <span>{msg.content}</span>
                      </div>
                    </div>
                  );
                }

                // User's messages on the right, others on the left
                const isRight = msg.sender.id === user?.id;
                const isSelf = isRight;

                return (
                  <div
                    key={msg.id}
                    className={`${styles.messageRow} ${isRight ? styles.messageRowRight : styles.messageRowLeft}`}
                  >
                    <div className={`${styles.messageAvatar} ${msg.type === 'bot' ? styles.messageAvatarBot :
                      msg.type === 'staff' ? styles.messageAvatarStaff : ''
                      }`}>
                      {msg.type === 'bot' ? (
                        <span className="material-symbols-outlined" style={{ color: '#2dd4bf', fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                      ) : msg.sender.avatar ? (
                        <img src={msg.sender.avatar} alt={msg.sender.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        getInitials(msg.sender.name)
                      )}
                    </div>
                    <div className={`${styles.messageBody} ${isRight ? styles.messageBodyRight : ''}`}>
                      <div className={`${styles.messageMeta} ${isRight ? styles.messageMetaRight : ''}`}>
                        {isRight && <span className={styles.messageTime}>{msg.timestamp}</span>}
                        <span className={`${styles.messageSender} ${msg.type === 'bot' ? styles.messageSenderBot : ''}`}>
                          {isSelf ? `You (${msg.sender.name})` : msg.sender.name}
                          {msg.type === 'staff' && !isSelf ? ` · ${msg.sender.role}` : ''}
                        </span>
                        {!isRight && <span className={styles.messageTime}>{msg.timestamp}</span>}
                      </div>
                      <div className={`${styles.messageBubble} ${msg.type === 'customer' ? styles.messageBubbleCustomer :
                        msg.type === 'bot' ? styles.messageBubbleBot :
                          styles.messageBubbleStaff
                        } ${isRight ? styles.bubbleRight : styles.bubbleLeft}`}>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={styles.chatInputArea}>
              <div className={styles.chatInputWrap}>
                <div className={styles.chatInputBtns}>
                  <button className={styles.chatInputBtn}>
                    <span className="material-symbols-outlined">add_circle</span>
                  </button>
                  <button className={styles.chatInputBtn}>
                    <span className="material-symbols-outlined">image</span>
                  </button>
                  <button className={styles.chatInputBtn}>
                    <span className="material-symbols-outlined">attach_file</span>
                  </button>
                </div>
                <textarea
                  id="chat-input"
                  className={styles.chatTextarea}
                  placeholder="Reply to incident..."
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
                <button id="chat-send" className={styles.sendBtn} onClick={handleSend}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Participant Sidebar ── */}
          <div className={styles.participantSidebar}>
            <div className={styles.participantHeader}>
              <h3 className={styles.participantTitle}>Participants</h3>
              <p className={styles.participantCount}>{allParticipants.length} Active in Channel</p>
            </div>

            <div className={styles.participantList}>
              {/* Customer / Active Client */}
              {participants.clients.length > 0 && (
                <div className={styles.participantGroup}>
                  <p className={`${styles.participantGroupLabel} ${styles.participantGroupLabelCustomer}`}>Client</p>
                  {participants.clients.map((p) => (
                    <div key={p.id} className={styles.participantItem}>
                      <div className={styles.participantItemInfo}>
                        <div className={styles.participantAvatar}>
                          <div className={styles.participantAvatarImg}>
                            {p.avatar ? (
                              <img src={p.avatar} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            ) : (
                              getInitials(p.name)
                            )}
                          </div>
                          {p.isOnline && <span className={styles.participantOnline} />}
                        </div>
                        <div>
                          <p className={styles.participantName}>{p.name}</p>
                          <p className={`${styles.participantRole} ${styles.participantRoleCustomer}`}>{p.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Staff / Admin Team */}
              <div className={styles.participantGroup}>
                <p className={`${styles.participantGroupLabel} ${styles.participantGroupLabelTeam}`}>Service Team</p>
                {participants.staff.map((p) => (
                  <div key={p.id} className={styles.participantItem}>
                    <div className={styles.participantItemInfo}>
                      <div className={styles.participantAvatar}>
                        <div className={`${styles.participantAvatarImg} ${styles.participantAvatarTeam}`}>
                          {p.avatar ? (
                            <img src={p.avatar} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                          ) : (
                            getInitials(p.name)
                          )}
                        </div>
                        {p.isOnline && <span className={styles.participantOnline} />}
                      </div>
                      <div>
                        <p className={styles.participantName}>
                          {p.id === user?.id ? `${p.name} (You)` : p.name}
                        </p>
                        <p className={`${styles.participantRole} ${styles.participantRoleTeam}`}>{p.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bot */}
              <div className={styles.participantGroup}>
                <p className={`${styles.participantGroupLabel} ${styles.participantGroupLabelBot}`}>Automations</p>
                <div className={`${styles.participantItem} ${styles.participantItemBot}`}>
                  <div className={styles.participantItemInfo}>
                    <div className={styles.participantAvatar}>
                      <div className={`${styles.participantAvatarImg} ${styles.participantAvatarBot}`}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#2dd4bf' }}>smart_toy</span>
                      </div>
                    </div>
                    <div>
                      <p className={styles.participantName}>{participants.bot.name}</p>
                      <p className={`${styles.participantRole} ${styles.participantRoleBot}`}>{participants.bot.role}</p>
                    </div>
                  </div>
                  <span className={styles.participantPulse} />
                </div>
              </div>
            </div>

            {/* ── Switch Client Section (staff/admin only) ── */}
            {isStaffOrAdmin && allClients.length > 0 && (
              <div className={styles.clientSwitcher}>
                <div className={styles.clientSwitcherHeader}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#44e2cd' }}>swap_horiz</span>
                  <span className={styles.clientSwitcherTitle}>Switch Client</span>
                  <span className={styles.clientSwitcherCount}>{allClients.length}</span>
                </div>
                <div className={styles.clientSwitcherList}>
                  {allClients.map((client) => (
                    <button
                      key={client.id}
                      className={`${styles.clientSwitcherItem} ${activeClientId === client.id ? styles.clientSwitcherItemActive : ''
                        }`}
                      onClick={() => handleSwitchClient(client.id)}
                    >
                      <div className={styles.clientSwitcherInfo}>
                        <div className={styles.clientSwitcherAvatar}>
                          {client.avatar ? (
                            <img src={client.avatar} alt={client.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                          ) : (
                            getInitials(client.name)
                          )}
                        </div>
                        <div>
                          <p className={styles.clientSwitcherName}>{client.name}</p>
                          <p className={styles.clientSwitcherRole}>{client.role}</p>
                        </div>
                      </div>
                      {activeClientId === client.id && (
                        <span className={styles.clientSwitcherActive}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chat</span>
                        </span>
                      )}
                      {client.isOnline && activeClientId !== client.id && (
                        <span className={styles.clientSwitcherOnline} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button className={styles.inviteBtn}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>person_add</span>
              Invite Teammate
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
