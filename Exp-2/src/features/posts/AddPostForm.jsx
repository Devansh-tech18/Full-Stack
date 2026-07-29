import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postAdded } from './postsSlice';

const AddPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('Instagram'); // Default platform
  
  const dispatch = useDispatch();

  const onTitleChanged = e => setTitle(e.target.value);
  const onContentChanged = e => setContent(e.target.value);
  const onPlatformChanged = e => setPlatform(e.target.value);

  const onSavePostClicked = () => {
    if (title && content) {
      // Dispatch all three pieces of data
      dispatch(postAdded(title, content, platform));
      setTitle('');
      setContent('');
      setPlatform('Instagram');
    }
  };

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />

        <label htmlFor="postPlatform">Platform:</label>
        <select id="postPlatform" value={platform} onChange={onPlatformChanged}>
          <option value="Instagram">Instagram</option>
          <option value="Twitter">Twitter</option>
          <option value="LinkedIn">LinkedIn</option>
        </select>

        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        
        <button type="button" onClick={onSavePostClicked}>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;