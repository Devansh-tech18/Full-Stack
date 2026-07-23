import React from 'react';
import PostComposer from './PostComposer';

function App() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>Dynamic Post Composer</h1>
        <p>Cross-platform validation architecture</p>
      </header>
      
      <main>
        <PostComposer />
      </main>
    </div>
  );
}

export default App;