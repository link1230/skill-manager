// ========== Data ==========
const skillsData = [
  { id:'explore', name:'explore', agent:'reasonix', scope:'global', path:'~/.reasonix/skills/explore/SKILL.md', enabled:true, tags:['开发', '调查'],  version:'1.2.0', updated:'2025-02-15', desc:'在隔离子 agent 中探索代码库 — 只读宽网调查，返回一个精炼结论。', icon:'🔍', runAs:'subagent', model:'deepseek-v4-flash', usage:'run_skill({ name: "explore", arguments: "..." }) 或调用 explore({ task: "..." }) 工具。支持链式调用。' },
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
  { id:'doc-gen', name:'doc-gen', agent:'opencode', scope:'project', path:'D:/MyProject/.opencode/skills/doc-gen/SKILL.md', enabled:false,tags:['文档', '开发'], version:'0.8.0', updated:'2025-01-28', desc:'文档生成 — 根据代码自动生成文档注释和使用说明。', icon:'📝', runAs:'inline', model:'deepseek-v4-flash', usage:'doc-gen — 选中函数/类后生成对应文档。' }
];

let currentAgent = 'all';
let currentTag = null;
let editing = false;
let currentSkillId = null;

// ========== Tag Helpers ==========
function getAllTags() {
  const tagSet = new Set();
  skillsData.forEach(s => s.tags.forEach(t => tagSet.add(t)));
  return [...tagSet].sort();
}

function renderTagBar() {
  const bar = document.getElementById('tagBar');
  const allTags = getAllTags();
  let filtered = skillsData;
  if (currentAgent !== 'all') filtered = filtered.filter(s => s.agent === currentAgent);
  const counts = {};
  filtered.forEach(s => s.tags.forEach(t => { counts[t] = (counts[t]||0)+1; }));

  let html = `<span class="tag-chip ${!currentTag?'active':''}" onclick="filterByTag(null)">🌿 全部</span>`;
  allTags.forEach(t => {
    const cnt = counts[t]||0;
    if (cnt === 0) return;
    html += `<span class="tag-chip ${currentTag===t?'active':''}" onclick="filterByTag('${t}')">${t} <span class="count">${cnt}</span></span>`;
  });
  bar.innerHTML = html;
}

function filterByTag(tag) {
  currentTag = tag;
  renderTagBar();
  renderGrid();
}

// ========== Render ==========
function renderGrid() {
  const grid = document.getElementById('skillGrid');
  const search = document.getElementById('searchInput').value.toLowerCase().trim();
  let list = skillsData;

  if (currentAgent !== 'all') list = list.filter(s => s.agent === currentAgent);
  if (currentTag) list = list.filter(s => s.tags && s.tags.includes(currentTag));
  if (search) list = list.filter(s => s.name.toLowerCase().includes(search) || s.desc.toLowerCase().includes(search));

  const total = skillsData.length;
  const enabled = skillsData.filter(s => s.enabled).length;
  document.getElementById('totalSkills').textContent = total;
  document.getElementById('enabledSkills').textContent = enabled;

  const sectionTitle = document.getElementById('sectionTitle');
  const agentNames = { all:'全部 Skills', reasonix:'Reasonix Skills', opencode:'Opencode Skills' };
  const tagSuffix = currentTag ? ` · #${currentTag}` : '';
  sectionTitle.textContent = (agentNames[currentAgent] || '全部 Skills') + tagSuffix;

  if (list.length === 0) {
    const scrollEl = document.querySelector('.grid-scroll');
    scrollEl.classList.add('empty');
    scrollEl.innerHTML = `<div class="empty-state"><div class="ico">🍃</div><h3>没有匹配的 skill</h3><p>试试不同的筛选条件或搜索词？</p></div>`;
    document.getElementById('visibleCount').textContent = '0 个模块';
    return;
  } else {
    document.querySelector('.grid-scroll')?.classList.remove('empty');
  }

  document.getElementById('visibleCount').textContent = `${list.length} 个模块`;
  grid.innerHTML = list.map(s => `
    <div class="card ${s.enabled?'':'disabled'}" onclick="openDetail('${s.id}')">
      <div class="badge-group">
        <span class="badge-agent ${s.agent==='reasonix'?'rx':'oc'}">${s.agent==='reasonix'?'⚡ RX':'🔧 OC'}</span>
        <span class="badge-scope ${s.scope}">${s.scope==='global'?'🌐 全局':'📁 项目'}</span>
      </div>
      <div class="icon-wrap">${s.icon}</div>
      <div class="name">${s.name}</div>
      <div class="desc">${s.desc}</div>
      <div class="card-tags">${(s.tags||[]).map(t => `<span class="card-tag" onclick="event.stopPropagation();filterByTag('${t}')" title="筛选: ${t}">${t}</span>`).join('')}</div>
      <div class="meta">
        <span class="ver">v${s.version}</span>
        <span>${s.updated}</span>
        <span>${s.runAs}</span>
      </div>
      <div class="bottom-row">
        <span style="font-size:11px;font-weight:600;color:var(--text-secondary)">${s.enabled?'🟢 启用':'⭕ 停用'}</span>
        <label class="toggle" onclick="event.stopPropagation()">
          <input type="checkbox" ${s.enabled?'checked':''} onchange="toggleSkill('${s.id}',this.checked)">
          <span class="track"></span><span class="handle"></span>
        </label>
      </div>
    </div>
  `).join('');
}

// ========== Toggle ==========
function toggleSkill(id, enabled) {
  const s = skillsData.find(x => x.id === id);
  if (!s) return;
  s.enabled = enabled;
  const label = enabled ? '已启用' : '已停用';
  showToast(`${enabled?'🟢':'⭕'} ${s.name} ${label}`, enabled?'success':'error');
  document.getElementById('lastSync').textContent = `上次同步: 刚刚 (${s.name} → ${label})`;
  renderGrid();
  if (currentSkillId === id) renderDetail(s);
}

// ========== Detail ==========
function openDetail(id) {
  const s = skillsData.find(x => x.id === id);
  if (!s) return;
  currentSkillId = id;
  editing = false;
  renderDetail(s);
  document.getElementById('detailOverlay').classList.add('open');
  document.getElementById('detailPanel').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDetail() {
  if (editing) { showToast('⚠️ 请先保存或取消编辑','error'); return; }
  document.getElementById('detailOverlay').classList.remove('open');
  document.getElementById('detailPanel').classList.remove('open');
  document.body.style.overflow = '';
  currentSkillId = null;
}

function renderDetail(s) {
  document.getElementById('detailName').textContent = s.name;
  document.getElementById('detailAgent').textContent = s.agent==='reasonix'?'⚡ Reasonix':'🔧 Opencode';

  const body = document.getElementById('detailBody');
  body.innerHTML = `
    <div class="meta-grid">
      <div class="meta-item">
        <div class="label">版本</div>
        <div class="value">v${s.version}</div>
      </div>
      <div class="meta-item">
        <div class="label">更新日期</div>
        <div class="value">${s.updated}</div>
      </div>
      <div class="meta-item">
        <div class="label">运行模式</div>
        <div class="value"><span class="tag ${s.runAs==='subagent'?'primary':''}">${s.runAs}</span></div>
      </div>
      <div class="meta-item">
        <div class="label">模型</div>
        <div class="value"><span class="tag">${s.model}</span></div>
      </div>
    </div>

    <div class="detail-section">
      <h3>📖 简介</h3>
      <p>${s.desc}</p>
    </div>

    <div class="detail-section">
      <h3>🏷️ 标签</h3>
      <div class="detail-tags">${(s.tags||[]).map(t => `<span class="detail-tag">${t}</span>`).join('')||'<span style="color:var(--text-muted);font-size:12px">暂无标签</span>'}</div>
    </div>

    <div class="detail-section">
      <h3>🔧 使用方法</h3>
      <div class="code-block">${s.usage}</div>
    </div>

    <div class="detail-section">
      <h3>📂 文件位置</h3>
      <div style="display:flex;gap:6px;margin-bottom:8px">
        <span class="detail-tag" style="background:${s.scope==='global'?'#e8e0f0':'#e0f0e8'};border-color:${s.scope==='global'?'#b79ee0':'#7ac8a8'};color:${s.scope==='global'?'#8b6fc0':'#3a8f6f'}">${s.scope==='global'?'🌐 全局 Skill':'📁 项目 Skill'}</span>
        <span class="detail-tag">${s.scope==='global'?'适用于所有项目':'仅限当前项目'}</span>
      </div>
      <p style="font-family:var(--mono);font-size:12px;color:var(--text-secondary);word-break:break-all">
        ${s.path}
      </p>
    </div>
  `;

  const actions = document.getElementById('detailActions');
  actions.innerHTML = `
    <label class="toggle" style="margin-right:auto">
      <input type="checkbox" ${s.enabled?'checked':''} onchange="toggleSkill('${s.id}',this.checked)">
      <span class="track"></span><span class="handle"></span>
    </label>
    <span style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-right:auto">${s.enabled?'🟢 已启用':'⭕ 已停用'}</span>
    <button class="btn btn-ghost" onclick="startEdit('${s.id}')">✏️ 编辑</button>
    <button class="btn btn-danger" onclick="uninstallSkill('${s.id}')">🗑️ 卸载</button>
  `;
}

// ========== Edit Mode ==========
function startEdit(id) {
  const s = skillsData.find(x => x.id === id);
  if (!s) return;
  editing = true;
  document.getElementById('detailName').textContent = '✏️ ' + s.name;

  const body = document.getElementById('detailBody');
  body.innerHTML = `
    <div class="edit-field">
      <label>名称 (Name)</label>
      <input type="text" id="editName" value="${s.name}">
    </div>
    <div class="edit-field">
      <label>简介 (Description)</label>
      <textarea id="editDesc" rows="3">${s.desc}</textarea>
    </div>
    <div class="edit-field">
      <label>🏷️ 标签 (回车添加)</label>
      <div class="tag-edit-area" id="tagEditArea">
        ${(s.tags||[]).map(t => `<span class="edit-tag" data-tag="${t}">${t}<span class="remove-tag" onclick="this.parentElement.remove()">×</span></span>`).join('')}
        <input class="tag-input" id="tagInput" placeholder="输入后回车..." onkeydown="addEditTag(event)">
      </div>
    </div>
    <div class="edit-field">
      <label>使用方法 (Usage)</label>
      <textarea id="editUsage" rows="6">${s.usage}</textarea>
    </div>
    <div class="edit-field">
      <label>版本</label>
      <input type="text" id="editVersion" value="${s.version}">
    </div>
    <p style="font-size:11px;color:var(--text-muted);margin-top:8px;font-weight:600">💡 修改保存后将同步到 agent 的 SKILL.md 文件</p>
  `;

  const actions = document.getElementById('detailActions');
  actions.innerHTML = `
    <button class="btn btn-ghost" onclick="cancelEdit('${s.id}')">取消</button>
    <div class="spacer"></div>
    <button class="btn btn-yellow" onclick="saveEdit('${s.id}')">💾 保存修改</button>
  `;
}

function cancelEdit(id) {
  editing = false;
  const s = skillsData.find(x => x.id === id);
  if (s) renderDetail(s);
}

// ========== Tag editing helpers ==========
function addEditTag(e) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  const input = document.getElementById('tagInput');
  const val = input.value.trim();
  if (!val) return;
  const area = document.getElementById('tagEditArea');
  if (area.querySelector(`.edit-tag[data-tag="${val}"]`)) { input.value = ''; return; }
  const chip = document.createElement('span');
  chip.className = 'edit-tag';
  chip.dataset.tag = val;
  chip.innerHTML = `${val}<span class="remove-tag" onclick="this.parentElement.remove()">×</span>`;
  area.insertBefore(chip, input.parentElement||input);
  input.value = '';
  input.focus();
}

function getEditTags() {
  const chips = document.querySelectorAll('#tagEditArea .edit-tag');
  return [...chips].map(c => c.dataset.tag);
}

function saveEdit(id) {
  const s = skillsData.find(x => x.id === id);
  if (!s) return;
  s.name = document.getElementById('editName').value.trim() || s.name;
  s.desc = document.getElementById('editDesc').value.trim() || s.desc;
  s.tags = getEditTags();
  s.usage = document.getElementById('editUsage').value.trim() || s.usage;
  s.version = document.getElementById('editVersion').value.trim() || s.version;
  s.updated = new Date().toISOString().slice(0,10);
  editing = false;
  showToast(`✅ ${s.name} 已更新并同步到 ${s.agent==='reasonix'?'Reasonix':'Opencode'}`, 'success');
  document.getElementById('lastSync').textContent = `上次同步: 刚刚 (${s.name} → 已编辑)`;
  renderTagBar();
  renderGrid();
  renderDetail(s);
}

// ========== Uninstall ==========
function uninstallSkill(id) {
  if (!confirm(`🗑️ 确定要卸载 "${skillsData.find(x=>x.id===id).name}" 吗？\n此操作将从 agent 中永久删除该 skill。`)) return;
  const idx = skillsData.findIndex(x => x.id === id);
  if (idx === -1) return;
  const s = skillsData[idx];
  skillsData.splice(idx, 1);
  showToast(`🗑️ ${s.name} 已卸载，已从 ${s.agent==='reasonix'?'Reasonix':'Opencode'} 中删除`, 'error');
  document.getElementById('lastSync').textContent = `上次同步: 刚刚 (${s.name} → 已删除)`;
  closeDetail();
  renderTagBar();
  renderGrid();
  updateCounts();
}

// ========== Filter ==========
function renderSidebarAgents() {
  const container = document.getElementById('agentNavList');
  let html = '';
  agentsData.forEach(a => {
    const active = currentAgent === a.id ? 'active' : '';
    const count = skillsData.filter(s => s.agent === a.id).length;
    html += `<div class="nav-item ${active}" data-agent="${a.id}" onclick="switchAgent(this,'${a.id}')">
      <span class="ico">${a.icon}</span> ${a.name} <span class="count">${count}</span>
    </div>`;
  });
  container.innerHTML = html;
}

function switchAgent(el, agent) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  currentAgent = agent;
  currentTag = null;
  renderTagBar();
  renderGrid();
}

function filterSkills() {
  renderGrid();
}

// ========== Toast ==========
function showToast(msg, type='info') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2500);
}

// ========== Scan / Discovery ==========
function scanSkills() {
  const btn = document.getElementById('scanBtn');
  const info = document.getElementById('discoveryInfo');
  btn.innerHTML = '<span class="spin">🔍</span> 扫描中...';
  btn.classList.add('scanning');
  info.innerHTML = '<span class="dot stale"></span> 正在发现...';

  // Simulate scanning agent directories
  setTimeout(() => {
    // Simulate discovering a new skill
    const newSkill = { id:'web-scraper', name:'web-scraper', agent:'reasonix', scope:'project', path:'D:/MyProject/.reasonix/skills/web-scraper/SKILL.md', enabled:true, tags:['开发', '工具'], version:'0.1.0', updated:new Date().toISOString().slice(0,10), desc:'网页内容抓取工具 — 自动提取页面结构化数据。', icon:'🕸️', runAs:'inline', model:'deepseek-v4-flash', usage:'web-scraper({ url: "https://..." }) — 抓取并返回结构化内容。' };
    if (!skillsData.find(s => s.id === 'web-scraper')) {
      skillsData.push(newSkill);
    }

    btn.innerHTML = '🔍 扫描发现';
    btn.classList.remove('scanning');
    info.innerHTML = '<span class="dot live"></span> 实时监听中';
    document.getElementById('lastSync').textContent = `上次扫描: ${new Date().toLocaleTimeString()}`;

    renderSidebarAgents();
    renderTagBar();
    renderGrid();
    updateCounts();
    showToast('🔍 扫描完成！发现 ' + skillsData.length + ' 个 skill（新增 1 个）', 'success');
  }, 1500);
}

// ========== Agent Registry ==========
const agentPresets = {
  reasonix: { name:'Reasonix Code', icon:'⚡', color:'#19c8b9', globalPath:'~/.reasonix/skills/', projectPath:'.reasonix/skills/', desc:'Reasonix 原生 AI 编码助手' },
  opencode: { name:'Opencode', icon:'🔧', color:'#6fba2c', globalPath:'~/.opencode/skills/', projectPath:'.opencode/skills/', desc:'开源 AI 编码代理' },
  claude:   { name:'Claude Code', icon:'🤖', color:'#8b6fc0', globalPath:'~/.claude/skills/', projectPath:'.claude/skills/', desc:'Anthropic 官方 AI 编码助手' },
  custom:   { name:'自定义 Agent', icon:'🔌', color:'#e59266', globalPath:'', projectPath:'', desc:'手动配置路径' }
};

let agentsData = [
  { id:'reasonix', preset:'reasonix', icon:'⚡', name:'Reasonix Code', globalPath:'~/.reasonix/skills/', projectPath:'.reasonix/skills/', skillCount:8, connected:true, color:'#19c8b9' },
  { id:'opencode', preset:'opencode', icon:'🔧', name:'Opencode', globalPath:'~/.opencode/skills/', projectPath:'.opencode/skills/', skillCount:4, connected:true, color:'#6fba2c' }
];

function openAgentManager() {
  const overlay = document.getElementById('agentOverlay');
  overlay.classList.add('open');
  renderAgentManager();
}

function closeAgentManager() {
  document.getElementById('agentOverlay').classList.remove('open');
}

function renderAgentManager() {
  const body = document.getElementById('agentModalBody');

  // Connected agents list
  let agentsHtml = '<div class="agent-section"><h3>📋 已连接的 Agent</h3>';
  if (agentsData.length === 0) {
    agentsHtml += '<div class="no-agents"><div class="ico">🔌</div><p>尚未连接任何 Agent，请添加</p></div>';
  } else {
    agentsData.forEach(a => {
      agentsHtml += `
        <div class="agent-card">
          <div class="aicon" style="background:${a.color}18;border-color:${a.color}">${a.icon}</div>
          <div class="ainfo">
            <div class="aname">${a.name}</div>
            <div class="apath">${a.globalPath}</div>
          </div>
          <div class="askill-count"><span>${a.skillCount}</span> skills</div>
          <span class="astatus ${a.connected?'online':'offline'}">${a.connected?'🟢 已连接':'⭕ 未连接'}</span>
        </div>`;
    });
  }
  agentsHtml += '</div>';

  // Add agent form
  agentsHtml += `
    <div class="agent-section">
      <h3>➕ 添加新 Agent</h3>
      <div class="add-agent-form">
        <div class="form-row">
          <div class="form-group" style="flex:0.6">
            <label>Agent 类型</label>
            <select id="agentPresetSelect" onchange="onAgentPresetChange()">
              <option value="claude">🤖 Claude Code</option>
              <option value="reasonix">⚡ Reasonix Code</option>
              <option value="opencode">🔧 Opencode</option>
              <option value="custom">🔌 自定义</option>
            </select>
          </div>
          <div class="form-group">
            <label>显示名称</label>
            <input type="text" id="agentNameInput" value="Claude Code" placeholder="例: Claude Code">
          </div>
          <div class="form-group" style="flex:0.4">
            <label>图标</label>
            <input type="text" id="agentIconInput" value="🤖" placeholder="Emoji">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>全局 Skill 路径</label>
            <input type="text" id="agentGlobalPath" value="~/.claude/skills/" placeholder="~/.agent/skills/">
            <div class="hint">此路径下的 skill 对所有项目可用</div>
          </div>
          <div class="form-group">
            <label>项目 Skill 路径</label>
            <input type="text" id="agentProjectPath" value=".claude/skills/" placeholder=".agent/skills/">
            <div class="hint">项目目录下的相对路径</div>
          </div>
        </div>
        <div style="text-align:right">
          <button class="btn-add-agent" onclick="addNewAgent()">➕ 添加并扫描</button>
        </div>
      </div>
    </div>

    <div class="agent-section" style="margin-bottom:0">
      <h3>💡 工作原理</h3>
      <div style="background:var(--bg);border:2px solid #e8e2d6;border-radius:var(--radius-card);padding:14px 18px;font-size:12px;line-height:1.8;color:var(--text-secondary)">
        <p><strong style="color:var(--text-primary)">添加 Agent</strong> → 配置 skill 目录 → 扫描发现已有 skill → 管理端自动识别 <strong>全局</strong> 或 <strong>项目</strong> 范围</p>
        <p><strong style="color:var(--text-primary)">操作同步</strong> → 在管理端启用/禁用/编辑/删除 skill 后，自动写入对应 Agent 的文件目录</p>
        <p><strong style="color:var(--text-primary)">双向监听</strong> → Agent 端新增/修改 skill 后，管理端实时检测并更新列表</p>
      </div>
    </div>`;

  body.innerHTML = agentsHtml;
}

function onAgentPresetChange() {
  const sel = document.getElementById('agentPresetSelect');
  const preset = agentPresets[sel.value];
  document.getElementById('agentNameInput').value = preset.name;
  document.getElementById('agentIconInput').value = preset.icon;
  document.getElementById('agentGlobalPath').value = preset.globalPath;
  document.getElementById('agentProjectPath').value = preset.projectPath;
}

function addNewAgent() {
  const name = document.getElementById('agentNameInput').value.trim();
  const icon = document.getElementById('agentIconInput').value.trim() || '🔌';
  const globalPath = document.getElementById('agentGlobalPath').value.trim();
  const projectPath = document.getElementById('agentProjectPath').value.trim();
  const sel = document.getElementById('agentPresetSelect').value;

  if (!name || !globalPath) { showToast('⚠️ 请填写 Agent 名称和全局路径', 'error'); return; }
  if (agentsData.find(a => a.name === name)) { showToast('⚠️ 该 Agent 已存在', 'error'); return; }

  const id = name.toLowerCase().replace(/[^a-z0-9]/g,'-');
  const color = agentPresets[sel]?.color || '#e59266';

  agentsData.push({ id, preset:sel, icon, name, globalPath, projectPath, skillCount:0, connected:true, color });

  // Simulate discovering skills for the new agent
  setTimeout(() => {
    const agent = agentsData.find(a => a.id === id);
    if (!agent) return;
    agent.skillCount = Math.floor(Math.random() * 4) + 1;

    // Add a mock skill for the new agent
    const newSkills = {
      claude: [
        { id:'claude-'+(skillsData.length+1), name:'claude-review', agent:id, scope:'global', path:globalPath+'claude-review/SKILL.md', enabled:true, tags:['开发', '审查'], version:'0.1.0', updated:new Date().toISOString().slice(0,10), desc:'Claude Code 代码审查 skill — AI 驱动的代码质量检查。', icon:'👁️', runAs:'inline', model:'claude-sonnet-4', usage:'claude-review — 自动审查当前分支变更。' },
        { id:'claude-'+(skillsData.length+2), name:'claude-doc', agent:id, scope:'project', path:'D:/MyProject/'+projectPath+'claude-doc/SKILL.md', enabled:true, tags:['文档'], version:'0.1.0', updated:new Date().toISOString().slice(0,10), desc:'自动生成项目文档和代码注释。', icon:'📝', runAs:'inline', model:'claude-sonnet-4', usage:'claude-doc — 选中代码生成文档。' }
      ]
    };
    const toAdd = newSkills[sel] || [];
    toAdd.forEach(s => { if (!skillsData.find(x => x.id === s.id)) skillsData.push(s); });

    renderAgentManager();
    renderTagBar();
    renderGrid();
    updateCounts();
    showToast(`✅ ${name} 已连接！发现 ${toAdd.length} 个 skill`, 'success');
  }, 800);

  renderSidebarAgents();
  renderAgentManager();
  renderGrid();
  updateCounts();
  showToast(`🔌 ${name} 添加成功，正在扫描...`, 'info');
}

// ========== Counts ==========
function updateCounts() {
  document.getElementById('countAll').textContent = skillsData.length;
  document.getElementById('countRx').textContent = skillsData.filter(s => s.agent === 'reasonix').length;
  document.getElementById('countOc').textContent = skillsData.filter(s => s.agent === 'opencode').length;
  document.getElementById('globalCount').textContent = skillsData.filter(s => s.scope === 'global').length;
  document.getElementById('projectCount').textContent = skillsData.filter(s => s.scope === 'project').length;
  document.getElementById('agentCount').textContent = agentsData.length;
}

// ========== Expose to window (for inline onclick handlers) ==========
Object.assign(window, {
  filterSkills,
  switchAgent,
  toggleSkill,
  openDetail,
  closeDetail,
  startEdit,
  cancelEdit,
  saveEdit,
  uninstallSkill,
  filterByTag,
  addEditTag,
  getEditTags,
  openAgentManager,
  closeAgentManager,
  onAgentPresetChange,
  addNewAgent,
  scanSkills,
  showToast
});

// ========== Init ==========
renderSidebarAgents();
renderTagBar();
renderGrid();
updateCounts();