import React, { useState } from 'react';

const PLATFORM_CONSTRAINTS = {
  Twitter: { maxLength: 280, maxMedia: 4 },
  LinkedIn: { maxLength: 3000, maxMedia: 9 },
  Instagram: { maxLength: 63206, maxMedia: 10 }
};

const PostComposer = () => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['Twitter']);
  const [mediaFiles, setMediaFiles] = useState(0);
  
  // NEW: State to control the success popup
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTextChange = (e) => setContent(e.target.value);

  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const addMedia = () => setMediaFiles(prev => prev + 1);
  const removeMedia = () => setMediaFiles(prev => Math.max(0, prev - 1));

  // NEW: Function to handle publishing and resetting the form
  const handlePublish = () => {
    // 1. Show the success notification
    setShowSuccess(true);
    
    // 2. Erase the current draft and reset attachments
    setContent('');
    setMediaFiles(0);
    setSelectedPlatforms(['Twitter']); // Resets to default platform

    // 3. Hide the success notification automatically after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const getStrictestLimit = () => {
    if (selectedPlatforms.length === 0) return null;
    return Math.min(...selectedPlatforms.map(p => PLATFORM_CONSTRAINTS[p].maxLength));
  };

  const getMediaLimit = () => {
    if (selectedPlatforms.length === 0) return null;
    return Math.min(...selectedPlatforms.map(p => PLATFORM_CONSTRAINTS[p].maxMedia));
  };

  const strictestLimit = getStrictestLimit();
  const mediaLimit = getMediaLimit();
  
  const isTextOverLimit = strictestLimit && content.length > strictestLimit;
  const isMediaOverLimit = mediaLimit && mediaFiles > mediaLimit;
  const hasErrors = isTextOverLimit || isMediaOverLimit;

  return (
    <div className="composer-card">
      
      {/* NEW: Success Message UI */}
      {showSuccess && (
        <div style={{
          backgroundColor: '#dcfce3',
          color: '#166534',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontWeight: '600',
          textAlign: 'center',
          border: '1px solid #bbf7d0'
        }}>
          ✅ Post published successfully!
        </div>
      )}

      <div className="platform-section">
        <strong>Select Platforms:</strong>
        <div className="platform-labels">
          {Object.keys(PLATFORM_CONSTRAINTS).map((platform) => (
            <label 
              key={platform} 
              className={`platform-label ${selectedPlatforms.includes(platform) ? 'active' : ''}`}
            >
              <input
                type="checkbox"
                checked={selectedPlatforms.includes(platform)}
                onChange={() => togglePlatform(platform)}
                style={{ display: 'none' }}
              />
              {platform}
            </label>
          ))}
        </div>
      </div>

      <div className="textarea-container">
        <textarea
          value={content}
          onChange={handleTextChange}
          placeholder="Draft your post here..."
          className={isTextOverLimit ? 'error' : ''}
        />
        
        {strictestLimit && (
          <div className="feedback-bar">
            <span className={`feedback-text ${isTextOverLimit ? 'error' : ''}`}>
              {isTextOverLimit ? '⚠️ Character limit exceeded for selected platforms' : '✅ Character count valid'}
            </span>
            <span className={`feedback-text ${isTextOverLimit ? 'error' : ''}`}>
              {content.length} / {strictestLimit}
            </span>
          </div>
        )}
      </div>

      <div className="media-section">
        <p className="media-status">
          Media Attached: <strong>{mediaFiles}</strong> (Max allowed: {mediaLimit || 0})
        </p>
        <div className="media-buttons">
          <button className="btn-secondary" onClick={addMedia}>+ Add Image</button>
          <button className="btn-secondary" onClick={removeMedia}>- Remove Image</button>
        </div>
        {isMediaOverLimit && (
          <p className="error-text">
            ⚠️ Too many media files for the selected platforms.
          </p>
        )}
      </div>

      {/* UPDATED: Added onClick event to trigger handlePublish */}
      <button 
        className="publish-btn"
        onClick={handlePublish}
        disabled={hasErrors || content.length === 0 || selectedPlatforms.length === 0}
      >
        {selectedPlatforms.length === 0 ? 'Select a platform' : 'Publish Post'}
      </button>
    </div>
  );
};

export default PostComposer;
