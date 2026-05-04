import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import usePhotos from '../hooks/usePhotos'
import PhotoModal, { PhotoForm } from './albums/PhotoModal'
import usePersistentState from '../hooks/usePersistentState'
import useLastPath from '../hooks/useLastPath'
import { useState, useEffect } from 'react'
import '../styles/Albums.css'

function Photos() {
  const navigate = useNavigate()
  const { userId, albumId, photoId } = useParams()
  const { user } = useUser()
  const { 
    photos, 
    addPhoto, 
    deletePhoto, 
    loadMorePhotos, 
    hasMore, 
    loading 
  } = usePhotos(albumId)
  
  useLastPath()
  
  const [showAddForm, setShowAddForm] = usePersistentState(albumId ? `ui:photos:${albumId}:showAddForm` : null, false)
  const [viewerMode, setViewerMode] = usePersistentState(albumId ? `ui:photos:${albumId}:viewerMode` : null, false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = usePersistentState(albumId ? `ui:photos:${albumId}:currentIndex` : null, 0)

  useEffect(() => {
    if (photoId && photos.length > 0) {
      const photoIndex = photos.findIndex(p => p.id.toString() === photoId)
      if (photoIndex !== -1) {
        setCurrentPhotoIndex(photoIndex)
        setViewerMode(true)
      }
    }
  }, [photoId, photos, setCurrentPhotoIndex, setViewerMode])

  const openViewer = (photoIndex) => {
    setCurrentPhotoIndex(photoIndex)
    setViewerMode(true)
    const photo = photos[photoIndex]
    if (photo) {
      navigate(`/users/${userId}/albums/${albumId}/photos/${photo.id}`)
    }
  }

  const closeViewer = () => {
    setViewerMode(false)
    navigate(`/users/${userId}/albums/${albumId}/photos`)
  }

  const nextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      const newIndex = currentPhotoIndex + 1
      setCurrentPhotoIndex(newIndex)
      const photo = photos[newIndex]
      if (photo) {
        navigate(`/users/${userId}/albums/${albumId}/photos/${photo.id}`)
      }
    }
  }

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      const newIndex = currentPhotoIndex - 1
      setCurrentPhotoIndex(newIndex)
      const photo = photos[newIndex]
      if (photo) {
        navigate(`/users/${userId}/albums/${albumId}/photos/${photo.id}`)
      }
    }
  }

  const selectThumbnail = (index) => {
    setCurrentPhotoIndex(index)
    const photo = photos[index]
    if (photo) {
      navigate(`/users/${userId}/albums/${albumId}/photos/${photo.id}`)
    }
  }

  if (viewerMode) {
    return (
      <div className="photo-viewer" onClick={closeViewer}>
        <div className="viewer-header" onClick={(e) => e.stopPropagation()}>
          <button onClick={closeViewer} className="close-viewer-btn">✕</button>
          <h3>{photos[currentPhotoIndex]?.title}</h3>
        </div>
        
        <div className="main-photo-container" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={prevPhoto} 
            className={`nav-btn prev-btn ${currentPhotoIndex === 0 ? 'disabled' : ''}`}
            disabled={currentPhotoIndex === 0}
          >‹</button>
          <img 
            src={photos[currentPhotoIndex]?.url} 
            alt={photos[currentPhotoIndex]?.title}
            className="main-photo"
          />
          <button 
            onClick={nextPhoto} 
            className={`nav-btn next-btn ${currentPhotoIndex === photos.length - 1 ? 'disabled' : ''}`}
            disabled={currentPhotoIndex === photos.length - 1}
          >›</button>
        </div>
        
        <div className="thumbnails-container" onClick={(e) => e.stopPropagation()}>
          <div className="thumbnails-scroll">
            {photos.map((photo, index) => (
              <img
                key={photo.id}
                src={photo.url}
                alt={photo.title}
                className={`thumbnail ${index === currentPhotoIndex ? 'active' : ''}`}
                onClick={() => selectThumbnail(index)}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="albums-page">
      <button className="back-home-btn" onClick={() => navigate(`/users/${userId}/albums`)}>
        ← Back to Albums
      </button>
      
      <div className="albums-container">
        <h2>Album Photos</h2>
        
        <div className="albums-controls">
          <button onClick={() => setShowAddForm(true)} className="add-photo-btn">
            Add Photo
          </button>
        </div>

        {showAddForm && (
          <PhotoForm
            albumId={albumId}
            onAdd={(photoData) => {
              addPhoto(photoData)
              setShowAddForm(false)
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        <div className="photos-grid">
          {photos.map((photo, index) => (
            <div key={photo.id} className="photo-item" onClick={() => openViewer(index)}>
              <img src={photo.url} alt={photo.title} />
              <div className="photo-overlay">
                <p>{photo.title}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    deletePhoto(photo.id)
                  }}
                  className="delete-photo-btn"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="load-more-section">
            <button 
              onClick={loadMorePhotos} 
              disabled={loading}
              className="load-more-btn"
            >
              {loading ? 'Loading...' : 'Load More Photos'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Photos