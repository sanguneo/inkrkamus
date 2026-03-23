import { PARTICLES } from '@/constants/app';
import { normalizeKrQuery } from '@/lib/dictionary-db';
import type { WordDetail, WordItem } from '@/types/app';

export function withBaseUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
}

export function emptyResult(isKrMode: boolean, krIndexText: string): WordDetail {
  return { rt: '', en: '', kr: isKrMode ? krIndexText : '' };
}

export function sortWordsByPriority(words: WordItem[], query: string): WordItem[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [...words].sort((a, b) => a.ID - b.ID);
  }

  const score = (value: string): number => {
    const lower = value.toLowerCase();
    if (lower === q) return 0;
    if (lower.startsWith(q)) return 1;
    if (lower.includes(` ${q}`)) return 2;
    if (lower.includes(q)) return 3;
    return 4;
  };

  return [...words].sort((a, b) => {
    const s1 = score(a.in);
    const s2 = score(b.in);
    if (s1 !== s2) return s1 - s2;
    return a.ID - b.ID;
  });
}

export function krQualityMatch(kr: string, query: string): boolean {
  const noParen = kr.replace(/\s*\(.*?\)\s*/g, ' ');
  const normalizedKr = normalizeKrQuery(noParen);
  const normalizedQuery = normalizeKrQuery(query);
  if (!normalizedQuery || !normalizedKr.includes(normalizedQuery)) {
    return false;
  }

  if (normalizedQuery.length <= 2) {
    for (const particle of PARTICLES) {
      if (normalizedKr.includes(`${normalizedQuery}${particle}`)) {
        return false;
      }
    }
  }

  return true;
}
