import { Skill } from '../types'

interface SkillCardProps {
  skill: Skill
  onOpenDetail: (id: string) => void
  onToggle: (id: string, enabled: boolean) => void
  onFilterByTag: (tag: string | null) => void
}

export default function SkillCard({ skill, onOpenDetail, onToggle, onFilterByTag }: SkillCardProps) {
  return (
    <div
      className={`card ${skill.enabled ? '' : 'disabled'}`}
      onClick={() => onOpenDetail(skill.id)}
    >
      <div className="badge-group">
        <span className={`badge-agent ${skill.agent === 'reasonix' ? 'rx' : 'oc'}`}>
          {skill.agent === 'reasonix' ? '⚡ RX' : '🔧 OC'}
        </span>
        <span className={`badge-scope ${skill.scope}`}>
          {skill.scope === 'global' ? '🌐 全局' : '📁 项目'}
        </span>
      </div>
      <div className="icon-wrap">{skill.icon}</div>
      <div className="name">{skill.name}</div>
      <div className="desc">{skill.desc}</div>
      <div className="card-tags">
        {(skill.tags || []).map(t => (
          <span
            key={t}
            className="card-tag"
            onClick={e => { e.stopPropagation(); onFilterByTag(t) }}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="meta">
        <span className="ver">v{skill.version}</span>
        <span>{skill.updated}</span>
        <span>{skill.runAs}</span>
      </div>
      <div className="bottom-row">
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
          {skill.enabled ? '🟢 启用' : '⭕ 停用'}
        </span>
        <label className="toggle" onClick={e => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={skill.enabled}
            onChange={e => onToggle(skill.id, e.target.checked)}
          />
          <span className="track"></span>
          <span className="handle"></span>
        </label>
      </div>
    </div>
  )
}
