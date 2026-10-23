export function matchesIgnoringCase(value: string, expected?: string): boolean {
  if (expected === undefined) {
    return true;
  }

  return value.localeCompare(expected.trim(), 'pt-BR', { sensitivity: 'base' }) === 0;
}
