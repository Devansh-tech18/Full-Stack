import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://localhost:8080/api/posts';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('twitter');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [lastTrace, setLastTrace] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');

  const platforms = [
    { id: 'twitter', name: 'Twitter (X)', icon: '𝕏', maxChars: 280 },
    { id: 'instagram', name: 'Instagram', icon: '📸', maxChars: 2200 },
    { id: 'facebook', name: 'Facebook', icon: 'f', maxChars: 5000 }
  ];

  const currentPlatformObj = platforms.find((p) => p.id === selectedPlatform) || platforms[0];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchPosts = async () => {
    try {
      const start = performance.now();
      const res = await fetch(API_BASE);
      const latency = Math.round(performance.now() - start);
      const json = await res.json();

      const traceId = res.headers.get('x-correlation-id') || 'Server Active';
      setLastTrace({ traceId, latency, status: res.status });

      const rawData = Array.isArray(json) ? json : (json.data || []);
      const enriched = rawData.map((item, idx) => ({
        ...item,
        content: item.content || item.text || '',
        platform: item.platform || platforms[idx % platforms.length].id
      }));
      setPosts(enriched);
    } catch (err) {
      showToast('Could not connect to Spring Boot backend.', 'error');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = async (payloadContent) => {
    const rawText = payloadContent !== undefined ? payloadContent : content;
    const cleanText = typeof rawText === 'string' ? rawText.trim() : '';

    if (!cleanText) {
      showToast('Validation Error: Content must not be empty', 'error');
      return;
    }

    if (cleanText.length > 280) {
      showToast('Backend limit: max 280 characters allowed', 'error');
      return;
    }

    setLoading(true);

    try {
      const start = performance.now();
      // Sends BOTH 'content' and 'text' to satisfy whichever field your backend expects
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          content: cleanText,
          text: cleanText
        })
      });
      const latency = Math.round(performance.now() - start);
      
      let json = {};
      try {
        json = await res.json();
      } catch (e) {
        json = { message: await res.text() };
      }

      const traceId = res.headers.get('x-correlation-id') || 'Server Processed';
      setLastTrace({ traceId, latency, status: res.status });

      if (res.ok) {
        showToast(`Post published to ${currentPlatformObj.name}!`);
        setContent('');
        fetchPosts();
      } else {
        showToast(json.message || 'Validation failed on backend', 'error');
      }
    } catch (err) {
      showToast('Request failed. Is backend running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Post removed.');
        setPosts(posts.filter((p) => p.id !== id));
      }
    } catch (err) {
      showToast('Failed to delete post.', 'error');
    }
  };

  const handleUpdate = async (id) => {
    const cleanEdit = editContent.trim();
    if (!cleanEdit) {
      showToast('Content cannot be empty', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          content: cleanEdit,
          text: cleanEdit
        })
      });
      if (res.ok) {
        showToast('Post updated successfully!');
        setEditingId(null);
        fetchPosts();
      } else {
        showToast('Update failed.', 'error');
      }
    } catch (err) {
      showToast('Update failed.', 'error');
    }
  };

  const filteredPosts = filterPlatform === 'all' 
    ? posts 
    : posts.filter((p) => p.platform === filterPlatform);

  return (
    <div className="dashboard-container">
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

      <header className="header-card">
        <div>
          <span style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600 }}>Experiment 5</span>
          <h1>Social Post Scheduler & Dispatcher</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Spring Boot REST API • Global Exception Handling • Bean Validation • MDC Tracing
          </p>
        </div>
        {lastTrace && (
          <div className="inspector-box">
            <div>⚡ Latency: <b>{lastTrace.latency}ms</b></div>
            <div>📡 Status: <b>{lastTrace.status}</b></div>
            <div style={{ maxWidth: '220px', wordBreak: 'break-all' }}>
              🔍 Trace: <b>{lastTrace.traceId}</b>
            </div>
          </div>
        )}
      </header>

      <section className="glass-card">
        <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Compose & Schedule Post</h3>

        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
          Select Target Channel:
        </label>
        <div className="platform-selector">
          {platforms.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`platform-btn ${selectedPlatform === p.id ? `active-${p.id}` : ''}`}
              onClick={() => setSelectedPlatform(p.id)}
            >
              <span>{p.icon}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        <div className="textarea-wrapper">
          <textarea
            placeholder={`What's happening on ${currentPlatformObj.name}? (Max limit: 280 characters)`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="counter-bar">
            <span className={content.trim().length > 280 ? 'counter-over' : ''}>
              {content.trim().length} / 280 characters
            </span>
            {content.trim().length > 280 && (
              <span className="counter-over">
                ⚠️ Exceeds constraint by {content.trim().length - 280} chars!
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            className="btn btn-primary"
            onClick={() => handleCreate()}
            disabled={loading || content.trim().length > 280}
          >
            {loading ? 'Posting...' : `Post to ${currentPlatformObj.name}`}
          </button>

          <div className="test-scenarios">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Test Exceptions:</span>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.7rem' }}
              onClick={() => handleCreate('')}
            >
              Test Blank (400)
            </button>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.7rem' }}
              onClick={() => handleCreate('A'.repeat(285))}
            >
              Test &gt;280 Chars (400)
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="posts-header">
          <h3 style={{ margin: 0 }}>Published Posts ({filteredPosts.length})</h3>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              <option value="all">All Channels</option>
              <option value="twitter">Twitter (X)</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
            </select>

            <button className="btn btn-secondary" onClick={fetchPosts}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            No posts found for this filter.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div className="post-card" key={post.id}>
              <div className="post-meta">
                <span className={`platform-tag tag-${post.platform}`}>
                  {post.platform}
                </span>
                <span>Post #{post.id}</span>
              </div>

              {editingId === post.id ? (
                <div style={{ marginBottom: '1rem' }}>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={{ minHeight: '60px' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button className="btn btn-primary" onClick={() => handleUpdate(post.id)}>
                      Save
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="post-content">{post.content}</p>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                {editingId !== post.id && (
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => {
                      setEditingId(post.id);
                      setEditContent(post.content);
                    }}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="btn btn-danger"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}