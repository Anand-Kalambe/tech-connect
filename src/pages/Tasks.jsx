import { useState } from 'react';
import TopBar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 1, name: 'Instagram', icon: '📸', points: 330, tasks: 27, color: '#e1306c', bg: 'rgba(225,48,108,0.12)', border: 'rgba(225,48,108,0.25)' },
  { id: 2, name: 'Facebook', icon: '👍', points: 60, tasks: 6, color: '#1877f2', bg: 'rgba(24,119,242,0.12)', border: 'rgba(24,119,242,0.25)' },
  { id: 3, name: 'Twitter', icon: '🐦', points: 30, tasks: 3, color: '#1da1f2', bg: 'rgba(29,161,242,0.12)', border: 'rgba(29,161,242,0.25)' },
  { id: 4, name: 'Social', icon: '🌐', points: 10, tasks: 1, color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
  { id: 5, name: 'YouTube', icon: '▶️', points: 5010, tasks: 2, color: '#ff0000', bg: 'rgba(255,0,0,0.1)', border: 'rgba(255,0,0,0.2)' },
  { id: 6, name: 'Telegram', icon: '✈️', points: 20, tasks: 2, color: '#0088cc', bg: 'rgba(0,136,204,0.12)', border: 'rgba(0,136,204,0.25)' },
  { id: 7, name: 'Refer & Earn', icon: '🎁', points: 17100, tasks: 4, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
];

const TABS = ['Explore Tasks', 'Ongoing Tasks (0)', 'Rejected Tasks (0)'];

export default function Tasks() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleTaskClick = (cat) => {
    toast(`${cat.icon} ${cat.name} tasks coming soon!`, { duration: 2000 });
  };

  return (
    <div className="page-wrapper">
      <TopBar />

      {/* Tab Bar */}
      <div style={{ padding: '12px 16px 0' }}>
        <div className="tab-bar">
          {TABS.map((tab, i) => (
            <button
              key={i}
              id={`tasks-tab-${i}`}
              className={`tab-btn${activeTab === i ? ' active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 0 && (
        <>
          {/* Section Header */}
          <div className="section-header" style={{ marginTop: '16px' }}>
            <span className="section-title">Explore Categories</span>
            <button
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', padding: '6px',
              }}
              aria-label="Share"
              onClick={() => toast('Share feature coming soon!')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          </div>

          {/* Category Selector */}
          <div className="category-select-wrap">
            <select
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">Category — All</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Categories Grid */}
          <div style={{ padding: '0 16px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
            }}>
              {CATEGORIES.filter(c => selectedCategory === 'All' || c.name === selectedCategory).map((cat) => (
                <div
                  key={cat.id}
                  className="task-cat-card"
                  id={`task-cat-${cat.name.toLowerCase().replace(/ /g,'-')}`}
                  onClick={() => handleTaskClick(cat)}
                  style={{ borderColor: cat.border }}
                >
                  <span className="task-cat-badge">
                    +{cat.points >= 1000 ? `${(cat.points / 1000).toFixed(cat.points % 1000 === 0 ? 0 : 1)}k` : cat.points}
                  </span>
                  <div
                    className="task-cat-icon"
                    style={{ background: cat.bg, border: `1px solid ${cat.border}` }}
                  >
                    {cat.icon}
                  </div>
                  <span className="task-cat-name">{cat.name}</span>
                  <span className="task-cat-count">+{cat.tasks} tasks</span>
                </div>
              ))}
            </div>
          </div>

          {/* Watch & Earn Banner */}
          <div className="watch-earn-banner" style={{ marginTop: '16px' }}>
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
        </>
      )}

      {activeTab === 1 && (
        <div className="empty-feed">
          <div className="empty-icon">📋</div>
          <h3>No Ongoing Tasks</h3>
          <p>Pick a task from Explore to get started!</p>
          <button className="btn-primary" onClick={() => setActiveTab(0)}>
            Explore Tasks
          </button>
        </div>
      )}

      {activeTab === 2 && (
        <div className="empty-feed">
          <div className="empty-icon">🚫</div>
          <h3>No Rejected Tasks</h3>
          <p>All your submissions are looking good!</p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
