# AI Skill Manager

管理 AI Agent 的 Skill 文件——扫描本地目录，启用/停用，编辑元数据，多 Agent 自由切换。

## 功能

**Skill 管理**

| 操作 | 说明 |
|------|------|
| 🔍 扫描 | 读取 Agent 目录中的所有 `.md`，识别含 YAML 头 + `name` 字段的文件为 Skill |
| 🌐/📁 范围 | 根据路径自动标注全局 Skill 或项目 Skill |
| 🔛 启用/停用 | 停用 → 文件加 `.disabled` 后缀，Agent 不再加载；启用 → 恢复 |
| ✏️ 编辑 | 修改名称、描述、标签、版本，保存后直写 SKILL.md |
| 🗑️ 卸载 | 删除列表条目 + 本地 `.md` 文件 |

**多 Agent**

- 自由添加任意 Agent，只需指定名称 + Skill 目录路径
- 每个 Agent 独立管理，侧边栏切换
- 切换/删除 Agent 后自动保存

**其他**

- 🏷️ 标签筛选 + 关键词搜索
- 💾 自动持久化——关掉重开状态不丢
- 🎨 Animal Island UI 风格

## 快速开始

```bash
npm install
npm run dev          # 浏览器 → http://localhost:5173
npm run tauri dev    # 桌面窗口（需 Rust）
npm run tauri build  # 打包 exe
```

## 项目结构

```
skill-manager/
├── index.html           # 入口（CSS + JS 内联）
├── package.json
├── vite.config.js
├── src/
│   ├── styles.css
│   └── main.js
├── src-tauri/           # Tauri 桌面壳
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── src/
└── README.md
```

## 技术

Vite · Tauri 2.0 · Vanilla JS · Animal Island UI
