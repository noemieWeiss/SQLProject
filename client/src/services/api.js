const API_BASE = 'http://localhost:3000'

export const postsApi = {
  getAll: (page = 1, limit = 10) => fetch(`${API_BASE}/posts?_sort=id&_order=desc&_page=${page}&_limit=${limit}`).then(r => r.json()),
  getById: (id) => fetch(`${API_BASE}/posts/${id}`).then(r => r.json()),
  create: (post) => fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  }).then(r => r.json()),
  update: (id, post) => fetch(`${API_BASE}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  }).then(r => r.json()),
  delete: (id) => fetch(`${API_BASE}/posts/${id}`, { method: 'DELETE' })
}

export const commentsApi = {
  getByPostId: (postId) => fetch(`${API_BASE}/comments?postId=${postId}`).then(r => r.json()),
  create: (comment) => fetch(`${API_BASE}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment)
  }).then(r => r.json()),
  update: (id, comment) => fetch(`${API_BASE}/comments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment)
  }).then(r => r.json()),
  delete: (id) => fetch(`${API_BASE}/comments/${id}`, { method: 'DELETE' })
}

export const usersApi = {
  getAll: () => fetch(`${API_BASE}/users`).then(r => r.json()),
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (!res.ok) return null
    return res.json()
  },
  checkUsername: async (username) => {
    const users = await fetch(`${API_BASE}/users`).then(r => r.json())
    return users.find(u => u.username === username) ? true : false
  },
  create: (user) => fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  }).then(r => r.json())
}
export const todosApi = {
  getByUserId: (userId) => fetch(`${API_BASE}/todos?userId=${userId}`).then(r => r.json()),
  create: (todo) => fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  }).then(r => r.json()),
  update: (id, updates) => fetch(`${API_BASE}/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  }).then(r => r.json()),
  delete: (id) => fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' })
}
export const albumsApi = {
  getByUserId: (userId) => fetch(`${API_BASE}/albums?userId=${userId}`).then(r => r.json()),
  create: (album) => fetch(`${API_BASE}/albums`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(album)
  }).then(r => r.json()),
  update: (id, updates) => fetch(`${API_BASE}/albums/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  }).then(r => r.json()),
  delete: (id) => fetch(`${API_BASE}/albums/${id}`, { method: 'DELETE' })
}
export const photosApi = {
  getByAlbumId: (albumId, page = 1, limit = 6) => 
    fetch(`${API_BASE}/photos?albumId=${albumId}`).then(r => r.json()),
  getAll: () => fetch(`${API_BASE}/photos`).then(r => r.json()),
  create: (photo) => fetch(`${API_BASE}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(photo)
  }).then(r => r.json()),
  update: (id, updates) => fetch(`${API_BASE}/photos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  }).then(r => r.json()),
  delete: (id) => fetch(`${API_BASE}/photos/${id}`, { method: 'DELETE' })
}