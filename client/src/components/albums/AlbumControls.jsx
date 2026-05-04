import SearchBar from '../SearchBar'
import SortSelect from '../SortSelect'

const AlbumControls = ({ search, setSearch, sortBy, setSortBy, albumsForm, setAlbumsForm, onAdd, onSave, onCancel }) => {
  const searchOptions = [
    { value: 'id', label: 'ID' },
    { value: 'title', label: 'Title' }
  ]

  const sortOptions = [
    { value: 'id', label: '📋 ID (Number)' },
    { value: 'title', label: '📝 Title (A-Z)' }
  ]
  const isEditing = albumsForm.editing !== null
  return (
    <div className="albums-controls-section">
      <div className="add-album">
        <input
          type="text"
          placeholder={isEditing ? "Edit album title..." : "Add new album..."}
          value={albumsForm.title}
          onChange={(e) => setAlbumsForm(prev => ({ ...prev, title: e.target.value }))}
          onKeyPress={(e) => e.key === 'Enter' && (isEditing ? onSave() : onAdd())}
        />
        <button onClick={isEditing ? onSave : onAdd}>
          {isEditing ? 'Save' : 'Add'}
        </button>
        {isEditing && (
          <button onClick={onCancel}>Cancel</button>
        )}
      </div>

      <div className="albums-sort-section">
        <SortSelect
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOptions={sortOptions}
        />
      </div>

      <div className="albums-search-section">
        <label>🔍 Search</label>
        <SearchBar
          search={search}
          setSearch={setSearch}
          searchOptions={searchOptions}
          placeholder="Search albums..."
        />
      </div>
    </div>
  )
}

export default AlbumControls