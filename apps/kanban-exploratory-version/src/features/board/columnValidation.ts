export const PROTECTED_COLUMN_NAMES = ['Todo', 'Doing', 'Done'] as const;

export function validateColumnName(
  name: string,
  existingNames: string[],
  excludeName?: string
): string | null {
  if (!name.trim()) return 'Column name is required';
  const lower = name.trim().toLowerCase();
  const compareTo = excludeName
    ? existingNames.filter((n) => n.toLowerCase() !== excludeName.toLowerCase())
    : existingNames;
  if (compareTo.some((n) => n.toLowerCase() === lower)) return 'Column name already exists';
  return null;
}
