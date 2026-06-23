import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import toast from 'react-hot-toast';

const LIVE_TICKERS = [
  '🎉 Shreya Koley earned 5 points from Level 3',
  '🏆 Krish just reached the #1 spot on Leaderboard!',
  '💰 Rahul Singh withdrew ₹500 successfully',
  '⭐ Anjali completed 10 tasks today!',
  '🎁 New task: Follow us on Instagram (+330 pts)',
  '🔥 258 users joined Tech Connect today!',
];

const TASK_CATEGORIES = [
  { id: 1, name: 'Instagram', icon: '📸', points: 330, tasks: 27, color: '#e1306c' },
  { id: 2, name: 'Facebook', icon: '👍', points: 60, tasks: 6, color: '#1877f2' },
  { id: 3, name: 'Twitter', icon: '🐦', points: 30, tasks: 3, color: '#1da1f2' },
  { id: 4, name: 'Social', icon: '🌐', points: 10, tasks: 1, color: '#10b981' },
  { id: 5, name: 'YouTube', icon: '▶️', points: 5010, tasks: 2, color: '#ff0000' },
  { id: 6, name: 'Telegram', icon: '✈️', points: 20, tasks: 2, color: '#0088cc' },
  { id: 7, name: 'Refer & Earn', icon: '🎁', points: 17100, tasks: 4, color: '#f59e0b' },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickerIndex, setTickerIndex] = useState(0);
  const [showTicker, setShowTicker] = useState(true);
  const [copied, setCopied] = useState(false);

  // Rotate live tickers
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % LIVE_TICKERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyLink = () => {
    const referralLink = `https://w3business.com/ref/${user?.username || 'user'}`;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="page-wrapper">
      <TopBar />

      {/* Announcement Banner */}
      <div className="announcement-banner">
        <span className="megaphone">📢</span>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <span className="announce-text">
            🔔 Update: Free Spin Every Hour &nbsp;&nbsp;&nbsp; 🎁 New Task: YouTube Watch (+5010 pts) &nbsp;&nbsp;&nbsp; 💰 Withdraw anytime, minimum ₹10
          </span>
        </div>
      </div>

      {/* Username chip */}
      <div className="username-chip">
        {(user?.username || 'USER').toUpperCase()}
      </div>

      {/* Live Ticker */}
      {showTicker && (
        <div className="live-ticker">
          <div className="live-dot" />
          <span className="live-label">LIVE</span>
          <span className="live-text" key={tickerIndex}>
            {LIVE_TICKERS[tickerIndex]}
          </span>
          <button className="live-close" onClick={() => setShowTicker(false)} aria-label="Close ticker">✕</button>
        </div>
      )}

      {/* Invite & Earn Card */}
      <div className="invite-card">
        <div className="invite-card-content">
          <div className="invite-card-title">Invite Friends & Earn Daily</div>
          <div className="invite-card-subtitle">Earn upto ₹500 per active referral</div>
          <div className="invite-card-actions">
            <button id="invite-now-btn" className="btn-invite" onClick={() => navigate('/tasks')}>
              🔗 Invite Now
            </button>
            <button
              id="copy-link-btn"
              className="btn-invite"
              onClick={handleCopyLink}
            >
              {copied ? '✅ Copied!' : '📋 Copy Link'}
            </button>
          </div>
        </div>
        <div className="invite-card-image">🎁</div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Wallet</span>
          <span className="stat-value green">₹0.00</span>
          <span className="stat-sub">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            Balance
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Points</span>
          <span className="stat-value gold">50 🪙</span>
          <span className="stat-sub" style={{ cursor: 'pointer', color: 'var(--brand-blue-light)' }}
            onClick={() => navigate('/tasks')}>
            Watch &amp; get 5 pts
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Referrals</span>
          <span className="stat-value">0</span>
          <span className="stat-sub" style={{ cursor: 'pointer', color: 'var(--brand-blue-light)' }}
            onClick={handleCopyLink}>
            🔗 Share
          </span>
        </div>
      </div>

      {/* Community banner */}
      <div className="community-banner">
        <div className="community-left">
          <span className="community-icon">🔥</span>
          <div>
            <div className="community-text">258 users joined today!</div>
            <div className="community-sub">Be part of our growing community</div>
          </div>
        </div>
        <div className="community-right">
          🕛 Resets at 12 AM
        </div>
      </div>

      {/* Advert Strip */}
      <div className="advert-strip">
        <span className="advert-logo">📈</span>
        <span className="advert-text"><strong>OlympTrade</strong> — Trade & Earn Real Money</span>
        <button className="advert-cta">INSTALL</button>
      </div>

      {/* Spin Wheel Card */}
      <div className="section-header" style={{ marginTop: '16px' }}>
        <span className="section-title">Free Rewards</span>
      </div>
      <div className="spin-card" onClick={() => toast('Spin feature coming soon! 🎡', { icon: '🎰' })}>
        <div className="spin-card-left">
          <div className="spin-card-title">Claim Free Spin Every Hour</div>
          <div className="spin-card-sub">Spin with Points to get extra reward upto 75 Points</div>
          <button className="spin-cta" id="spin-now-btn">
            👁️ Watch &amp; get 5 pts →
          </button>
        </div>
        <div className="spin-wheel-icon" />
      </div>

      {/* Task Categories Preview */}
      <div className="section-header">
        <span className="section-title">Explore Tasks</span>
        <button className="section-action" onClick={() => navigate('/tasks')}>View All →</button>
      </div>

      <div className="tasks-grid">
        {TASK_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="task-cat-card"
            id={`home-cat-${cat.name.toLowerCase().replace(/ /g, '-')}`}
            onClick={() => navigate('/tasks')}
          >
            <span className="task-cat-badge">+{cat.points > 999 ? `${(cat.points / 1000).toFixed(0)}k` : cat.points}</span>
            <div className="task-cat-icon" style={{ background: `${cat.color}20`, border: `1px solid ${cat.color}40` }}>
              {cat.icon}
            </div>
            <span className="task-cat-name">{cat.name}</span>
            <span className="task-cat-count">+{cat.tasks} tasks</span>
          </div>
        ))}
      </div>

      {/* Watch & Earn Banner */}
      <div className="watch-earn-banner" onClick={() => navigate('/tasks')}>
        <span className="watch-earn-new">NEW</span>
        <div className="watch-earn-top">
          <span>⭐</span>
          <span className="watch-earn-title">Watch &amp; Earn</span>
        </div>
        <div className="watch-earn-sub">Get 15 🪙 every 10 minutes — keep earning!</div>
        <div className="watch-earn-cta">
          📹 Watch &amp; get 15 pts →
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
