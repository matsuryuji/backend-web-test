function normalizeForSearch(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().toLowerCase();
}

export function matchesIgnoringCase(value: string, expected?: string): boolean {
  if (expected === undefined) {
    return true;
  }

  return normalizeForSearch(value) === normalizeForSearch(expected);
}

export function containsIgnoringCase(value: string, term?: string): boolean {
  if (term === undefined) {
    return true;
  }

  return normalizeForSearch(value).includes(normalizeForSearch(term));
}
