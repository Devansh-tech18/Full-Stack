import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setContent, togglePlatform, clearComposer } from './store/slices/composerSlice';
import { saveDraft } from './store/slices/draftsSlice';

const platforms = ['Twitter', 'LinkedIn', 'Facebook'];

const PostComposer = () => {
  const dispatch = useDispatch();
  const { content, selectedPlatforms } = useSelector((state) => state.composer);

  const handleSaveDraft = () => {
    if (content.trim()) {
      dispatch(saveDraft({ content, platforms: selectedPlatforms }));
      dispatch(clearComposer());
    }
  };

  return (
    <div className="composer-container">
      <h2>Multi-Platform Post Composer</h2>
      
      <div className="platforms-section">
        {platforms.map(platform => (
          <label key={platform} className="platform-checkbox">
            <input
              type="checkbox"
              checked={selectedPlatforms.includes(platform)}
              onChange={() => dispatch(togglePlatform(platform))}
            />
            {platform}
          </label>
        ))}
      </div>

      <textarea
        value={content}
        onChange={(e) => dispatch(setContent(e.target.value))}
        placeholder="What's on your mind?"
        rows={6}
        className="composer-textarea"
      />

      <div className="composer-actions">
        <button onClick={() => dispatch(clearComposer())} className="btn-clear">
          Clear
        </button>
        <button onClick={handleSaveDraft} className="btn-save">
          Save Draft
        </button>
      </div>
    </div>
  );
};

export default PostComposer;