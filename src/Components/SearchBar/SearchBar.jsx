export default function SearchBar({ search, setSearch }) {
    return (
      <input
        type="text"
        placeholder="Search by name or NIC"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ margin: '20px', padding: '10px', width: '300px' }}
      />
    )
  }
  