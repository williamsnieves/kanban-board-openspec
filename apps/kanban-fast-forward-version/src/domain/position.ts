export function normalizePositions<T extends { position: number }>(items: T[]): T[] {
  return [...items]
    .sort((a, b) => a.position - b.position)
    .map((item, index) => ({ ...item, position: index }));
}

export function insertAtPosition<T extends { position: number }>(
  items: T[],
  item: T,
  targetPosition: number,
): T[] {
  const sorted = [...items].sort((a, b) => a.position - b.position);
  const clamped = Math.max(0, Math.min(targetPosition, sorted.length));
  sorted.splice(clamped, 0, { ...item, position: clamped });
  return normalizePositions(sorted);
}
