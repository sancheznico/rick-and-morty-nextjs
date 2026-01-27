export default function SkeletonGrid() {
  return (
    <div className="grid">
      {Array.from({ length: 10 }).map((_, idx) => (
        <div key={idx} className="card skeleton-card">
          <div className="skeleton-img" />
          <div className="skeleton-text" />
          <div className="skeleton-text short" />
        </div>
      ))}
    </div>
  );
}
