interface HeaderProps {
  onScan: () => void
  scanning: boolean
}

export default function Header({ onScan, scanning }: HeaderProps) {
  return (
    <header className="header">
      <div className="logo">⚡</div>
      <h1>AI Skill Manager</h1>
      <span className="sub">v0.0.1</span>
      <div className="spacer" />
      <span className="badge"><span className="dot"></span> 已连接 · Reasonix</span>
    </header>
  )
}
