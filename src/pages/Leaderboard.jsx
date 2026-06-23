import { useState, useEffect } from 'react';
import TopBar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

const HEADER_TABS = [
  { label: 'Main', count: '12.4k Users' },
  { label: 'Quiz', count: '5.2k Users' },
  { label: 'Referral', count: '5.7k Users' },
];
const TIME_TABS = ['Daily', 'Weekly', 'Monthly'];

const TOP3 = [
  { rank: 1, name: 'Krish', avatar: '🧑', score: 3569.5, prize: '₹100.00' },
  { rank: 2, name: 'Aswin', avatar: '👨', score: 2709, prize: '₹16.00' },
  { rank: 3, name: 'Kulwinder', avatar: '🧔', score: 2560, prize: '₹14.00' },
];

const RANKED = [
  { rank: 4, name: 'Lorena', avatar: '👩', score: 2522.53, prize: '₹12.00' },
  { rank: 5, name: 'Elsa', avatar: '👱‍♀️', score: 2507, prize: '₹10.00' },
  { rank: 6, name: 'Ravi Kumar', avatar: '🧑', score: 2430, prize: '₹8.00' },
  { rank: 7, name: 'Priya', avatar: '👩‍🦰', score: 2398, prize: '₹6.00' },
  { rank: 8, name: 'James', avatar: '👨‍🦱', score: 2310, prize: '₹4.00' },
];

function Countdown() {
  const [time, setTime] = useState({ h: 12, m: 54, s: 27 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n) => String(n).padStart(2, '0');
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>⏰ Ends in {pad(time.h)}h {pad(time.m)}m {pad(time.s)}s</span>;
}

export default function Leaderboard() {
  const [headerTab, setHeaderTab] = useState(0);
  const [timeTab, setTimeTab] = useState(0);

  return (
    <div className="lb-page page-wrapper" style={{ paddingBottom: 'calc(var(--bottom-nav-h) + 60px)' }}>
      <TopBar />

      {/* Header Tabs: Main / Quiz / Referral */}
      <div className="lb-header-bar">
        {HEADER_TABS.map((tab, i) => (
          <button
            key={i}
            id={`lb-header-tab-${i}`}
            className={`lb-header-tab${headerTab === i ? ' active' : ''}`}
            onClick={() => setHeaderTab(i)}
          >
            <span>{i === 0 ? '🏆' : i === 1 ? '🧩' : '👥'} {tab.label}</span>
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Time Toggle */}
      <div className="lb-time-row">
        {TIME_TABS.map((t, i) => (
          <button
            key={i}
            id={`lb-time-${t.toLowerCase()}`}
            className={`lb-time-btn${timeTab === i ? ' active' : ''}`}
            onClick={() => setTimeTab(i)}
          >
            {t}
          </button>
        ))}
        <div className="lb-time-info">
          <Countdown />
        </div>
      </div>

      {/* History link */}
      <div style={{ padding: '0 16px 12px', display: 'flex', justifyContent: 'flex-end' }}>
        <button style={{
          background: 'none', border: 'none', color: 'var(--text-muted)',
          fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          🕐 History →
        </button>
      </div>

      {/* Ways to Earn */}
      <div className="earn-ways">
        <div className="earn-ways-title">
          ⚡ Ways to Earn More Points
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '4px' }}>ℹ️</span>
        </div>
        <div className="earn-ways-grid">
          <div className="earn-way-card">
            <span style={{ fontSize: '20px' }}>📋</span>
            <div className="earn-way-title">Tasks</div>
            <div className="earn-way-points">Earn +120</div>
            <button id="do-tasks-btn" className="earn-way-btn">Do Tasks ›</button>
          </div>
          <div className="earn-way-card">
            <span style={{ fontSize: '20px' }}>🧩</span>
            <div className="earn-way-title">Quiz</div>
            <div className="earn-way-points">Earn +50</div>
            <button id="play-quiz-btn" className="earn-way-btn">Play Now ›</button>
          </div>
          <div className="earn-way-card">
            <span style={{ fontSize: '20px' }}>👥</span>
            <div className="earn-way-title">Referral</div>
            <div className="earn-way-points">Earn +500</div>
            <button id="invite-btn" className="earn-way-btn">Invite Now ›</button>
          </div>
        </div>
      </div>

      {/* Top 3 Podium — order: 2nd, 1st, 3rd */}
      <div style={{ padding: '0 16px', marginBottom: '16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr 1fr',
          gap: '8px',
          alignItems: 'flex-end',
        }}>
          {/* Rank 2 */}
          <div className="podium-card rank-2" style={{ paddingTop: '28px' }}>
            <div className="podium-crown">🥈</div>
            <div className="podium-avatar">
              {TOP3[1].avatar}
              <span className="podium-rank-badge">2</span>
            </div>
            <div className="podium-name">{TOP3[1].name}</div>
            <div className="podium-score">{TOP3[1].score.toLocaleString()} 🪙</div>
            <div className="podium-prize">Prize: {TOP3[1].prize} ℹ️</div>
          </div>

          {/* Rank 1 — tallest */}
          <div className="podium-card rank-1" style={{ paddingTop: '10px' }}>
            <div className="podium-crown">👑</div>
            <div className="podium-avatar" style={{ width: '60px', height: '60px', fontSize: '28px' }}>
              {TOP3[0].avatar}
              <span className="podium-rank-badge">1</span>
            </div>
            <div className="podium-name">{TOP3[0].name}</div>
            <div className="podium-score">{TOP3[0].score.toLocaleString()} 🪙</div>
            <div className="podium-prize">Prize: {TOP3[0].prize} ℹ️</div>
          </div>

          {/* Rank 3 */}
          <div className="podium-card rank-3" style={{ paddingTop: '28px' }}>
            <div className="podium-crown">🥉</div>
            <div className="podium-avatar">
              {TOP3[2].avatar}
              <span className="podium-rank-badge">3</span>
            </div>
            <div className="podium-name">{TOP3[2].name}</div>
            <div className="podium-score">{TOP3[2].score.toLocaleString()} 🪙</div>
            <div className="podium-prize">Prize: {TOP3[2].prize} ℹ️</div>
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '36px 40px 1fr 80px 60px',
        gap: '8px',
        padding: '0 24px 8px',
        fontSize: '11px',
        color: 'var(--text-muted)',
        fontWeight: '700',
        letterSpacing: '0.03em',
      }}>
        <span>Rank</span>
        <span></span>
        <span>User</span>
        <span style={{ textAlign: 'right' }}>Score</span>
        <span style={{ textAlign: 'right' }}>Prize</span>
      </div>

      {/* Ranked List */}
      <div className="lb-list">
        {RANKED.map((row) => (
          <div key={row.rank} className="lb-row" id={`lb-row-${row.rank}`}>
            <div className="lb-rank">{row.rank}</div>
            <div className="lb-avatar-sm">{row.avatar}</div>
            <div className="lb-name">{row.name}</div>
            <div className="lb-score">{row.score.toLocaleString()} 🪙</div>
            <div className="lb-prize">{row.prize} ℹ️</div>
          </div>
        ))}
      </div>

      {/* Sticky Footer Bar */}
      <div className="lb-footer">
        <div className="lb-footer-item">
          <span className="lb-footer-label">Your Rank</span>
          <span className="lb-footer-value">--</span>
        </div>
        <div className="lb-footer-item">
          <span className="lb-footer-label">Your Score</span>
          <span className="lb-footer-value">-- 🪙</span>
        </div>
        <button id="lb-refresh-btn" className="lb-refresh-btn">
          <span className="lb-refresh-icon">🔄</span>
          <span className="lb-refresh-label">Refresh</span>
        </button>
        <div className="lb-footer-info">
          <span className="lb-footer-info-text">Rankings update every 5 minutes ℹ️</span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
