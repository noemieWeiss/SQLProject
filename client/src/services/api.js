const API_BASE = 'http://localhost:3000'

const getToken = () => {
  try {
    const stored = localStorage.getItem('authUser')
    return stored ? JSON.parse(stored).token : null
  } catch {
    return null
  }
}

const authHeader = () => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  ...authHeader()
})

const handleResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem('authUser')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }
  return res
}

export const postsApi = {
  getAll: (page = 1, limit = 10, requestingUserId = null) => {
    const params = new URLSearchParams({ _sort: 'id', _order: 'desc', _page: page, _limit: limit })
    if (requestingUserId) params.append('requestingUserId', requestingUserId)
    return fetch(`${API_BASE}/posts?${params}`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json())
  },
  getById: (id) =>
    fetch(`${API_BASE}/posts/${id}`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),
  create: (post) =>
    fetch(`${API_BASE}/posts`, { method: 'POST', headers: jsonHeaders(), body: JSON.stringify(post) })
      .then(handleResponse).then(r => r.json()),
  update: (id, post) =>
    fetch(`${API_BASE}/posts/${id}`, { method: 'PUT', headers: jsonHeaders(), body: JSON.stringify(post) })
      .then(handleResponse).then(r => r.json()),
  delete: async (id, userId) => {
    const res = await fetch(`${API_BASE}/posts/${id}?userId=${userId}`, { method: 'DELETE', headers: authHeader() })
    await handleResponse(res)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || `Delete failed (${res.status})`)
    }
  },
  softDelete: async (id, userId) => {
    const res = await fetch(`${API_BASE}/posts/${id}/hide`, { method: 'POST', headers: jsonHeaders(), body: JSON.stringify({ userId }) })
    await handleResponse(res)
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.message || `Hide failed (${res.status})`)
    return data
  }
}

export const commentsApi = {
  getByPostId: (postId) =>
    fetch(`${API_BASE}/posts/${postId}/comments`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),
  create: (comment) =>
    fetch(`${API_BASE}/comments`, { method: 'POST', headers: jsonHeaders(), body: JSON.stringify(comment) })
      .then(handleResponse).then(r => r.json()),
  update: (id, comment) =>
    fetch(`${API_BASE}/comments/${id}`, { method: 'PUT', headers: jsonHeaders(), body: JSON.stringify(comment) })
      .then(handleResponse).then(r => r.json()),
  delete: (id, userId) =>
    fetch(`${API_BASE}/comments/${id}?userId=${userId}`, { method: 'DELETE', headers: authHeader() })
      .then(handleResponse)
}

export const usersApi = {
  getAll: () =>
    fetch(`${API_BASE}/users`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (!res.ok) return null
    return res.json()
  },
  create: (user) =>
    fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username, name: user.name, email: user.email, password: user.password })
    }).then(r => r.json()),
  blockUser: async (blockerId, blockedId, password) => {
    const res = await fetch(`${API_BASE}/users/block`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ blockerId, blockedId, password })
    })
    await handleResponse(res)
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.message || 'Block failed')
    return data
  },
  changePassword: async (userId, currentPassword, newPassword) => {
    const res = await fetch(`${API_BASE}/users/${userId}/password`, {
      method: 'PUT',
      headers: jsonHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    })
    await handleResponse(res)
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.message || 'Password change failed')
    return data
  }
}

export const todosApi = {
  getByUserId: (userId) =>
    fetch(`${API_BASE}/users/${userId}/todos`, { headers: authHeader() })
      .then(handleResponse).then(r => r.json()),
  create: (todo) =>
    fetch(`${API_BASE}/todos`, { method: 'POST', headers: jsonHeaders(), body: JSON.stringify(todo) })
      .then(handleResponse).then(r => r.json()),
  update: (id, updates) =>
    fetch(`${API_BASE}/todos/${id}`, { method: 'PUT', headers: jsonHeaders(), body: JSON.stringify(updates) })
      .then(handleResponse).then(r => r.json()),
  delete: (id) =>
    fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE', headers: authHeader() })
      .then(handleResponse)
}
