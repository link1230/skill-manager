import { Agent } from '../types'

interface SidebarProps {
  agents: Agent[]
  currentAgent: string
  search: string
  totalSkillCount: number
  onSearch: (v: string) => void
  onSwitchAgent: (agent: string) => void
  onOpenAgentManager: () => void
}

export default function Sidebar({ agents, currentAgent, search, totalSkillCount, onSearch, onSwitchAgent, onOpenAgentManager }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">🌿 导航</div>
      <div className="search-box">
        <span className="icon">🔍</span>
        <input
          type="text"
          placeholder="搜索 skill..."
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>
      <div className="nav-list">
        <div className="nav-label">Agent</div>
        <div
          className={`nav-item ${currentAgent === 'all' ? 'active' : ''}`}
          onClick={() => onSwitchAgent('all')}
        >
          <span className="ico">📦</span> 全部
          <span className="count">{totalSkillCount}</span>
        </div>
        {agents.map(a => (
          <div
            key={a.id}
            className={`nav-item ${currentAgent === a.id ? 'active' : ''}`}
            onClick={() => onSwitchAgent(a.id)}
          >
            <span className="ico">{a.icon}</span> {a.name}
            <span className="count">{a.skillCount}</span>
          </div>
        ))}
        <div className="nav-divider" />
        <div className="nav-label">管理</div>
        <div className="nav-item" onClick={onOpenAgentManager}>
          <span className="ico">🔌</span> Agent 管理
        </div>
      </div>
    </aside>
  )
}
