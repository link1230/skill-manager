interface TagBarProps {
  tags: string[]
  tagCounts: Record<string, number>
  currentTag: string | null
  onFilterByTag: (tag: string | null) => void
}

export default function TagBar({ tags, tagCounts, currentTag, onFilterByTag }: TagBarProps) {
  return (
    <div className="tag-bar">
      <span
        className={`tag-chip ${!currentTag ? 'active' : ''}`}
        onClick={() => onFilterByTag(null)}
      >
        🏷️ 全部标签
      </span>
      {tags.map(t => (
        <span
          key={t}
          className={`tag-chip ${currentTag === t ? 'active' : ''}`}
          onClick={() => onFilterByTag(t)}
        >
          {t} <span className="count">{tagCounts[t] || 0}</span>
        </span>
      ))}
    </div>
  )
}
