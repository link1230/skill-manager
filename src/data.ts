import { Skill, AgentPreset, Agent } from './types'

export const skillsData: Skill[] = [
  { id:'explore', name:'explore', agent:'reasonix', scope:'global', path:'~/.reasonix/skills/explore/SKILL.md', enabled:true, tags:['开发', '调查'],  version:'1.2.0', updated:'2025-02-15', desc:'在隔离子 agent 中探索代码库 — 只读宽网调查，返回一个精炼结论。', icon:'🔍', runAs:'subagent', model:'deepseek-v4-flash', usage:'run_skill({ name: "explore", arguments: "..." }) 或调用 explore({ task: "..." }) 工具。' },
  { id:'research', name:'research', agent:'reasonix', scope:'global', path:'~/.reasonix/skills/research/SKILL.md', enabled:true, tags:['开发', '调研'],  version:'1.1.0', updated:'2025-02-10', desc:'结合代码阅读与网络搜索进行调研 — 在隔离子 agent 中综合信息。', icon:'📚', runAs:'subagent', model:'deepseek-v4-flash', usage:'research({ task: "question" }) — 自动结合 web_search + search_content 返回综合结论。' },
  { id:'review', name:'review', agent:'reasonix', scope:'global', path:'~/.reasonix/skills/review/SKILL.md', enabled:true, tags:['开发', '审查'],  version:'1.3.0', updated:'2025-02-18', desc:'审查当前分支变更 — 检查正确性、安全性、缺失测试、隐藏行为变更。', icon:'👁️', runAs:'subagent', model:'deepseek-v4-pro', usage:'review({ task: "focus on auth" }) — 自动读取 git diff 进行分析。' },
  { id:'security-review', name:'security-review', agent:'reasonix', scope:'global', path:'~/.reasonix/skills/security-review/SKILL.md', enabled:true, tags:['安全', '审查'],  version:'1.0.0', updated:'2025-02-01', desc:'安全专项审查 — 标记注入/认证/密钥/反序列化/路径穿越/加密问题。', icon:'🔒', runAs:'subagent', model:'deepseek-v4-pro', usage:'security-review({ task: "full" }) — severity-tagged 结果。' },
  { id:'test', name:'test', agent:'reasonix', scope:'global', path:'~/.reasonix/skills/test/SKILL.md', enabled:true, tags:['开发', '测试'],  version:'1.2.0', updated:'2025-02-14', desc:'运行测试套件并诊断失败 — 自动识别测试框架，修复后重跑直至通过。', icon:'🧪', runAs:'inline', model:'deepseek-v4-flash', usage:'test — 自动检测框架并运行。支持 jest / vitest / pytest / go test。' },
  { id:'gpt-taste', name:'gpt-taste', agent:'reasonix', scope:'global', path:'~/.reasonix/skills/gpt-taste/SKILL.md', enabled:false,tags:['设计', '前端'], version:'2.0.0', updated:'2025-03-01', desc:'Elite Awwwards 级前端设计与 GSAP 动效。Python 驱动的真实随机化。', icon:'🎨', runAs:'inline', model:'deepseek-v4-pro', usage:'gpt-taste — 自动生成 premium 前端设计 + 动效。' },
  { id:'image-to-code', name:'image-to-code', agent:'reasonix', scope:'project', path:'D:/MyProject/.reasonix/skills/image-to-code/SKILL.md', enabled:true, tags:['设计', '前端'],  version:'1.0.0', updated:'2025-02-20', desc:'图片转代码 — 生成设计图 → 深度分析 → 实现前端。', icon:'🖼️', runAs:'inline', model:'deepseek-v4-flash', usage:'image-to-code — 上传图片后自动生成对应前端代码。' },
  { id:'ppt-master', name:'ppt-master', agent:'reasonix', scope:'global', path:'~/.reasonix/skills/ppt-master/SKILL.md', enabled:true, tags:['文档', '内容'],  version:'2.1.0', updated:'2025-03-05', desc:'AI 驱动的多格式 SVG 内容生成系统。支持 PDF/DOCX/URL/Markdown 转换。', icon:'📊', runAs:'inline', model:'deepseek-v4-flash', usage:'ppt-master — 输入源文档自动生成高质量 SVG 内容。' },
  { id:'format-code', name:'format-code', agent:'opencode', scope:'project', path:'D:/MyProject/.opencode/skills/format-code/SKILL.md', enabled:true, tags:['开发', '工具'],  version:'0.9.0', updated:'2025-01-20', desc:'代码格式化 — 支持多种语言的自动格式化。', icon:'✨', runAs:'inline', model:'deepseek-v4-flash', usage:'format-code — 选中代码块后触发格式化。' },
  { id:'lint-check', name:'lint-check', agent:'opencode', scope:'project', path:'D:/MyProject/.opencode/skills/lint-check/SKILL.md', enabled:false,tags:['开发', '工具'], version:'1.0.0', updated:'2025-02-05', desc:'Lint 检查 — 在编码过程中实时检测潜在问题。', icon:'🔍', runAs:'inline', model:'deepseek-v4-flash', usage:'lint-check — 自动检测当前文件的 lint 问题。' },
  { id:'commit-helper', name:'commit-helper', agent:'opencode', scope:'global', path:'~/.opencode/skills/commit-helper/SKILL.md', enabled:true, tags:['开发', '工具'],  version:'1.1.0', updated:'2025-02-12', desc:'提交信息生成 — 基于改动自动生成规范的 commit message。', icon:'💬', runAs:'inline', model:'deepseek-v4-flash', usage:'commit-helper — 自动读取 git diff 生成提交信息。' },
  { id:'doc-gen', name:'doc-gen', agent:'opencode', scope:'project', path:'D:/MyProject/.opencode/skills/doc-gen/SKILL.md', enabled:false,tags:['文档', '开发'], version:'0.8.0', updated:'2025-01-28', desc:'文档生成 — 根据代码自动生成文档注释和使用说明。', icon:'📝', runAs:'inline', model:'deepseek-v4-flash', usage:'doc-gen — 选中函数/类后生成对应文档。' },
]

export const agentPresets: Record<string, AgentPreset> = {
  reasonix: { name:'Reasonix Code', icon:'⚡', color:'#19c8b9', globalPath:'~/.reasonix/skills/', projectPath:'.reasonix/skills/', desc:'Reasonix 原生 AI 编码助手' },
  opencode: { name:'Opencode', icon:'🔧', color:'#6fba2c', globalPath:'~/.opencode/skills/', projectPath:'.opencode/skills/', desc:'开源 AI 编码代理' },
  claude:   { name:'Claude Code', icon:'🤖', color:'#8b6fc0', globalPath:'~/.claude/skills/', projectPath:'.claude/skills/', desc:'Anthropic 官方 AI 编码助手' },
  custom:   { name:'自定义 Agent', icon:'🔌', color:'#e59266', globalPath:'', projectPath:'', desc:'手动配置路径' },
}

export const initialAgents: Agent[] = [
  { id:'reasonix', preset:'reasonix', icon:'⚡', name:'Reasonix Code', globalPath:'~/.reasonix/skills/', projectPath:'.reasonix/skills/', skillCount:8, connected:true, color:'#19c8b9' },
  { id:'opencode', preset:'opencode', icon:'🔧', name:'Opencode', globalPath:'~/.opencode/skills/', projectPath:'.opencode/skills/', skillCount:4, connected:true, color:'#6fba2c' },
]
