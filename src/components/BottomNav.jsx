import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav({ onCreatePost }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const at = (p) => location.pathname === p || location.pathname.startsWith(p + '/');

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">

      {/* Feed */}
      <button
        id="nav-feed"
        className={`nav-item${at('/feed') ? ' active' : ''}`}
        onClick={() => navigate('/feed')}
        aria-label="Feed"
      >
        <span className="nav-item-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill={at('/feed') ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </span>
        <span className="nav-item-label">Feed</span>
      </button>

      {/* ── Create Post — lifted center button ── */}
      <div className="nav-create-wrap">
        <button
          id="nav-create"
          className="nav-create-btn"
          onClick={onCreatePost}
          aria-label="Create Post"
          title="Create Post"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5"  y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Chat */}
      <button
        id="nav-chat"
        className={`nav-item${at('/chat') ? ' active' : ''}`}
        onClick={() => navigate('/chat')}
        aria-label="Chat"
      >
        <span className="nav-item-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill={at('/chat') ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </span>
        <span className="nav-item-label">Chat</span>
      </button>

      {/* Profile */}
      <button
        id="nav-profile"
        className={`nav-item${at('/profile') ? ' active' : ''}`}
        onClick={() => navigate('/profile')}
        aria-label="Profile"
      >
        <span className="nav-item-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill={at('/profile') ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
        <span className="nav-item-label">Profile</span>
      </button>

    </nav>
  );
}
