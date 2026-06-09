import { Skill } from '../types'
import SkillCard from './SkillCard'

interface SkillGridProps {
  skills: Skill[]
  onOpenDetail: (id: string) => void
  onToggle: (id: string, enabled: boolean) => void
  onFilterByTag: (tag: string | null) => void
}

export default function SkillGrid({ skills, onOpenDetail, onToggle, onFilterByTag }: SkillGridProps) {
  if (skills.length === 0) {
    return (
      <div className="grid-scroll empty">
        <div className="empty-state">
          <div className="ico">🍃</div>
          <h3>没有匹配的 skill</h3>
          <p>试试不同的筛选条件或搜索词？</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid-scroll">
      <div className="grid">
        {skills.map(s => (
          <SkillCard
            key={s.id}
            skill={s}
            onOpenDetail={onOpenDetail}
            onToggle={onToggle}
            onFilterByTag={onFilterByTag}
          />
        ))}
      </div>
    </div>
  )
}
