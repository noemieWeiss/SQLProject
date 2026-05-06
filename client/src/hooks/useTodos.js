import { useState, useEffect } from 'react'
import { todosApi } from '../services/api'
import { useCache } from '../contexts/CacheContext'
import usePersistentState from './usePersistentState'

export const useTodos = (userId) => {
  const [todos, setTodos] = useState([])
  const [search, setSearch] = usePersistentState(userId ? `ui:todos:${userId}:search` : null, { term: '', field: 'title' })
  const [sortBy, setSortBy] = usePersistentState(userId ? `ui:todos:${userId}:sortBy` : null, 'id')
  const [todoForm, setTodoForm] = usePersistentState(userId ? `ui:todos:${userId}:form` : null, { title: '', editing: null })

  const { get, set } = useCache()

  useEffect(() => {
    const cacheKey = `todos:${userId}`
    const cached = userId ? get(cacheKey) : null
    if (cached) {
      setTodos(cached)
      return
    }

    if (userId) {
      todosApi.getByUserId(userId)
        .then(data => {
          setTodos(data)
          set(cacheKey, data)
        })
        .catch(console.error)
    }
  }, [userId, get, set])

  const filteredTodos = todos.filter(todo => {
    if (!search.term) return true
    switch (search.field) {
      case 'id':
        return todo.id.toString().includes(search.term)
      case 'title':
        return todo.title?.toLowerCase().includes(search.term.toLowerCase()) ?? false
      case 'completed':
        const searchValue = search.term.toLowerCase()
        if (searchValue === 'true' || searchValue === 'completed' || searchValue === 'done') {
          return todo.completed == true
        } else if (searchValue === 'false' || searchValue === 'pending' || searchValue === 'incomplete') {
          return todo.completed == false
        }
        return false
      default:
        return true
    }
  }).sort((a, b) => {
    switch (sortBy) {
      case 'id':
        return parseInt(a.id) - parseInt(b.id)
      case 'title':
        return a.title.localeCompare(b.title)
      case 'completed':
        if (a.completed === b.completed) {
          return parseInt(a.id) - parseInt(b.id)
        }
        return a.completed ? -1 : 1
      default:
        return 0
    }
  })

  const addTodo = async () => {
    if (!todoForm.title.trim()) return

    try {
      const newTodo = await todosApi.create({
        userId: parseInt(userId),
        title: todoForm.title,
        completed: false
      })
      const updated = [...todos, newTodo]
      setTodos(updated)
      if (userId) {
        set(`todos:${userId}`, updated)
      }
      setTodoForm({ title: '', editing: null })
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const updateTodo = async (id, updates) => {
    try {
      const updated = await todosApi.update(id, updates)
      const updatedTodos = todos.map(todo => todo.id === id ? updated : todo)
      setTodos(updatedTodos)
      if (userId) {
        set(`todos:${userId}`, updatedTodos)
      }
      if (todoForm.editing === id) {
        setTodoForm({ title: '', editing: null })
      }
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await todosApi.delete(id)
      const updated = todos.filter(todo => todo.id !== id)
      setTodos(updated)
      if (userId) {
        set(`todos:${userId}`, updated)
      }
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const startEdit = (id, title) => {
    setTodoForm({ title, editing: id })
  }

  const saveEdit = () => {
    if (todoForm.title.trim()) {
      updateTodo(todoForm.editing, { title: todoForm.title })
    }
  }

  return {
    todos: filteredTodos,
    search,
    setSearch,
    sortBy,
    setSortBy,
    todoForm,
    setTodoForm,
    addTodo,
    updateTodo,
    deleteTodo,
    startEdit,
    saveEdit
  }
}