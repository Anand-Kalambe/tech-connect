import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TopBar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:5000';

export default function Profile() {
  const { username: paramUsername } = useParams();
  const { user: me, logout }        = useAuth();
  const navigate                    = useNavigate();

  // If no param, show own profile
  const targetUsername = paramUsername || me?.username;
  const isOwnProfile   = targetUsername === me?.username;

  const [profile, setProfile]       = useState(null);
  const [posts,   setPosts]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [following, setFollowing]   = useState(false);
  const [fLoading, setFLoading]     = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab]   = useState('posts');

  useEffect(() => {
    if (!targetUsername) return;
    setLoading(true);
    api.get(`/users/${targetUsername}`)
      .then((res) => {
        setProfile(res.data.user);
        setPosts(res.data.posts);
        // Check if current user already follows this profile
        if (!isOwnProfile && me) {
          const already = res.data.user.followers?.some(
            (id) => id === me.id || id?.toString() === me.id
          );
          setFollowing(already);
        }
      })
      .catch(() => toast.error('User not found'))
      .finally(() => setLoading(false));
  }, [targetUsername, isOwnProfile, me]);

  const handleFollow = async () => {
    if (!profile) return;
    setFLoading(true);
    try {
      const res = await api.post(`/users/${profile._id}/follow`);
      setFollowing(res.data.following);
      setProfile((p) => ({
        ...p,
        followersCount: res.data.followersCount,
      }));
      toast.success(res.data.following
        ? `Following @${profile.username}! 👥`
        : `Unfollowed @${profile.username}`
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setFLoading(false);
    }
  };

  const handleLike         = (id, likes)    => setPosts((prev) => prev.map((p) => p._id === id ? { ...p, likes }    : p));
  const handleCommentAdded = (id, comments) => setPosts((prev) => prev.map((p) => p._id === id ? { ...p, comments } : p));

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  /* ── Join date helper ─────────────────────────────── */
  const joinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="page-shell">
      <TopBar />

      <main className="page-content" style={{ paddingBottom: '100px' }}>
        {loading ? (
          /* ── Skeleton ── */
          <div style={{ padding: '24px 16px' }}>
            <div className="profile-skeleton-header">
              <div className="skeleton-avatar" style={{ width: 80, height: 80, borderRadius: '50%' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="skeleton-line short" style={{ height: 14 }} />
                <div className="skeleton-line shorter" style={{ height: 11 }} />
                <div className="skeleton-line" style={{ height: 11, width: '80%' }} />
              </div>
            </div>
          </div>
        ) : !profile ? (
          <div className="empty-feed">
            <div className="empty-icon">🔍</div>
            <h3>User not found</h3>
            <p>This account doesn't exist.</p>
          </div>
        ) : (
          <>
            {/* ── Profile Header ── */}
            <div className="profile-header">
              {/* Avatar */}
              <div className="profile-avatar-wrap">
                <Avatar username={profile.username} size={86} />
                {isOwnProfile && (
                  <div className="profile-online-dot" title="Online" />
                )}
              </div>

              {/* Info column */}
              <div className="profile-info">
                <div className="profile-name-row">
                  <h2 className="profile-username">@{profile.username}</h2>
                  {isOwnProfile ? (
                    <button className="btn-outline profile-edit-btn" onClick={handleLogout}>
                      Log Out
                    </button>
                  ) : (
                    <button
                      id={`follow-btn-${profile._id}`}
                      className={following ? 'btn-outline profile-edit-btn' : 'btn-primary profile-edit-btn'}
                      onClick={handleFollow}
                      disabled={fLoading}
                    >
                      {fLoading ? <span className="spinner-sm" /> : following ? 'Following ✓' : '+ Follow'}
                    </button>
                  )}
                </div>

                {profile.bio && (
                  <p className="profile-bio">{profile.bio}</p>
                )}

                <p className="profile-join-date">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8"  y1="2" x2="8"  y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Joined {joinDate}
                </p>
              </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-num">{posts.length}</span>
                <span className="profile-stat-label">Posts</span>
              </div>
              <div className="profile-stat-divider" />
              <div className="profile-stat">
                <span className="profile-stat-num">{profile.followersCount ?? 0}</span>
                <span className="profile-stat-label">Followers</span>
              </div>
              <div className="profile-stat-divider" />
              <div className="profile-stat">
                <span className="profile-stat-num">{profile.followingCount ?? 0}</span>
                <span className="profile-stat-label">Following</span>
              </div>
            </div>

            {/* ── Tabs ── */}
            <div className="profile-tabs">
              <button
                className={`profile-tab${activeTab === 'posts' ? ' active' : ''}`}
                onClick={() => setActiveTab('posts')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                Posts
              </button>
              <button
                className={`profile-tab${activeTab === 'liked' ? ' active' : ''}`}
                onClick={() => setActiveTab('liked')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Liked
              </button>
            </div>

            {/* ── Post Content ── */}
            {activeTab === 'posts' && (
              posts.length === 0 ? (
                <div className="empty-feed" style={{ padding: '40px 20px' }}>
                  <div className="empty-icon" style={{ fontSize: '40px' }}>📷</div>
                  <h3>No posts yet</h3>
                  {isOwnProfile && (
                    <button className="btn-primary" onClick={() => setShowCreate(true)}>
                      + Create First Post
                    </button>
                  )}
                </div>
              ) : (
                <div className="posts-list" style={{ padding: '0 16px' }}>
                  {posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onLike={handleLike}
                      onCommentAdded={handleCommentAdded}
                    />
                  ))}
                </div>
              )
            )}

            {activeTab === 'liked' && (
              <div className="empty-feed" style={{ padding: '40px 20px' }}>
                <div className="empty-icon" style={{ fontSize: '40px' }}>❤️</div>
                <h3>Liked posts</h3>
                <p style={{ color: 'var(--text-muted)' }}>Posts you liked appear here</p>
              </div>
            )}
          </>
        )}
      </main>

      {showCreate && (
        <CreatePost
          onPostCreated={(p) => setPosts((prev) => [p, ...prev])}
          onClose={() => setShowCreate(false)}
        />
      )}

      <BottomNav onCreatePost={() => setShowCreate(true)} />
    </div>
  );
}
