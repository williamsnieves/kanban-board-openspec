import type { Column } from '@/features/board/types'

const DEFAULTS = [
  { key: 'todo', label: 'Todo' },
  { key: 'doing', label: 'Doing' },
  { key: 'done', label: 'Done' },
] as const

export function normalizeColumns(columns: Column[]): Column[] {
  // Build canonical default buckets (first-seen wins for duplicates)
  const defaultBuckets = new Map<string, Column>()
  const extras: Column[] = []

  for (const col of columns) {
    const key = col.name.toLowerCase()
    const matched = DEFAULTS.find(d => d.key === key)
    if (matched && !defaultBuckets.has(matched.key)) {
      // Normalize label to canonical
      defaultBuckets.set(matched.key, { ...col, name: matched.label })
    } else if (!matched) {
      extras.push(col)
    }
    // Duplicates of defaults are silently dropped
  }

  // Fill missing defaults with empty task lists
  const result: Column[] = []
  for (const d of DEFAULTS) {
    result.push(defaultBuckets.get(d.key) ?? { id: d.key, name: d.label, tasks: [] })
  }
  return [...result, ...extras]
}
