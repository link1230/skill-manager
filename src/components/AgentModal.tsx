import { useState } from 'react'
import { Agent, AgentPreset } from '../types'
import { agentPresets } from '../data'

interface AgentModalProps {
  open: boolean
  agents: Agent[]
  onClose: () => void
  onAdd: (name: string, icon: string, globalPath: string, projectPath: string, preset: string) => void
}

export default function AgentModal({ open, agents, onClose, onAdd }: AgentModalProps) {
  const [preset, setPreset] = useState('claude')
  const [name, setName] = useState('Claude Code')
  const [icon, setIcon] = useState('🤖')
  const [globalPath, setGlobalPath] = useState('~/.claude/skills/')
  const [projectPath, setProjectPath] = useState('.claude/skills/')

  const handlePresetChange = (v: string) => {
    setPreset(v)
    const p = agentPresets[v]
    if (p) {
      setName(p.name)
      setIcon(p.icon)
      setGlobalPath(p.globalPath)
      setProjectPath(p.projectPath)
    }
  }

  const handleAdd = () => {
    if (!name.trim() || !globalPath.trim()) return
    onAdd(name.trim(), icon.trim() || '🔌', globalPath.trim(), projectPath.trim(), preset)
    // Reset form
    handlePresetChange('claude')
  }

  if (!open) return null

  return (
    <div className="agent-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="agent-modal">
        <div className="agent-modal-header">
          <h2>🔌 Agent 管理</h2>
          <button className="close" onClick={onClose}>✕</button>
        </div>
        <div className="agent-modal-body">
          <div className="agent-section">
            <h3>📋 已连接的 Agent</h3>
            {agents.length === 0 ? (
              <div className="no-agents">
                <div className="ico">🔌</div>
                <p>尚未连接任何 Agent，请添加</p>
              </div>
            ) : (
              agents.map(a => (
                <div key={a.id} className="agent-card">
                  <div className="aicon" style={{ background: a.color + '18', borderColor: a.color }}>{a.icon}</div>
                  <div className="ainfo">
                    <div className="aname">{a.name}</div>
                    <div className="apath">{a.globalPath}</div>
                  </div>
                  <div className="askill-count"><span>{a.skillCount}</span> skills</div>
                  <span className={`astatus ${a.connected ? 'online' : 'offline'}`}>
                    {a.connected ? '🟢 已连接' : '⭕ 未连接'}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="agent-section">
            <h3>➕ 添加新 Agent</h3>
            <div className="add-agent-form">
              <div className="form-row">
                <div className="form-group" style={{ flex: 0.6 }}>
                  <label>Agent 类型</label>
                  <select value={preset} onChange={e => handlePresetChange(e.target.value)}>
                    <option value="claude">🤖 Claude Code</option>
                    <option value="reasonix">⚡ Reasonix Code</option>
                    <option value="opencode">🔧 Opencode</option>
                    <option value="custom">🔌 自定义</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>显示名称</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="例: Claude Code" />
                </div>
                <div className="form-group" style={{ flex: 0.4 }}>
                  <label>图标</label>
                  <input type="text" value={icon} onChange={e => setIcon(e.target.value)} placeholder="Emoji" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>全局 Skill 路径</label>
                  <input type="text" value={globalPath} onChange={e => setGlobalPath(e.target.value)} placeholder="~/.agent/skills/" />
                  <div className="hint">此路径下的 skill 对所有项目可用</div>
                </div>
                <div className="form-group">
                  <label>项目 Skill 路径</label>
                  <input type="text" value={projectPath} onChange={e => setProjectPath(e.target.value)} placeholder=".agent/skills/" />
                  <div className="hint">项目目录下的相对路径</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <button className="btn-add-agent" onClick={handleAdd}>➕ 添加并扫描</button>
              </div>
            </div>
          </div>

          <div className="agent-section" style={{ marginBottom: 0 }}>
            <h3>💡 工作原理</h3>
            <div style={{
              background: 'var(--bg)', border: '2px solid #e8e2d6',
              borderRadius: 'var(--radius-card)', padding: '14px 18px',
              fontSize: 12, lineHeight: 1.8, color: 'var(--text-secondary)'
            }}>
              <p><strong style={{ color: 'var(--text-primary)' }}>添加 Agent</strong> → 配置 skill 目录 → 扫描发现已有 skill → 管理端自动识别 <strong>全局</strong> 或 <strong>项目</strong> 范围</p>
              <p><strong style={{ color: 'var(--text-primary)' }}>操作同步</strong> → 在管理端启用/禁用/编辑/删除 skill 后，自动写入对应 Agent 的文件目录</p>
              <p><strong style={{ color: 'var(--text-primary)' }}>双向监听</strong> → Agent 端新增/修改 skill 后，管理端实时检测并更新列表</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
