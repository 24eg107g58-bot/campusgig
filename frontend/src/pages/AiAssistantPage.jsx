import React, { useState } from 'react';
import { aiApi } from '../api';
import { Sparkles, Send, Bot, User, HelpCircle, CheckCircle2 } from 'lucide-react';
import Loader from '../components/Loader';

export default function AiAssistantPage() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "👋 Hi! I am the **CAMPUSGIG AI Assistant**.\n\nI can help you:\n- 📝 Write winning freelance proposals & cover letters\n- 💰 Determine fair student pricing and milestones\n- 🎨 Improve your tech/design portfolio\n- 🔍 Match your skills with campus projects\n\nWhat can I assist you with today?",
      suggestions: [
        "How do I write a winning proposal?",
        "How should I price my freelance services?",
        "What makes a good portfolio project?",
        "How does the skill-based matching algorithm work?"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (textToSend) => {
    const prompt = (textToSend || input).trim();
    if (!prompt) return;

    const userMessage = { sender: 'user', text: prompt };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiApi.chat({ prompt });
      if (res.data) {
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: res.data.reply,
          mode: res.data.mode,
          suggestions: res.data.suggestions || []
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: 'Sorry, I encountered an error processing your question: ' + (err.message || 'Please try again.')
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="page-container" style={{ paddingBottom: '1.5rem' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.9rem',
            background: 'rgba(79, 70, 229, 0.1)',
            color: '#4F46E5',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={16} /> CAMPUSGIG Smart AI Hub
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A' }}>
            Freelance & Career AI Assistant
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '0.3rem' }}>
            Ask anything about pitching clients, pricing student gigs, and elevating your technical profile
          </p>
        </div>

        {/* Chat Window Container */}
        <div className="card" style={{
          display: 'flex',
          flexDirection: 'column',
          height: '620px',
          padding: 0,
          overflow: 'hidden'
        }}>
          {/* Messages feed */}
          <div style={{
            flex: 1,
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            background: '#F8FAFC'
          }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                {m.sender === 'ai' && (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Bot size={20} />
                  </div>
                )}

                <div>
                  <div style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '16px',
                    background: m.sender === 'user' ? '#4F46E5' : '#ffffff',
                    color: m.sender === 'user' ? '#ffffff' : '#1E293B',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                    fontSize: '0.925rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line'
                  }}>
                    {m.text}
                  </div>

                  {/* Suggestion Chips */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.65rem' }}>
                      {m.suggestions.map((s, si) => (
                        <button
                          key={si}
                          type="button"
                          onClick={() => sendMessage(s)}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #CBD5E1',
                            borderRadius: '9999px',
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.785rem',
                            fontWeight: 600,
                            color: '#4F46E5',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#EEF2FF'}
                          onMouseLeave={(e) => e.target.style.background = '#ffffff'}
                        >
                          ✨ {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#EEF2FF',
                  color: '#4F46E5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bot size={20} />
                </div>
                <div style={{ color: '#64748B', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  CAMPUSGIG AI is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: '1rem 1.25rem',
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
              placeholder="Ask for proposal advice, hourly rate suggestions, or portfolio tips..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.4rem' }}
            >
              <Send size={16} /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
