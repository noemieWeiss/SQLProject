import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import useAlbums from '../hooks/useAlbums'
import usePhotos from '../hooks/usePhotos'
import usePersistentState from '../hooks/usePersistentState'
import useLastPath from '../hooks/useLastPath'
import AlbumControls from './albums/AlbumControls'
import AlbumList from './albums/AlbumList'
import '../styles/Albums.css'

function Albums() {
  const navigate = useNavigate()
  const { userId } = useParams()
  const { user } = useUser()

  useLastPath()
  const {
    albums,
    search,
    setSearch,
    sortBy,
    setSortBy,
    albumsForm,
    setAlbumsForm,
    addAlbum,
    updateAlbum,
    deleteAlbum,
    startAlbumEdit,
    saveAlbumEdit
  } = useAlbums(userId)
  const [selectedAlbum, setSelectedAlbum] = usePersistentState(userId ? `ui:albums:${userId}:selectedAlbum` : null, null)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [selectedAlbumForPhotos, setSelectedAlbumForPhotos] = usePersistentState(userId ? `ui:albums:${userId}:selectedAlbumForPhotos` : null, null)
  const [viewerMode, setViewerMode] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = usePersistentState(userId ? `ui:albums:${userId}:currentPhotoIndex` : null, 0)
  const [editingPhoto, setEditingPhoto] = useState(null)
  const [editPhotoTitle, setEditPhotoTitle] = useState('')
  const [showAddPhotoForm, setShowAddPhotoForm] = useState(false)

  const {
    photos,
    updatePhoto,
  } = usePhotos(selectedAlbumForPhotos?.id)

  const selectAlbum = (album) => {
    navigate(`/users/${userId}/albums/${album.id}/photos`)
  }

  const closeViewer = () => {
    setViewerMode(false)
  }

  const nextPhoto = () => {
    if (photos && photos.length > 0 && currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1)
    }
  }

  const prevPhoto = () => {
    if (photos && photos.length > 0 && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1)
    }
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (viewerMode && showPhotoModal) {
        if (e.key === 'ArrowRight') {
          nextPhoto()
        } else if (e.key === 'ArrowLeft') {
          prevPhoto()
        } else if (e.key === 'Escape') {
          closeViewer()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [viewerMode, showPhotoModal, currentPhotoIndex, photos])

  return (
    <div className="albums-page">
      <div className="albums-container">
        <h2>My Albums</h2>

        <div className="albums-controls">
          <AlbumControls
            search={search}
            setSearch={setSearch}
            sortBy={sortBy}
            setSortBy={setSortBy}
            albumsForm={albumsForm}
            setAlbumsForm={setAlbumsForm}
            onAdd={addAlbum}
            onSave={saveAlbumEdit}
            onCancel={() => setAlbumsForm({ title: '', editing: null })}
          />
        </div>

        <AlbumList
          albums={albums}
          user={user}
          getUserInitials={() => 'U'}
          onEdit={updateAlbum}
          onDelete={deleteAlbum}
          selectedAlbum={selectedAlbum}
          onSelect={selectAlbum}
        />
      </div>
    </div>
  )
}

export default Albums