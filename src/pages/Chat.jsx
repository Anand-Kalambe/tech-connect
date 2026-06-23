import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TopBar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import Avatar from '../components/Avatar';
import CreatePost from '../components/CreatePost';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function ConvoItem({ convo, onClick }) {
  // Determine time formatting
  const d = new Date(convo.time);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const timeStr = isToday
    ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <div className="convo-item" onClick={() => onClick(convo.user)} id={`convo-${convo.user._id}`}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Avatar username={convo.user.username} size={52} />
        {convo.unreadCount > 0 && (
          <span className="convo-unread-dot">{convo.unreadCount}</span>
        )}
      </div>
      <div className="convo-body">
        <div className="convo-top">
          <span className="convo-name">@{convo.user.username}</span>
          <span className="convo-time">{timeStr}</span>
        </div>
        <p className={`convo-last-msg${convo.unreadCount > 0 ? ' unread' : ''}`}>
          {convo.lastMessage}
        </p>
      </div>
    </div>
  );
}

function ChatWindow({ otherUser, onBack }) {
  const { user: me } = useAuth();
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  // Fetch initial messages and set up polling
  useEffect(() => {
    const fetchMsgs = async () => {
      try {
        const res = await api.get(`/messages/${otherUser._id}`);
        setMsgs(res.data);
      } catch (err) {
        console.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMsgs();
    const interval = setInterval(fetchMsgs, 3000); // Simple 3-sec polling
    return () => clearInterval(interval);
  }, [otherUser._id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const send = async () => {
    if (!input.trim()) return;
    const tempInput = input.trim();
    setInput('');
    try {
      const res = await api.post(`/messages/${otherUser._id}`, { content: tempInput });
      setMsgs((prev) => [...prev, res.data]);
    } catch (err) {
      toast.error('Failed to send message');
      setInput(tempInput); // restore input on failure
    }
  };

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-window-header">
        <button className="chat-back-btn" onClick={onBack} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <Avatar username={otherUser.username} size={38} />
        <div className="chat-window-info">
          <span className="chat-window-name">@{otherUser.username}</span>
        </div>
        <button className="top-bar-icon-btn" onClick={() => toast('Call feature coming soon 📞')} aria-label="Call">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: 40, color: 'var(--text-muted)' }}>
            Loading...
          </div>
        ) : msgs.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 40, color: 'var(--text-muted)' }}>
            Start the conversation with @{otherUser.username}
          </div>
        ) : (
          msgs.map((m) => {
            const isMine = m.sender._id === me?.id;
            const d = new Date(m.createdAt);
            const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={m._id} className={`chat-bubble-wrap${isMine ? ' mine' : ''}`}>
                {!isMine && <Avatar username={m.sender.username} size={30} />}
                <div className={`chat-bubble${isMine ? ' mine' : ''}`}>
                  <p>{m.content}</p>
                  <span className="chat-bubble-time">{timeStr}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chat-input-bar">
        <input
          id="chat-msg-input"
          type="text"
          placeholder="Message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          className="chat-input"
        />
        <button id="chat-send-btn" className="btn-send" onClick={send} disabled={!input.trim()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Chat() {
  const { user: me } = useAuth();
  const [openUser, setOpenUser] = useState(null);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  // Fetch recent conversations
  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const res = await api.get('/messages/conversations');
        setConvos(res.data);
      } catch (err) {
        toast.error('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };
    if (!openUser) fetchConvos();
  }, [openUser]);

  // Search users when typing
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/users/search?q=${encodeURIComponent(search.trim())}`);
        // Filter out current user from results
        setSearchResults(res.data.filter(u => u._id !== me?.id));
      } catch (err) {
        console.error('Search failed');
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, me?.id]);

  const startChat = (user) => {
    setOpenUser(user);
    setSearch('');
    setSearchResults([]);
  };

  return (
    <div className="page-shell">
      {!openUser && <TopBar />}

      <main className="page-content" style={{ paddingBottom: openUser ? 0 : undefined }}>
        {openUser ? (
          <ChatWindow otherUser={openUser} onBack={() => setOpenUser(null)} />
        ) : (
          <>
            {/* Search */}
            <div style={{ padding: '12px 16px 0' }}>
              <div className="social-search-input" style={{ borderRadius: 'var(--radius-lg)', padding: '10px 14px' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  id="chat-search-input"
                  type="text"
                  placeholder="Search users to chat..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Search Results */}
            {search.trim() && (
              <div className="convo-list" style={{ borderBottom: '4px solid var(--border-card)' }}>
                {searchResults.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No users found matching "{search}"
                  </div>
                ) : (
                  searchResults.map((su) => (
                    <div key={su._id} className="convo-item" onClick={() => startChat(su)}>
                      <Avatar username={su.username} size={42} />
                      <div className="convo-body">
                        <span className="convo-name">@{su.username}</span>
                        <p className="convo-last-msg">Start conversation</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {!search.trim() && (
              <>
                {/* Section header */}
                <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Messages
                  </span>
                </div>

                {/* Conversations list */}
                <div className="convo-list">
                  {loading ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Loading...
                    </div>
                  ) : convos.length === 0 ? (
                    <div className="empty-feed" style={{ padding: '40px 20px' }}>
                      <div className="empty-icon" style={{ fontSize: '48px' }}>💬</div>
                      <h3>No conversations</h3>
                      <p>Use search above to find users</p>
                    </div>
                  ) : (
                    convos.map((c) => (
                      <ConvoItem key={c.user._id} convo={c} onClick={startChat} />
                    ))
                  )}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {showCreate && (
        <CreatePost onPostCreated={() => {}} onClose={() => setShowCreate(false)} />
      )}

      {!openUser && <BottomNav onCreatePost={() => setShowCreate(true)} />}
    </div>
  );
}
