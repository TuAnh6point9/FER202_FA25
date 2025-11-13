export default function FilterBox({ filter, setFilter }) {
  return (
    <div className="card p-3 mb-3">
      <input
        placeholder="Category..."
        className="form-control"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
    </div>
  );
}
