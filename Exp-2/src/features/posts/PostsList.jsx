import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectPostsByPlatform } from './postsSlice';
import PostExcerpt from './PostExcerpt';

const PostsList = () => {
  // Local state for the dropdown filter
  const [filter, setFilter] = useState('All');
  
  // Using the memoized selector to get derived data
  const posts = useSelector(state => selectPostsByPlatform(state, filter));

  return (
    <section className="posts-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ display: 'block', margin: 0, border: 'none', padding: 0 }}>Feed</h2>
        
        {/* Filter Dropdown */}
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: 'auto', padding: '4px 12px' }}
        >
          <option value="All">All Platforms</option>
          <option value="Instagram">Instagram</option>
          <option value="Twitter">Twitter</option>
          <option value="LinkedIn">LinkedIn</option>
        </select>
      </div>

      {posts.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No posts found.</p>
      ) : (
        posts.map(post => <PostExcerpt key={post.id} post={post} />)
      )}
    </section>
  );
};

export default PostsList;