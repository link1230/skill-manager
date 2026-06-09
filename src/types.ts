export interface Skill {
  id: string
  name: string
  agent: string
  scope: 'global' | 'project'
  path: string
  enabled: boolean
  tags: string[]
  version: string
  updated: string
  desc: string
  icon: string
  runAs: string
  model: string
  usage: string
}

export interface AgentPreset {
  name: string
  icon: string
  color: string
  globalPath: string
  projectPath: string
  desc: string
}

export interface Agent {
  id: string
  preset: string
  icon: string
  name: string
  globalPath: string
  projectPath: string
  skillCount: number
  connected: boolean
  color: string
}
