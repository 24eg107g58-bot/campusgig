import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { messageApi, userApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Send, MessageSquare, User, Search, CheckCheck } from 'lucide-react';
import Loader from '../components/Loader';

export default function MessagesPage() {
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('userId');

  const { user } = useAuth();
  const { onNewMessage } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const res = await messageApi.getConversations();
      if (res.data) {
        setConversations(res.data);

        // If targetUserId is given in URL
        if (targetUserId) {
          const existing = res.data.find(c => Number(c.otherUserId) === Number(targetUserId));
          if (existing) {
            setActiveUser({
              id: existing.otherUserId,
              name: existing.otherUserName,
              avatar: existing.otherUserAvatar,
              role: existing.otherUserRole
            });
          } else {
            // Load user profile
            const uRes = await userApi.getById(targetUserId);
            if (uRes.data) {
              setActiveUser({
                id: uRes.data.id,
                name: uRes.data.fullName,
                avatar: uRes.data.avatarUrl,
                role: uRes.data.role
              });
            }
          }
        } else if (res.data.length > 0 && !activeUser) {
          const first = res.data[0];
          setActiveUser({
            id: first.otherUserId,
            name: first.otherUserName,
            avatar: first.otherUserAvatar,
            role: first.otherUserRole
          });
        }
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [targetUserId]);

  // Load message history when activeUser changes
  useEffect(() => {
    if (!activeUser) return;
    const loadMessages = async () => {
      try {
        const res = await messageApi.getMessages(activeUser.id);
        if (res.data) {
          setMessages(res.data);
          setTimeout(scrollToBottom, 100);
        }
      } catch (err) {
        console.error('Failed to load messages', err);
      }
    };
    loadMessages();
  }, [activeUser]);

  // Listen to WebSocket messages
  useEffect(() => {
    const unsubscribe = onNewMessage((newMsg) => {
      if (activeUser && (Number(newMsg.senderId) === Number(activeUser.id) || Number(newMsg.receiverId) === Number(activeUser.id))) {
        setMessages(prev => [...prev, newMsg]);
        setTimeout(scrollToBottom, 100);
      }
      loadConversations();
    });
    return () => unsubscribe();
  }, [activeUser, onNewMessage]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeUser) return;

    const textToSend = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const res = await messageApi.sendMessage({
        receiverId: activeUser.id,
        content: textToSend
      });
      if (res.data) {
        setMessages(prev => [...prev, res.data]);
        setTimeout(scrollToBottom, 100);
        loadConversations();
      }
    } catch (err) {
      alert(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader message="Connecting to CAMPUSGIG messenger..." />;

  return (
    <div className="page-container" style={{ paddingBottom: '1rem' }}>
      <div className="container">
        <div className="card" style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          height: 'calc(100vh - 190px)',
          minHeight: '560px',
          padding: 0,
          overflow: 'hidden'
        }}>
          {/* Left: Conversations list */}
          <div style={{ borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #F1F5F9' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                Messages
              </h2>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {conversations.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                  No message history yet. Connect on projects to chat!
                </div>
              ) : (
                conversations.map((c) => {
                  const isActive = activeUser && Number(activeUser.id) === Number(c.otherUserId);
                  return (
                    <div
                      key={c.id}
                      onClick={() => setActiveUser({
                        id: c.otherUserId,
                        name: c.otherUserName,
                        avatar: c.otherUserAvatar,
                        role: c.otherUserRole
                      })}
                      style={{
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        cursor: 'pointer',
                        borderBottom: '1px solid #F8FAFC',
                        background: isActive ? '#EEF2FF' : '#ffffff',
                        transition: 'background 0.15s'
                      }}
                    >
                      <img
                        src={c.otherUserAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.otherUserName)}&background=4F46E5&color=fff`}
                        alt={c.otherUserName}
                        style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                      />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                            {c.otherUserName}
                          </span>
                          {c.unreadCount > 0 && (
                            <span style={{
                              background: '#4F46E5',
                              color: '#fff',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              borderRadius: '9999px',
                              padding: '1px 6px'
                            }}>
                              {c.unreadCount}
                            </span>
                          )}
                        </div>

                        <div style={{
                          fontSize: '0.8rem',
                          color: '#64748B',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginTop: '2px'
                        }}>
                          {c.lastMessage || 'Start conversation...'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Message conversation pane */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F8FAFC' }}>
            {activeUser ? (
              <>
                {/* Active user header */}
                <div style={{
                  padding: '1rem 1.5rem',
                  background: '#ffffff',
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <img
                    src={activeUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeUser.name)}&background=4F46E5&color=fff`}
                    alt={activeUser.name}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
                      {activeUser.name}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                      ● Online / Real-Time WebSocket Connected
                    </div>
                  </div>
                </div>

                {/* Message bubbles */}
                <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: '2rem', fontSize: '0.9rem' }}>
                      Say hello to {activeUser.name} and discuss project milestones!
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = Number(m.senderId) === Number(user?.id);
                      return (
                        <div
                          key={m.id}
                          style={{
                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                            maxWidth: '70%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isMe ? 'flex-end' : 'flex-start'
                          }}
                        >
                          <div style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '16px',
                            borderBottomRightRadius: isMe ? '4px' : '16px',
                            borderBottomLeftRadius: !isMe ? '4px' : '16px',
                            background: isMe ? '#4F46E5' : '#ffffff',
                            color: isMe ? '#ffffff' : '#0F172A',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            fontSize: '0.925rem',
                            lineHeight: 1.5,
                            wordBreak: 'break-word'
                          }}>
                            {m.content}
                          </div>

                          <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '4px', padding: '0 4px' }}>
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input form */}
                <form
                  onSubmit={handleSendMessage}
                  style={{
                    padding: '1rem 1.5rem',
                    background: '#ffffff',
                    borderTop: '1px solid #E2E8F0',
                    display: 'flex',
                    gap: '0.75rem'
                  }}
                >
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder={`Type a message to ${activeUser.name}...`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputText.trim()}
                    className="btn btn-primary"
                    style={{ padding: '0.65rem 1.25rem' }}
                  >
                    <Send size={16} /> Send
                  </button>
                </form>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
                Select a conversation from the left to begin messaging.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
