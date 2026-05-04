import { useState, useEffect } from 'react'
import { albumsApi } from '../services/api'
import { useCache } from '../contexts/CacheContext'
import usePersistentState from './usePersistentState'

export default function useAlbums(userId) {
    const [albums, setAlbums] = useState([])
    const [search, setSearch] = usePersistentState(userId ? `ui:albums:${userId}:search` : null, { term: '', by: 'title' })
    const [sortBy, setSortBy] = usePersistentState(userId ? `ui:albums:${userId}:sortBy` : null, 'id')
    const [albumsForm, setAlbumsForm] = usePersistentState(userId ? `ui:albums:${userId}:form` : null, { title: '', editing: null })

    const { get, set } = useCache()

    useEffect(() => {
        const cacheKey = `albums:${userId}`
        const cached = userId ? get(cacheKey) : null
        if (cached) {
            setAlbums(cached)
            return
        }

        if (userId) {
            albumsApi.getByUserId(userId)
                .then(data => {
                    setAlbums(data)
                    set(cacheKey, data)
                })
                .catch(console.error)
        }
    }, [userId, get, set])

    const filteredAlbums = albums.filter(album => {
        if (!search.term) return true
        switch (search.by) {
            case 'id':
                return album.id.toString().includes(search.term)
            case 'title':
                return album.title.toLowerCase().includes(search.term.toLowerCase())
            default:
                return true
        }
    }).sort((a, b) => {
        switch (sortBy) {
            case 'id':
                return parseInt(a.id) - parseInt(b.id)
            case 'title':
                return a.title.localeCompare(b.title)
            default:
                return 0
        }
    })

    const addAlbum = async () => {
        if (!albumsForm.title.trim()) return

        try {
            const newAlbum = await albumsApi.create({
                userId: parseInt(userId),
                id: Math.random().toString(16).slice(2, 6),

                title: albumsForm.title
            })
            const updated = [...albums, newAlbum]
            setAlbums(updated)
            // Update cache
            if (userId) {
                const cacheKey = `albums:${userId}`
                set(cacheKey, updated)
            }
            setAlbumsForm({ title: '', editing: null })
        } catch (error) {
            console.error('Error adding album:', error)
        }
    }

    const updateAlbum = async (id, updates) => {
        try {
            const updated = await albumsApi.update(id, updates)
            const updatedAlbums = albums.map(album => album.id === id ? updated : album)
            setAlbums(updatedAlbums)
            if (userId) {
                const cacheKey = `albums:${userId}`
                set(cacheKey, updatedAlbums)
            }
        } catch (error) {
            console.error('Error updating album:', error)
        }
    }

    const deleteAlbum = async (id) => {
        try {
            await albumsApi.delete(id)
            const updatedAlbums = albums.filter(album => album.id !== id)
            setAlbums(updatedAlbums)
            if (userId) {
                const cacheKey = `albums:${userId}`
                set(cacheKey, updatedAlbums)
            }
        } catch (error) {
            console.error('Error deleting album:', error)
        }
    }

    const saveAlbumEdit = () => {
        if (albumsForm.title.trim()) {
            updateAlbum(albumsForm.editing, { title: albumsForm.title })
            setAlbumsForm({ title: '', editing: null })
        }
    }

    return {
        albums: filteredAlbums,
        search,
        setSearch,
        sortBy,
        setSortBy,
        albumsForm,
        setAlbumsForm,
        addAlbum,
        updateAlbum,
        deleteAlbum,
        saveAlbumEdit
    }
}