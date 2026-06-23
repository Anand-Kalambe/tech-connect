import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Avatar from './Avatar';
import CommentModal from './CommentModal';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:5000';

function FollowButton({ authorId, authorUsername, initialFollowing }) {
  const [following, setFollowing] = useState(initialFollowing || false);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    setFollowing(initialFollowing || false);
  }, [initialFollowing]);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.post(`/users/${authorId}/follow`);
      setFollowing(res.data.following);
      toast(res.data.following
        ? `Following @${authorUsername}! 👥`
        : `Unfollowed @${authorUsername}`
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`follow-btn${following ? ' following' : ''}`}
      onClick={toggle}
      disabled={loading}
    >
      {loading ? <span className="spinner-sm" /> : following ? 'Following' : 'Follow'}
    </button>
  );
}

export default function PostCard({ post, onLike, onCommentAdded, initialFollowing }) {
  const { user, isAuthenticated } = useAuth();
  const navigate                  = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [liking, setLiking]             = useState(false);

  const isLiked = post.likes?.some((l) => l.userId === user?.id);

  const formatTime = (dateStr) => {
    const now = new Date(), d = new Date(dateStr);
    const diffMin = Math.floor((now - d) / 60000);
    const diffHr  = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    if (diffMin < 1)  return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr  < 24) return `${diffHr}h ago`;
    if (diffDay < 7)  return `${diffDay}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleLike = async () => {
    if (!isAuthenticated) { toast.error('Please login to like posts'); return; }
    if (liking) return;
    setLiking(true);
    try {
      const res = await api.put(`/posts/${post._id}/like`);
      onLike(post._id, res.data.likes);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to like post');
    } finally {
      setLiking(false);
    }
  };

  const likedByNames = post.likes?.slice(0, 3).map((l) => l.username).join(', ');

  return (
    <>
      <div className="post-card">
        {/* Header */}
        <div className="post-header">
          <div
            style={{ cursor: 'pointer', flexShrink: 0 }}
            onClick={() => navigate(`/profile/${post.authorUsername}`)}
            title={`View @${post.authorUsername}'s profile`}
          >
            <Avatar username={post.authorUsername} size={42} />
          </div>

          <div className="post-author-info" style={{ cursor: 'pointer' }}
               onClick={() => navigate(`/profile/${post.authorUsername}`)}>
            <span className="post-username">{post.authorUsername}</span>
            <span className="post-handle">@{post.authorUsername?.toLowerCase()}</span>
            <span className="post-time">{formatTime(post.createdAt)}</span>
          </div>

          {user?.username !== post.authorUsername && post.authorId && (
            <FollowButton authorId={post.authorId} authorUsername={post.authorUsername} initialFollowing={initialFollowing} />
          )}
          {user?.username !== post.authorUsername && !post.authorId && (
            <FollowButton authorId={post.author} authorUsername={post.authorUsername} initialFollowing={initialFollowing} />
          )}
        </div>

        {/* Content */}
        {post.content && <p className="post-content">{post.content}</p>}

        {/* Image */}
        {post.image && (
          <div className="post-image-wrap">
            <img
              src={`${API_BASE}${post.image}`}
              alt="Post"
              className="post-image"
              loading="lazy"
            />
          </div>
        )}

        {/* Liked by */}
        {post.likes?.length > 0 && (
          <p className="liked-by">
            ❤️ {likedByNames}
            {post.likes.length > 3 && ` and ${post.likes.length - 3} others`}
          </p>
        )}

        {/* Actions */}
        <div className="post-actions">
          <button
            id={`like-btn-${post._id}`}
            className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={liking}
          >
            <span className={`heart-icon ${isLiked ? 'heart-beat' : ''}`}>
              {isLiked ? '❤️' : '🤍'}
            </span>
            <span className="action-count">{post.likes?.length || 0}</span>
            <span className="action-label">Like</span>
          </button>

          <button
            id={`comment-btn-${post._id}`}
            className="action-btn comment-btn"
            onClick={() => setShowComments(true)}
          >
            <span>💬</span>
            <span className="action-count">{post.comments?.length || 0}</span>
            <span className="action-label">Comment</span>
          </button>

          <button
            className="action-btn"
            onClick={() => {
              navigator.clipboard.writeText(window.location.origin + `/feed`);
              toast.success('Link copied!');
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span className="action-label">Share</span>
          </button>
        </div>
      </div>

      {showComments && (
        <CommentModal
          post={post}
          onClose={() => setShowComments(false)}
          onCommentAdded={(postId, comments) => onCommentAdded(postId, comments)}
        />
      )}
    </>
  );
}
