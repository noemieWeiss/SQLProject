import { useState } from 'react'

const AlbumCard = ({ 
  album, 
  user, 
  onEdit, 
  onDelete, 
  selectedAlbum, 
  onSelect
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(album.title)
  const isSelected = selectedAlbum?.id === album.id
  const canEdit = Number(album.userId) === Number(user?.id)

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit(album.id, { title: editTitle })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditTitle(album.title)
    setIsEditing(false)
  }

  return (
    <div className={`album-card ${isSelected ? 'selected' : ''}`}>
      <div className="album-header">
        <span className="album-id">#{album.id}</span>
        {canEdit && (
          <div className="album-actions">
            <button onClick={() => setIsEditing(true)} className="edit-btn">✏️</button>
            <button onClick={() => onDelete(album.id)} className="delete-btn">🗑️</button>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="album-edit">
          <input 
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="album-edit-input"
          />
          <div className="album-edit-actions">
            <button onClick={handleSave} className="save-btn">💾</button>
            <button onClick={handleCancel} className="cancel-btn">❌</button>
          </div>
        </div>
      ) : (
        <h3 className="album-title" onClick={() => onSelect(album)}>{album.title}</h3>
      )}
      
      {isSelected && (
        <div className="album-details">
          <p className="album-description">Album ID: {album.id}</p>
          <p className="album-user">Created by User: {album.userId}</p>
        </div>
      )}
    </div>
  )
}

const AlbumList = ({ 
  albums, 
  user, 
  onEdit, 
  onDelete, 
  selectedAlbum, 
  onSelect
}) => {
  return (
    <div className="albums-grid">
      {albums.map(album => (
        <AlbumCard
          key={album.id}
          album={album}
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
          selectedAlbum={selectedAlbum}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

export default AlbumList
export { AlbumCard }