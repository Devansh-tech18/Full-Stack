import React from 'react';
import PostsList from './features/posts/PostsList';
import AddPostForm from './features/posts/AddPostForm';

function App() {
  return (
    <div className="app-container">
      <header className="app-navbar">
        <div className="navbar-content">
          <div className="brand-lockup">
            <div className="logo-mark"></div>
            <h1>Content Manager</h1>
          </div>
          <div className="user-profile">
            <span className="user-name">Devansh Singh</span>
            <span className="avatar">DS</span>
          </div>
        </div>
      </header>

      <main className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <AddPostForm />
        </aside>
        
        <section className="dashboard-feed">
          <PostsList />
        </section>
      </main>
    </div>
  );
}

export default App;