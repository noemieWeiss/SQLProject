import { useState } from 'react'
import usePhotos from '../../hooks/usePhotos'

const PhotoForm = ({ albumId, onAdd, onCancel }) => {
  const [photoData, setPhotoData] = useState({ title: '', url: '' })

  const handleSubmit = () => {
    if (photoData.title.trim() && photoData.url.trim()) {
      onAdd({ ...photoData, albumId })
      setPhotoData({ title: '', url: '' })
    }
  }

  return (
    <div className="photo-form">
      <h4>Add New Photo</h4>
      <input
        placeholder="Photo Title"
        value={photoData.title}
        onChange={(e) => setPhotoData(prev => ({ ...prev, title: e.target.value }))}
      />
      <input
        placeholder="Photo URL"
        value={photoData.url}
        onChange={(e) => setPhotoData(prev => ({ ...prev, url: e.target.value }))}
      />
      <button onClick={handleSubmit}>Add Photo</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}

const PhotoModal = ({ album, onClose }) => {
  const { 
    photos, 
    addPhoto, 
    deletePhoto, 
    loadMorePhotos, 
    hasMore, 
    loading 
  } = usePhotos(album.id)
  
  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Album Photos: {album.title}</h3>
          <div className="modal-actions">
            <button onClick={() => setShowAddForm(true)} className="add-photo-btn">Add Photo</button>
            <button onClick={onClose} className="close-btn">✕</button>
          </div>
        </div>

        {showAddForm && (
          <PhotoForm
            albumId={album.id}
            onAdd={(photoData) => {
              addPhoto(photoData)
              setShowAddForm(false)
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        <div className="photos-grid">
          {photos.map(photo => (
            <div key={photo.id} className="photo-item">
              <img src={photo.url} alt={photo.title} />
              <div className="photo-overlay">
                <p>{photo.title}</p>
                <button 
                  onClick={() => deletePhoto(photo.id)}
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

export default PhotoModal
export { PhotoForm }