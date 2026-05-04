import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { usePosts } from '../hooks/usePosts'
import { PostForm, PostList } from './posts/PostComponents'
import usePersistentState from '../hooks/usePersistentState'
import useLastPath from '../hooks/useLastPath'
import '../styles/Posts.css'

function Posts() {
  const navigate = useNavigate()
  const { userId } = useParams()
  const { user } = useUser()
  const { posts, search, setSearch, postForm, setPostForm, getUserInitials, savePost, deletePost, editPost, loadMore, hasMore, loading } = usePosts(userId)
  const [selectedPost, setSelectedPost] = usePersistentState(userId ? `ui:posts:${userId}:selectedPost` : null, null)
  
  useLastPath()
  const selectPost = (post) => {
    setSelectedPost(selectedPost?.id === post.id ? null : post)
  }

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h2>Latest Posts</h2>
        <div className="user-info">
          <span>Welcome, {user?.name} (ID: {user?.id})</span>
        </div>
      </div>

      <div className="posts-layout">
        <div className="control-panel">
          <div className="search-container">
            <select value={search.type} onChange={(e) => setSearch(prev => ({ ...prev, type: e.target.value }))}>
              <option value="title">Search by Title</option>
              <option value="id">Search by ID</option>
            </select>
            <input
              type="text"
              placeholder={`Search by ${search.type}...`}
              value={search.term}
              onChange={(e) => setSearch(prev => ({ ...prev, term: e.target.value }))}
            />
            <button onClick={() => setPostForm(prev => ({ ...prev, show: true }))} className="add-btn">
              + Add Post
            </button>
          </div>

          <PostForm
            postForm={postForm}
            setPostForm={setPostForm}
            onSave={() => savePost(user?.id)}
            onCancel={() => setPostForm({ title: '', body: '', show: false, editing: null })}
          />
        </div>

        <div className="posts-display">
          <PostList
            posts={posts}
            user={user}
            getUserInitials={getUserInitials}
            onEdit={editPost}
            onDelete={deletePost}
            selectedPost={selectedPost}
            onSelect={selectPost}
          />
          {hasMore && !search.term && (
            <div className="load-more-section">
              <button onClick={loadMore} disabled={loading} className="load-more-btn">
                {loading ? 'Loading...' : 'Load More Posts'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Posts