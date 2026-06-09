interface StatusBarProps {
  totalSkills: number
  globalCount: number
  projectCount: number
  enabledCount: number
  agentCount: number
  version: string
}

export default function StatusBar({ totalSkills, globalCount, projectCount, enabledCount, agentCount, version }: StatusBarProps) {
  return (
    <footer className="status-bar">
      <span><span className="dot green"></span> 运行中</span>
      <span>📦 {totalSkills} skills</span>
      <span>🌐 {globalCount} 全局</span>
      <span>📁 {projectCount} 项目</span>
      <span>✅ {enabledCount} 已启用</span>
      <span>🔗 {agentCount} agents</span>
      <div className="spacer" />
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{version}</span>
      <span className="sync">上次同步: 刚刚</span>
    </footer>
  )
}
