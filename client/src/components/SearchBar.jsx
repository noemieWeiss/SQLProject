import '../styles/SearchBar.css'

const SearchBar = ({ search, setSearch, searchOptions, placeholder }) => (
  <div className="search-container">
    <input
      className="search-input"
      type="text"
      placeholder={placeholder || 'Search...'}
      value={search.term}
      onChange={(e) => setSearch(prev => ({ ...prev, term: e.target.value }))}
    />
    <select
      className="search-select"
      value={search.field}
      onChange={(e) => setSearch(prev => ({ ...prev, field: e.target.value }))}
    >
      {searchOptions.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
)

export default SearchBar
