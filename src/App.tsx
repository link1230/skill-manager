import { useState, useCallback, useEffect, useRef } from 'react'
import { skillsData as initialSkills, agentPresets, initialAgents } from './data'
import { Skill, Agent } from './types'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import TagBar from './components/TagBar'
import SkillGrid from './components/SkillGrid'
import DetailPanel from './components/DetailPanel'
import StatusBar from './components/StatusBar'
import AgentModal from './components/AgentModal'

declare global {
  interface Window {
    electronAPI?: {
      scanDirectory: (dir: string) => Promise<any[]>
      readFile: (path: string) => Promise<string | null>
      writeFile: (path: string, content: string) => Promise<boolean>
      deleteFile: (path: string) => Promise<boolean>
      getVersion: () => Promise<string>
    }
  }
}

export default function App() {
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [currentAgent, setCurrentAgent] = useState('all')
  const [currentTag, setCurrentTag] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [agentModalOpen, setAgentModalOpen] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [version, setVersion] = useState('v0.0.1')
  const toastIdRef = useRef(0)

  // ---- Toast ----
  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = ++toastIdRef.current
    const container = document.getElementById('toast-container')
    if (!container) return
    const el = document.createElement('div')
    el.className = `toast ${type}`
    el.textContent = msg
    el.dataset.toastId = String(id)
    container.appendChild(el)
    setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300) }, 2500)
  }, [])

  // ---- Version ----
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getVersion().then(v => setVersion(`v${v}`)).catch(() => {})
    }
  }, [])

  // ---- Filter ----
  const filtered = skills.filter(s => {
    if (currentAgent !== 'all' && s.agent !== currentAgent) return false
    if (currentTag && !(s.tags || []).includes(currentTag)) return false
    if (search) {
      const q = search.toLowerCase()
      return s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
    }
    return true
  })

  const allTags = [...new Set(skills.flatMap(s => s.tags || []))].sort()

  const tagCounts: Record<string, number> = {}
  const tagFiltered = currentAgent === 'all' ? skills : skills.filter(s => s.agent === currentAgent)
  tagFiltered.forEach(s => (s.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1 }))

  // ---- Handlers ----
  const toggleSkill = useCallback((id: string, enabled: boolean) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, enabled } : s))
    const skill = skills.find(s => s.id === id)
    showToast(`${enabled?'🟢':'⭕'} ${skill?.name||''} ${enabled?'已启用':'已停用'}`, enabled?'success':'error')
  }, [skills, showToast])

  const openDetail = useCallback((id: string) => {
    const s = skills.find(x => x.id === id)
    if (!s) return
    setSelectedSkill(s)
    setEditing(false)
    setDetailOpen(true)
  }, [skills])

  const closeDetail = useCallback(() => {
    if (editing) { showToast('⚠️ 请先保存或取消编辑', 'error'); return }
    setDetailOpen(false)
    setSelectedSkill(null)
    setEditing(false)
  }, [editing, showToast])

  const saveSkill = useCallback((updated: Skill) => {
    setSkills(prev => prev.map(s => s.id === updated.id ? { ...updated, updated: new Date().toISOString().slice(0,10) } : s))
    setSelectedSkill(updated)
    setEditing(false)
    showToast(`✅ ${updated.name} 已更新`, 'success')
  }, [showToast])

  const uninstallSkill = useCallback((id: string) => {
    const s = skills.find(x => x.id === id)
    if (!s) return
    if (!confirm(`确定要卸载 "${s.name}" 吗？\n此操作将从 agent 中删除该 skill。`)) return
    setSkills(prev => prev.filter(x => x.id !== id))
    setDetailOpen(false)
    setSelectedSkill(null)
    showToast(`🗑️ ${s.name} 已卸载`, 'error')
  }, [skills, showToast])

  const switchAgent = useCallback((agent: string) => {
    setCurrentAgent(agent)
    setCurrentTag(null)
  }, [])

  const filterByTag = useCallback((tag: string | null) => {
    setCurrentTag(tag)
  }, [])

  // ---- Scan ----
  const doScan = useCallback(() => {
    if (scanning) return
    setScanning(true)
    showToast('🔍 正在扫描...', 'info')
    // Simulate scan
    setTimeout(() => {
      setSkills(prev => {
        if (prev.find(s => s.id === 'web-scraper')) return prev
        return [...prev, {
          id:'web-scraper', name:'web-scraper', agent:'reasonix', scope:'project',
          path:'D:/MyProject/.reasonix/skills/web-scraper/SKILL.md', enabled:true,
          tags:['开发', '工具'], version:'0.1.0', updated:new Date().toISOString().slice(0,10),
          desc:'网页内容抓取工具 — 自动提取页面结构化数据。', icon:'🕸️',
          runAs:'inline', model:'deepseek-v4-flash',
          usage:'web-scraper({ url: "https://..." }) — 抓取并返回结构化内容。'
        }]
      })
      setScanning(false)
      showToast(`🔍 扫描完成！发现 ${skills.length + 1} 个 skill`, 'success')
    }, 1500)
  }, [scanning, skills.length, showToast])

  // ---- Add Agent ----
  const addAgent = useCallback((name: string, icon: string, globalPath: string, projectPath: string, preset: string) => {
    if (agents.find(a => a.name === name)) { showToast('⚠️ 该 Agent 已存在', 'error'); return }
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const color = agentPresets[preset]?.color || '#e59266'
    const newAgent: Agent = { id, preset, icon, name, globalPath, projectPath, skillCount: 0, connected: true, color }
    setAgents(prev => [...prev, newAgent])
    showToast(`🔌 ${name} 添加成功，正在扫描...`, 'info')

    setTimeout(() => {
      const newSkills: Skill[] = []
      if (preset === 'claude') {
        const n1 = skills.length + 1, n2 = skills.length + 2
        newSkills.push(
          { id:'claude-'+n1, name:'claude-review', agent:id, scope:'global', path:globalPath+'claude-review/SKILL.md', enabled:true, tags:['开发', '审查'], version:'0.1.0', updated:new Date().toISOString().slice(0,10), desc:'Claude Code 代码审查 skill — AI 驱动的代码质量检查。', icon:'👁️', runAs:'inline', model:'claude-sonnet-4', usage:'claude-review — 自动审查当前分支变更。' },
          { id:'claude-'+n2, name:'claude-doc', agent:id, scope:'project', path:'D:/MyProject/'+projectPath+'claude-doc/SKILL.md', enabled:true, tags:['文档'], version:'0.1.0', updated:new Date().toISOString().slice(0,10), desc:'自动生成项目文档和代码注释。', icon:'📝', runAs:'inline', model:'claude-sonnet-4', usage:'claude-doc — 选中代码生成文档。' }
        )
      }
      if (newSkills.length) {
        setSkills(prev => [...prev, ...newSkills.filter(s => !prev.find(x => x.id === s.id))])
        setAgents(prev => prev.map(a => a.id === id ? { ...a, skillCount: newSkills.length } : a))
        showToast(`✅ ${name} 已连接！发现 ${newSkills.length} 个 skill`, 'success')
      }
    }, 800)
  }, [agents, skills.length, showToast])

  const handleStartEdit = useCallback(() => setEditing(true), [])
  const handleCancelEdit = useCallback(() => setEditing(false), [])

  return (
    <div className="app">
      <Header
        onScan={doScan}
        scanning={scanning}
      />

      <div className="app-body">
        <Sidebar
          agents={agents}
          currentAgent={currentAgent}
          search={search}
          totalSkillCount={skills.length}
          onSearch={setSearch}
          onSwitchAgent={switchAgent}
          onOpenAgentManager={() => setAgentModalOpen(true)}
        />

        <main className="main">
          <div className="main-toolbar">
            <h2 id="sectionTitle">
              {currentAgent === 'all' ? '全部 Skills' : agents.find(a => a.id === currentAgent)?.name || 'Skills'}
              {currentTag ? ` · #${currentTag}` : ''}
            </h2>
            <span className="count">{filtered.length} 个模块</span>
            <div className="spacer" />
            <button className="btn-scan" onClick={doScan} disabled={scanning}>
              {scanning ? <><span className="spin">🔍</span> 扫描中...</> : '🔍 扫描发现'}
            </button>
            <span className="discovery-info">
              <span className={`dot ${scanning ? 'stale' : 'live'}`}></span>
              {scanning ? '正在发现...' : '实时监听中'}
            </span>
            <div className="view-ops">
              <button className="active" title="网格视图">▦</button>
              <button title="列表视图" onClick={() => showToast('列表视图（开发中）', 'info')}>☰</button>
            </div>
          </div>

          <TagBar
            tags={allTags}
            tagCounts={tagCounts}
            currentTag={currentTag}
            onFilterByTag={filterByTag}
          />

          <SkillGrid
            skills={filtered}
            onOpenDetail={openDetail}
            onToggle={toggleSkill}
            onFilterByTag={filterByTag}
          />
        </main>
      </div>

      <DetailPanel
        skill={selectedSkill}
        open={detailOpen}
        editing={editing}
        onClose={closeDetail}
        onToggle={toggleSkill}
        onSave={saveSkill}
        onUninstall={uninstallSkill}
        onStartEdit={handleStartEdit}
        onCancelEdit={handleCancelEdit}
      />

      <AgentModal
        open={agentModalOpen}
        agents={agents}
        onClose={() => setAgentModalOpen(false)}
        onAdd={addAgent}
      />

      <StatusBar
        totalSkills={skills.length}
        globalCount={skills.filter(s => s.scope === 'global').length}
        projectCount={skills.filter(s => s.scope === 'project').length}
        enabledCount={skills.filter(s => s.enabled).length}
        agentCount={agents.length}
        version={version}
      />

      <div id="toast-container" className="toast-container" />
    </div>
  )
}
