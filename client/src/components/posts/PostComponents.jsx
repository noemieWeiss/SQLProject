import { useState } from 'react'
import { useComments } from '../../hooks/useComments'
import Comments from './Comments'

export const PostForm = ({ postForm, setPostForm, onSave, onCancel }) => {
  if (!postForm.show) return null

  return (
    <div className="add-form">
      <h3>{postForm.editing ? 'Edit Post' : 'Add New Post'}</h3>
      <input
        type="text"
        placeholder="Post Title"
        value={postForm.title}
        onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
      />
      <textarea
        placeholder="Post Content"
        value={postForm.body}
        onChange={(e) => setPostForm(prev => ({ ...prev, body: e.target.value }))}
        rows="4"
      />
      <div className="form-buttons">
        <button onClick={onSave} className="save-btn">
          {postForm.editing ? 'Update' : 'Add'}
        </button>
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  )
}

const BlockModal = ({ userName, onConfirm, onCancel }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!password.trim()) {
      setError('Please enter your password')
      return
    }
    setLoading(true)
    setError('')
    const result = await onConfirm(password)
    setLoading(false)
    if (!result.success) {
      setError(result.message === 'Wrong password' ? 'Wrong password' : result.message)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3>Block User</h3>
        <p>Block <strong>{userName}</strong>?<br/>Their posts will no longer appear in your feed.</p>
        <p className="modal-subtitle">Enter your password to confirm:</p>
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleConfirm()}
          className="modal-input"
          autoFocus
        />
        {error && <p className="modal-error">{error}</p>}
        <div className="modal-buttons">
          <button onClick={onCancel} disabled={loading} className="cancel-btn">Cancel</button>
          <button onClick={handleConfirm} disabled={loading} className="block-confirm-btn">
            {loading ? '...' : 'Block'}
          </button>
        </div>
      </div>
    </div>
  )
}

export const PostCard = ({
  post,
  user,
  getUserInitials,
  getUserName,
  onEdit,
  onDelete,
  onSoftDelete,
  onBlock,
  selectedPost,
  onSelect
}) => {
  const commentsHook = useComments()
  const isSelected = selectedPost?.id === post.id
  const isOwner = Number(post.userId) === Number(user?.id)
  const [showComments, setShowComments] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)

  const handleBlock = async (password) => {
    const result = await onBlock(post.userId, password)
    if (result.success) {
      setShowBlockModal(false)
    }
    return result
  }

  return (
    <>
      {showBlockModal && (
        <BlockModal
          userName={getUserName(post.userId)}
          onConfirm={handleBlock}
          onCancel={() => setShowBlockModal(false)}
        />
      )}
      <div className={`post-card ${isSelected ? 'selected' : ''}`}>
        <div className="post-header">
          <div className="user-avatar">
            {getUserInitials(post.userId)}
          </div>
          <span className="post-id">#{post.id}</span>
          <div className="post-actions">
            {isOwner ? (
              <>
                <button onClick={() => onEdit(post)} className="edit-btn" title="Edit post">✏️</button>
                <button
                  onClick={() => onDelete(post.id)}
                  className="delete-btn hard-delete-btn"
                  title="Delete permanently — no one will see it"
                >
                  🗑️ Delete Forever
                </button>
                <button
                  onClick={() => onSoftDelete(post.id)}
                  className="delete-btn soft-delete-btn"
                  title="Hide from yourself — others can still see it"
                >
                  🙈 Hide from Me
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowBlockModal(true)}
                className="block-btn"
                title="Block this user"
              >
                🚫 Block
              </button>
            )}
          </div>
        </div>
        <h3 className="post-title" onClick={() => onSelect(post)}>{post.title}</h3>
        {isSelected && (
          <div className="post-details">
            <p className="post-body">{post.body}</p>
            <button className="comments-toggle" onClick={() => {
              if (!showComments) {
                commentsHook.fetchComments(post.id)
              }
              setShowComments(!showComments)
            }}>
              {showComments ? 'Hide Comments' : 'Show Comments'}
            </button>
            {showComments && (
              <Comments
                postId={post.id}
                user={user}
                showComments={showComments}
                {...commentsHook}
              />
            )}
          </div>
        )}
      </div>
    </>
  )
}

export const PostList = ({
  posts,
  user,
  getUserInitials,
  getUserName,
  onEdit,
  onDelete,
  onSoftDelete,
  onBlock,
  selectedPost,
  onSelect
}) => {
  return (
    <div className="posts-grid">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          user={user}
          getUserInitials={getUserInitials}
          getUserName={getUserName}
          onEdit={onEdit}
          onDelete={onDelete}
          onSoftDelete={onSoftDelete}
          onBlock={onBlock}
          selectedPost={selectedPost}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
