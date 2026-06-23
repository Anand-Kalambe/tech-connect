import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import TopBar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FEED_TABS = ['All Posts', 'Most Liked', 'Most Commented'];

export default function Feed() {
  const [allPosts, setAllPosts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(true);
  const [showCreate, setShowCreate]   = useState(false);
  const [activeTab, setActiveTab]     = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [myFollowingIds, setMyFollowingIds] = useState([]);
  const { user, isAuthenticated }     = useAuth();

  const fetchPosts = useCallback(async (pageNum = 1, replace = false) => {
    try {
      const [res, meRes] = await Promise.all([
        api.get(`/posts?page=${pageNum}&limit=15`),
        isAuthenticated && user?.username && pageNum === 1 
          ? api.get(`/users/${user.username}`).catch(() => null) 
          : Promise.resolve(null)
      ]);
      
      setAllPosts((prev) => replace ? res.data.posts : [...prev, ...res.data.posts]);
      setHasMore(pageNum < res.data.pages);

      if (meRes?.data?.user?.following) {
        setMyFollowingIds(meRes.data.user.following);
      }
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [isAuthenticated, user?.username]);

  useEffect(() => { fetchPosts(1, true); }, [fetchPosts]);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const next = page + 1;
    setPage(next);
    fetchPosts(next, false);
  };

  const handlePostCreated  = (p)  => setAllPosts((prev) => [p, ...prev]);
  const handleLike         = (id, likes)    => setAllPosts((prev) => prev.map((p) => p._id === id ? { ...p, likes }    : p));
  const handleCommentAdded = (id, comments) => setAllPosts((prev) => prev.map((p) => p._id === id ? { ...p, comments } : p));

  const posts = (() => {
    let filtered = allPosts;
    if (searchQuery.trim()) {
      const lowerQ = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.content?.toLowerCase().includes(lowerQ) || 
        p.authorUsername?.toLowerCase().includes(lowerQ)
      );
    }
    if (activeTab === 1) return [...filtered].sort((a, b) => (b.likes?.length || 0)    - (a.likes?.length || 0));
    if (activeTab === 2) return [...filtered].sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
    return filtered;
  })();

  return (
    <div className="page-shell">
      <TopBar />

      <main className="page-content">
        {/* Search */}
        <div style={{ padding: '12px 16px 0' }}>
          <div className="social-search-input" style={{ borderRadius: 'var(--radius-lg)', padding: '10px 14px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="feed-search-input"
              type="text"
              placeholder="Search posts or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Feed Filter Tabs */}
        <div className="feed-tabs">
          {FEED_TABS.map((tab, i) => (
            <button
              key={i}
              id={`feed-tab-${i}`}
              className={`feed-tab${activeTab === i ? ' active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Skeleton Loaders */}
        {loading && (
          <div className="posts-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="post-card skeleton-card">
                <div className="skeleton-header">
                  <div className="skeleton-avatar" />
                  <div className="skeleton-lines">
                    <div className="skeleton-line short" />
                    <div className="skeleton-line shorter" />
                  </div>
                </div>
                <div className="skeleton-line medium" />
                <div className="skeleton-line" />
                <div className="skeleton-line" style={{ width: '60%', marginTop: '8px' }} />
              </div>
            ))}
          </div>
        )}

        {/* Posts */}
        {!loading && (
          <>
            {posts.length === 0 ? (
              <div className="empty-feed">
                <div className="empty-icon">📸</div>
                <h3>No posts yet</h3>
                <p>Be the first to share something!</p>
                {isAuthenticated && (
                  <button id="first-post-btn" className="btn-primary" onClick={() => setShowCreate(true)}>
                    ✍️ Create First Post
                  </button>
                )}
              </div>
            ) : (
              <div className="posts-list">
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    initialFollowing={myFollowingIds.includes(post.author || post.authorId)}
                    onLike={handleLike}
                    onCommentAdded={handleCommentAdded}
                  />
                ))}
                {activeTab === 0 && hasMore && (
                  <button id="load-more-btn" className="btn-load-more" onClick={handleLoadMore} disabled={loadingMore}>
                    {loadingMore ? <><span className="spinner-sm" />Loading...</> : '↓ Load More'}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Create Post Modal — only via + button */}
      {showCreate && (
        <CreatePost
          onPostCreated={handlePostCreated}
          onClose={() => setShowCreate(false)}
        />
      )}

      <BottomNav onCreatePost={() => setShowCreate(true)} />
    </div>
  );
}
