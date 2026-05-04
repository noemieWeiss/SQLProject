import { useState, useEffect } from 'react'
import { photosApi } from '../services/api'
import { useCache } from '../contexts/CacheContext'
import usePersistentState from './usePersistentState'

export default function usePhotos(albumId) {
    const [photos, setPhotos] = useState([])
    const [search, setSearch] = usePersistentState(albumId ? `ui:photos:${albumId}:search` : null, { term: '', by: 'title' })
    const [sortBy, setSortBy] = usePersistentState(albumId ? `ui:photos:${albumId}:sortBy` : null, 'id')
    const [photosForm, setPhotosForm] = usePersistentState(albumId ? `ui:photos:${albumId}:form` : null, { title: '', url: '', editing: null })
    const [currentPage, setCurrentPage] = usePersistentState(albumId ? `ui:photos:${albumId}:page` : null, 1)
    const [photosPerPage] = useState(6)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [totalPhotos, setTotalPhotos] = useState(0)

    const { get, set } = useCache()

    useEffect(() => {
        if (!albumId) return

        const cacheKey = `photos:${albumId}`
        const cached = get(cacheKey)

        if (cached) {
            setTotalPhotos(cached.length)
            const firstPagePhotos = cached.slice(0, photosPerPage)
            setPhotos(firstPagePhotos)
            setHasMore(cached.length > photosPerPage)
        } else {
            setPhotos([])
            setCurrentPage(1)
            setHasMore(true)
            setTotalPhotos(0)

            photosApi.getByAlbumId(albumId)
                .then(albumPhotos => {
                    setTotalPhotos(albumPhotos.length)
                    const firstPagePhotos = albumPhotos.slice(0, photosPerPage)
                    setPhotos(firstPagePhotos)
                    setHasMore(albumPhotos.length > photosPerPage)
                    set(cacheKey, albumPhotos)
                })
                .catch(console.error)
        }
    }, [albumId, get, set, photosPerPage])

    const loadMorePhotos = async () => {
        if (!hasMore || loading) return

        setLoading(true)

        try {
            const albumPhotos = await photosApi.getByAlbumId(albumId)

            const nextPage = currentPage + 1
            const startIndex = (nextPage - 1) * photosPerPage
            const endIndex = startIndex + photosPerPage
            const nextPagePhotos = albumPhotos.slice(startIndex, endIndex)

            if (nextPagePhotos.length === 0) {
                alert('no more photos to show')
                setHasMore(false)
            } else {
                setPhotos(prev => [...prev, ...nextPagePhotos])
                setCurrentPage(nextPage)
                setHasMore(endIndex < albumPhotos.length)
            }
        } catch (error) {
            console.error('Error loading photos:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredPhotos = photos.filter(photo => {
        if (!search.term) return true
        switch (search.by) {
            case 'id':
                return photo.id.toString().includes(search.term)
            case 'title':
                return photo.title.toLowerCase().includes(search.term.toLowerCase())
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

    const addPhoto = async (photoData) => {
        if (!photoData.title.trim() || !photoData.url.trim()) return

        const titleExists = photos.some(photo =>
            photo.title.toLowerCase() === photoData.title.toLowerCase()
        )

        if (titleExists) {
            alert('photo name exisits')
            return
        }

        try {
            const newPhoto = await photosApi.create({
                albumId: parseInt(albumId),
                title: photoData.title,
                url: photoData.url
            })
            const updatedPhotos = [...photos, newPhoto]
            setPhotos(updatedPhotos)
            const cacheKey = `photos:${albumId}`
            const allPhotos = get(cacheKey) || []
            set(cacheKey, [...allPhotos, newPhoto])
        } catch (error) {
            console.error('Error adding photo:', error)
        }
    }

    const updatePhoto = async (id, updates) => {
        try {
            const updated = await photosApi.update(id, updates)
            const updatedPhotos = photos.map(photo => photo.id === id ? updated : photo)
            setPhotos(updatedPhotos)
            // Update cache
            const cacheKey = `photos:${albumId}`
            const allPhotos = get(cacheKey) || []
            const updatedAllPhotos = allPhotos.map(photo => photo.id === id ? updated : photo)
            set(cacheKey, updatedAllPhotos)
            if (photosForm.editing === id) {
                setPhotosForm({ title: '', url: '', editing: null })
            }

        } catch (error) {
            console.error('Error updating photo:', error)
        }
    }

    const deletePhoto = async (id) => {
        try {
            await photosApi.delete(id)
            const updatedPhotos = photos.filter(photo => photo.id !== id)
            setPhotos(updatedPhotos)
            // Update cache
            const cacheKey = `photos:${albumId}`
            const allPhotos = get(cacheKey) || []
            const updatedAllPhotos = allPhotos.filter(photo => photo.id !== id)
            set(cacheKey, updatedAllPhotos)

        } catch (error) {
            console.error('Error deleting photo:', error)
        }
    }

    const startEdit = (id, title, url) => {
        setPhotosForm({ title, url, editing: id })
    }

    const saveEdit = () => {
        if (photosForm.title.trim() && photosForm.url.trim()) {
            updatePhoto(photosForm.editing, { title: photosForm.title, url: photosForm.url })
        }
    }

    return {
        photos: filteredPhotos,
        search,
        setSearch,
        sortBy,
        setSortBy,
        photosForm,
        setPhotosForm,
        addPhoto,
        updatePhoto,
        deletePhoto,
        startEdit,
        saveEdit,
        currentPage,
        hasMore,
        loading,
        loadMorePhotos
    }
}