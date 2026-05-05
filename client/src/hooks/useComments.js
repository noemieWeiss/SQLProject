import { useState } from 'react'
import { commentsApi } from '../services/api'

export const useComments = () => {
  const [comments, setComments] = useState([])
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState(null)

  const fetchComments = async (postId) => {
    if (showComments) {
      setShowComments(false)
    } else {
      try {
        const data = await commentsApi.getByPostId(postId)
        setComments(data)
        setShowComments(true)
      } catch (error) {
        console.error('Error fetching comments:', error)
      }
    }
  }

  const addComment = async (postId, user) => {
    if (!newComment.trim()) return
    
    try {
      const comment = await commentsApi.create({
        postId,
        userId: user.id,
        name: user.name,
        email: user.email,
        body: newComment
      })
      setComments([...comments, comment])
      setNewComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const deleteComment = async (commentId, userId) => {
    try {
      await commentsApi.delete(commentId, userId)
      setComments(comments.filter(c => c.id !== commentId))
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const updateComment = async (commentId, newBody) => {
    try {
      const comment = comments.find(c => c.id === commentId)
      const updated = await commentsApi.update(commentId, { ...comment, body: newBody })
      setComments(comments.map(c => c.id === commentId ? updated : c))
      setEditingComment(null)
    } catch (error) {
      console.error('Error updating comment:', error)
    }
  }

  return {
    comments,
    showComments,
    newComment,
    setNewComment,
    editingComment,
    setEditingComment,
    fetchComments,
    addComment,
    deleteComment,
    updateComment
  }
}