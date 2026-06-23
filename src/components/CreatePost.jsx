import { useState, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import toast from 'react-hot-toast';

export default function CreatePost({ onPostCreated, onClose }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) {
      toast.error('Add some text or an image');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (content.trim()) formData.append('content', content.trim());
      if (imageFile) formData.append('image', imageFile);

      const res = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onPostCreated(res.data);
      toast.success('Post shared! 🚀');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content create-post-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Post</h2>
          <button id="close-create-post" className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="create-post-author">
            <Avatar username={user?.username} size={44} />
            <span className="create-username">@{user?.username}</span>
          </div>

          <textarea
            id="post-content-input"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1000}
            rows={4}
            className="post-textarea"
          />

          {imagePreview && (
            <div className="image-preview-wrap">
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <button type="button" id="remove-image-btn" className="remove-image-btn" onClick={removeImage}>
                ✕
              </button>
            </div>
          )}

          <div className="create-post-footer">
            <label htmlFor="image-upload" className="upload-label" title="Attach image">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
            </label>

            <div className="char-count">
              <span style={{ color: content.length > 900 ? '#f87171' : 'inherit' }}>
                {content.length}
              </span>/1000
            </div>

            <button
              id="submit-post-btn"
              type="submit"
              className="btn-primary"
              disabled={submitting || (!content.trim() && !imageFile)}
            >
              {submitting ? (
                <><span className="spinner-sm" /> Posting...</>
              ) : (
                <>🚀 Share</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
