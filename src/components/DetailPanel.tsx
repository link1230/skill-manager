import { useState } from 'react'
import { Skill } from '../types'

interface DetailPanelProps {
  skill: Skill | null
  open: boolean
  editing: boolean
  onClose: () => void
  onToggle: (id: string, enabled: boolean) => void
  onSave: (s: Skill) => void
  onUninstall: (id: string) => void
  onStartEdit: () => void
  onCancelEdit: () => void
}

export default function DetailPanel({ skill, open, editing, onClose, onToggle, onSave, onUninstall, onStartEdit, onCancelEdit }: DetailPanelProps) {
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editUsage, setEditUsage] = useState('')
  const [editVersion, setEditVersion] = useState('')
  const [editTags, setEditTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  if (!skill) return null

  const startEdit = () => {
    setEditName(skill.name)
    setEditDesc(skill.desc)
    setEditUsage(skill.usage)
    setEditVersion(skill.version)
    setEditTags([...(skill.tags || [])])
    setTagInput('')
    onStartEdit()
  }

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !editTags.includes(t)) setEditTags(prev => [...prev, t])
    setTagInput('')
  }

  const removeTag = (t: string) => setEditTags(prev => prev.filter(x => x !== t))

  const doSave = () => {
    onSave({ ...skill, name: editName, desc: editDesc, usage: editUsage, version: editVersion, tags: editTags })
  }

  return (
    <>
      <div className={`detail-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`detail-panel ${open ? 'open' : ''}`}>
        <div className="detail-header">
          <button className="back" onClick={onClose}>✕</button>
          <span className="dname">{editing ? '✏️ ' + editName : skill.name}</span>
          <span className="dagent">{skill.agent === 'reasonix' ? '⚡ Reasonix' : '🔧 Opencode'}</span>
        </div>
        <div className="detail-body">
          {editing ? (
            <>
              <div className="edit-field">
                <label>名称 (Name)</label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} />
              </div>
              <div className="edit-field">
                <label>简介 (Description)</label>
                <textarea rows={3} value={editDesc} onChange={e => setEditDesc(e.target.value)} />
              </div>
              <div className="edit-field">
                <label>🏷️ 标签 (回车添加)</label>
                <div className="tag-edit-area">
                  {editTags.map(t => (
                    <span key={t} className="edit-tag">
                      #{t}<span className="remove-tag" onClick={() => removeTag(t)}>×</span>
                    </span>
                  ))}
                  <input
                    className="tag-input"
                    placeholder="输入后按回车添加..."
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                  />
                </div>
              </div>
              <div className="edit-field">
                <label>使用方法 (Usage)</label>
                <textarea rows={6} value={editUsage} onChange={e => setEditUsage(e.target.value)} />
              </div>
              <div className="edit-field">
                <label>版本</label>
                <input type="text" value={editVersion} onChange={e => setEditVersion(e.target.value)} />
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8 }}>
                💡 修改保存后将同步到 agent 的 SKILL.md 文件
              </p>
            </>
          ) : (
            <>
              <div className="meta-grid">
                <div className="meta-item">
                  <div className="label">版本</div>
                  <div className="value">v{skill.version}</div>
                </div>
                <div className="meta-item">
                  <div className="label">更新日期</div>
                  <div className="value">{skill.updated}</div>
                </div>
                <div className="meta-item">
                  <div className="label">运行模式</div>
                  <div className="value"><span className={`tag ${skill.runAs === 'subagent' ? 'primary' : ''}`}>{skill.runAs}</span></div>
                </div>
                <div className="meta-item">
                  <div className="label">模型</div>
                  <div className="value"><span className="tag">{skill.model}</span></div>
                </div>
              </div>
              <div className="detail-section">
                <h3>📖 简介</h3>
                <p>{skill.desc}</p>
              </div>
              <div className="detail-section">
                <h3>🏷️ 标签</h3>
                <div className="detail-tags">
                  {(skill.tags || []).map(t => <span key={t} className="detail-tag">#{t}</span>)}
                  {(!skill.tags || skill.tags.length === 0) && <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>暂无标签</span>}
                </div>
              </div>
              <div className="detail-section">
                <h3>🔧 使用方法</h3>
                <div className="code-block">{skill.usage}</div>
              </div>
              <div className="detail-section">
                <h3>📂 文件位置</h3>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <span className="detail-tag" style={{
                    background: skill.scope === 'global' ? '#e8e0f0' : '#e0f0e8',
                    borderColor: skill.scope === 'global' ? '#b79ee0' : '#7ac8a8',
                    color: skill.scope === 'global' ? '#8b6fc0' : '#3a8f6f'
                  }}>
                    {skill.scope === 'global' ? '🌐 全局 Skill' : '📁 项目 Skill'}
                  </span>
                  <span className="detail-tag">{skill.scope === 'global' ? '适用于所有项目' : '仅限当前项目'}</span>
                </div>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
                  {skill.path}
                </p>
              </div>
            </>
          )}
        </div>
        <div className="detail-actions">
          {editing ? (
            <>
              <button className="btn btn-ghost" onClick={onCancelEdit}>取消</button>
              <div className="spacer" />
              <button className="btn btn-primary" onClick={doSave}>💾 保存</button>
            </>
          ) : (
            <>
              <label className="toggle" style={{ marginRight: 'auto' }}>
                <input
                  type="checkbox"
                  checked={skill.enabled}
                  onChange={e => onToggle(skill.id, e.target.checked)}
                />
                <span className="track"></span>
                <span className="handle"></span>
              </label>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginRight: 'auto' }}>
                {skill.enabled ? '已启用' : '已停用'}
              </span>
              <button className="btn btn-ghost" onClick={startEdit}>✏️ 编辑</button>
              <button className="btn btn-danger" onClick={() => onUninstall(skill.id)}>🗑️ 卸载</button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
