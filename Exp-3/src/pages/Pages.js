// src/pages/Pages.js
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

// Default posts with 'likes' added
const defaultPosts = [
  { id: 1, author: 'admin', role: 'Admin', content: 'System initialized. All secure protocols are active.', likes: 5 },
  { id: 2, author: 'editor', role: 'Editor', content: 'Welcome to the interactive feed! As an editor, I can create posts.', likes: 2 }
];

export const Dashboard = () => {
  const { user } = useContext(AuthContext);
  
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('app_database_posts');
    if (savedPosts) {
      return JSON.parse(savedPosts);
    }
    return defaultPosts;
  });
  
  const [newPostContent, setNewPostContent] = useState('');

  const canCreatePost = user.role === 'Admin' || user.role === 'Editor';

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(), // Using timestamp for a unique ID
      author: user.username,
      role: user.role,
      content: newPostContent,
      likes: 0
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('app_database_posts', JSON.stringify(updatedPosts));
    setNewPostContent('');
  };

  // Interactive Feature: Like a post
  const handleLike = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: (post.likes || 0) + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('app_database_posts', JSON.stringify(updatedPosts));
  };

  // Interactive Feature: Delete a post
  const handleDelete = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem('app_database_posts', JSON.stringify(updatedPosts));
  };

  return (
    <div className="page-container">
      <div className="header-box interactive-header">
        <div className="header-content">
          <h1>Welcome, <span className="highlight-text">{user.username}</span></h1>
          <p>Your Role: <strong>{user.role}</strong></p>
        </div>
      </div>

      <div className="feed-container">
        {canCreatePost ? (
          <div className="create-post-box">
            <h3>📝 Create a New Post</h3>
            <form onSubmit={handleCreatePost}>
              <textarea 
                placeholder="What's on your mind?" 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows="3"
                required
              />
              <button type="submit" className="btn-primary pulse-btn">Publish Post</button>
            </form>
          </div>
        ) : (
          <div className="read-only-notice">
            <p>👁️ <strong>Read-Only Mode:</strong> As a {user.role}, you can like posts, but you cannot create them.</p>
          </div>
        )}

        <div className="posts-list">
          <h3>Recent Updates</h3>
          {posts.map((post, index) => (
            <div 
              key={post.id} 
              className="post-card" 
              style={{ animationDelay: `${index * 0.1}s` }} // Staggered animation
            >
              <div className="post-header">
                <div className="avatar">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong>@{post.author}</strong> 
                  <span className="user-badge">{post.role}</span>
                </div>
              </div>
              <p className="post-content">{post.content}</p>
              
              <div className="post-actions">
                <button onClick={() => handleLike(post.id)} className="btn-action like-btn">
                  ❤️ Like ({post.likes || 0})
                </button>
                
                {/* RBAC: Only Admin or the original author can delete */}
                {(user.role === 'Admin' || user.username === post.author) && (
                  <button onClick={() => handleDelete(post.id)} className="btn-action delete-btn">
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ... keep EditorWorkspace, AdminPanel, and Unauthorized exactly the same as before ...
export const EditorWorkspace = () => {
  return (
    <div className="page-container">
      <div className="header-box editor-box">
        <h1>Editor Workspace</h1>
        <p>Access granted: You have Editor or Admin privileges.</p>
      </div>
      <div className="content-area">
        <p>In a full application, this area would contain complex CMS tools to edit or delete other people's posts.</p>
      </div>
    </div>
  );
};

export const AdminPanel = () => {
  return (
    <div className="page-container">
      <div className="header-box admin-box">
        <h1>Admin Control Panel</h1>
        <p>Access granted: Maximum privileges established.</p>
      </div>
      <div className="content-area">
        <p>In a full application, this area would allow you to change user roles, ban users, and view system logs.</p>
      </div>
    </div>
  );
};

export const Unauthorized = () => {
  return (
    <div className="page-container error-page">
      <h1>403 - Access Denied</h1>
      <p>Your current role does not have permission to view this page.</p>
    </div>
  );
};