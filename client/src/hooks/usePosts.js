import { useState, useEffect, useCallback } from 'react'
import { postsApi, usersApi } from '../services/api'
import { useCache } from '../contexts/CacheContext'
import usePersistentState from './usePersistentState'

export const usePosts = (userId) => {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [search, setSearch] = usePersistentState(userId ? `ui:posts:${userId}:search` : null, { term: '', field: 'title' })
  const [postForm, setPostForm] = usePersistentState(userId ? `ui:posts:${userId}:form` : null, { title: '', body: '', show: false, editing: null })
  const [currentPage, setCurrentPage] = usePersistentState(userId ? `ui:posts:${userId}:page` : null, 1)
  const [postsPerPage] = useState(10)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [allPosts, setAllPosts] = useState([])

  const { get, set, invalidate } = useCache()

  const loadInitialPosts = useCallback(async () => {
    setLoading(true)
    try {
      const allPostsData = await postsApi.getAll(1, 1000, userId)
      setAllPosts(allPostsData)
      const firstPagePosts = allPostsData.slice(0, postsPerPage)
      setPosts(firstPagePosts)
      setHasMore(allPostsData.length > postsPerPage)
      setCurrentPage(1)
      if (userId) {
        set(`posts:${userId}`, allPostsData)
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }, [userId, postsPerPage, set])

  useEffect(() => {
    const cacheKey = `posts:${userId}`
    const cached = userId ? get(cacheKey) : null
    if (cached) {
      setAllPosts(cached)
      const firstPagePosts = cached.slice(0, postsPerPage)
      setPosts(firstPagePosts)
      setHasMore(cached.length > postsPerPage)
    } else {
      loadInitialPosts()
    }
    usersApi.getAll().then(setUsers).catch(console.error)
  }, [userId, get, postsPerPage, loadInitialPosts])

  // Listen for hard-deletes done in other tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'posts_hard_deleted') {
        invalidate(`posts:${userId}`)
        loadInitialPosts()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [userId, invalidate, loadInitialPosts])

  const loadMore = async () => {
    if (!hasMore || loading) return

    setLoading(true)

    try {
      const nextPage = currentPage + 1
      const startIndex = (nextPage - 1) * postsPerPage
      const endIndex = startIndex + postsPerPage
      const nextPagePosts = allPosts.slice(startIndex, endIndex)

      if (nextPagePosts.length === 0) {
        alert('No more posts to display')
        setHasMore(false)
      } else {
        setPosts(prev => [...prev, ...nextPagePosts])
        setCurrentPage(nextPage)
        setHasMore(endIndex < allPosts.length)
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = (search.term ? allPosts : posts).filter(post => {
    if (!search.term) return true
    if (search.field === 'id') return post.id.toString().includes(search.term)
    return post.title?.toLowerCase().includes(search.term.toLowerCase()) ?? false
  })

  const getUserInitials = (postUserId) => {
    if (!postUserId) return 'U'
    const user = users.find(u => u.id == postUserId)
    return user?.name ? user.name.substring(0, 2).toUpperCase() : 'U' + postUserId.toString().substring(0, 1)
  }

  const getUserName = (postUserId) => {
    if (!postUserId) return 'Unknown'
    const user = users.find(u => u.id == postUserId)
    return user?.name || user?.username || `User #${postUserId}`
  }

  const savePost = async (userId) => {
    if (!postForm.title.trim() || !postForm.body.trim()) return

    try {
      if (postForm.editing) {
        const updated = await postsApi.update(postForm.editing.id, {
          ...postForm.editing,
          title: postForm.title,
          body: postForm.body
        })
        setPosts(posts.map(p => p.id === postForm.editing.id ? updated : p))
      } else {
        const newPost = await postsApi.create({
          userId: Number(userId),
          title: postForm.title,
          body: postForm.body
        })
        const updatedPosts = [newPost, ...posts]
        const updatedAllPosts = [newPost, ...allPosts]
        setPosts(updatedPosts)
        setAllPosts(updatedAllPosts)
        if (userId) {
          set(`posts:${userId}`, updatedAllPosts)
        }
      }
      setPostForm({ title: '', body: '', show: false, editing: null })
    } catch (error) {
      console.error('Error saving post:', error)
    }
  }

  const deletePost = async (postId) => {
    try {
      await postsApi.delete(postId, userId)
      const updatedPosts = posts.filter(p => p.id !== postId)
      const updatedAllPosts = allPosts.filter(p => p.id !== postId)
      setPosts(updatedPosts)
      setAllPosts(updatedAllPosts)
      if (userId) {
        set(`posts:${userId}`, updatedAllPosts)
      }
      localStorage.setItem('posts_hard_deleted', Date.now().toString())
    } catch (error) {
      console.error('Error deleting post:', error)
      alert(`Could not delete post: ${error.message}`)
    }
  }

  const softDeletePost = async (postId) => {
    try {
      await postsApi.softDelete(postId, userId)
      const updatedPosts = posts.filter(p => p.id !== postId)
      const updatedAllPosts = allPosts.filter(p => p.id !== postId)
      setPosts(updatedPosts)
      setAllPosts(updatedAllPosts)
      if (userId) {
        set(`posts:${userId}`, updatedAllPosts)
      }
    } catch (error) {
      console.error('Error hiding post:', error)
      alert(`Could not hide post: ${error.message}`)
    }
  }

  const blockUser = async (blockedUserId, password) => {
    try {
      await usersApi.blockUser(Number(userId), Number(blockedUserId), password)
      const updatedPosts = posts.filter(p => Number(p.userId) !== Number(blockedUserId))
      const updatedAllPosts = allPosts.filter(p => Number(p.userId) !== Number(blockedUserId))
      setPosts(updatedPosts)
      setAllPosts(updatedAllPosts)
      if (userId) {
        set(`posts:${userId}`, updatedAllPosts)
      }
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const editPost = (post) => {
    setPostForm({ title: post.title, body: post.body, show: true, editing: post })
  }

  return {
    posts: filteredPosts,
    search,
    setSearch,
    postForm,
    setPostForm,
    getUserInitials,
    getUserName,
    savePost,
    deletePost,
    softDeletePost,
    blockUser,
    editPost,
    loadMore,
    hasMore,
    loading
  }
}
