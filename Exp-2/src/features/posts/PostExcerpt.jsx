import React from 'react';
import { useDispatch } from 'react-redux';
import { postDeleted } from './postsSlice';

// React.memo prevents this component from re-rendering unless its 'post' prop changes
const PostExcerpt = React.memo(({ post }) => {
  const dispatch = useDispatch();

  return (
    <article className="post-excerpt">
      <div className="post-header">
        <h3>{post.title}</h3>
        
        <div className="post-meta">
          <span className={`platform-badge ${post.platform?.toLowerCase()}`}>
            {post.platform}
          </span>
          <button 
            className="btn-delete" 
            onClick={() => dispatch(postDeleted(post.id))}
          >
            Delete
          </button>
        </div>
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>
    </article>
  );
});

export default PostExcerpt;