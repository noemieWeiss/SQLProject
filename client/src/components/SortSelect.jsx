import '../styles/SortSelect.css'

const SortSelect = ({ sortBy, setSortBy, sortOptions }) => (
  <div className="sort-section">
    <label>⬆️ Sort by</label>
    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
      {sortOptions.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
)

export default SortSelect
