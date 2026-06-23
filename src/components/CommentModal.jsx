import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Avatar from './Avatar';
import toast from 'react-hot-toast';

export default function CommentModal({ post, onClose, onCommentAdded }) {
  const { user, isAuthenticated } = useAuth();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post(`/posts/${post._id}/comment`, { text });
      onCommentAdded(post._id, res.data.comments);
      setText('');
      toast.success('Comment added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Comments</h2>
          <button id="close-comment-modal" className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-post-preview">
          <Avatar username={post.authorUsername} size={32} />
          <div>
            <span className="comment-author">@{post.authorUsername}</span>
            {post.content && <p className="comment-preview-text">{post.content}</p>}
          </div>
        </div>

        <div className="comments-list">
          {post.comments && post.comments.length === 0 && (
            <div className="no-comments">
              <span>💬</span>
              <p>No comments yet. Be the first!</p>
            </div>
          )}
          {post.comments && post.comments.map((c) => (
            <div key={c._id} className="comment-item">
              <Avatar username={c.authorUsername} size={34} />
              <div className="comment-body">
                <div className="comment-meta">
                  <span className="comment-author">@{c.authorUsername}</span>
                  <span className="comment-time">{formatTime(c.createdAt)}</span>
                </div>
                <p className="comment-text">{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        {isAuthenticated ? (
          <form className="comment-form" onSubmit={handleSubmit}>
            <Avatar username={user?.username} size={34} />
            <div className="comment-input-wrap">
              <input
                id="comment-input"
                type="text"
                placeholder="Write a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={submitting}
                maxLength={500}
              />
              <button
                id="submit-comment-btn"
                type="submit"
                className="btn-send"
                disabled={submitting || !text.trim()}
              >
                {submitting ? (
                  <span className="spinner-sm" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        ) : (
          <p className="login-prompt">Login to add a comment</p>
        )}
      </div>
    </div>
  );
}
