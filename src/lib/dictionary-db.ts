import Dexie from 'dexie';
import type { Table } from 'dexie';

export type DictionaryEntry = {
  id: number;
  inWord: string;
  inNorm: string;
  inPrefixes: string[];
  rt: string;
  en: string;
  kr: string;
  enTokens: string[];
  rtTokens: string[];
  krGrams: string[];
};

type MetaRecord = {
  key: string;
  value: string;
};

export type DictionaryPayload = {
  version: number;
  entries: DictionaryEntry[];
  h2r: Record<string, string>;
};

export type DictionaryManifest = {
  version: number;
};

export class DictionaryDb extends Dexie {
  entries!: Table<DictionaryEntry, number>;
  meta!: Table<MetaRecord, string>;

  constructor() {
    super('inkrkamus-db');
    this.version(1).stores({
      entries: 'id,inWord,*enTokens,*rtTokens,*krGrams',
      meta: 'key',
    });
    this.version(2).stores({
      entries: 'id,inWord,inNorm,*inPrefixes,*enTokens,*rtTokens,*krGrams',
      meta: 'key',
    });
  }
}

export function normalizeToken(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeKr(value: string): string {
  return value.replace(/\s+/g, '').toLowerCase();
}

function toBigrams(value: string): string[] {
  const normalized = normalizeKr(value);
  if (!normalized) {
    return [];
  }
  if (normalized.length === 1) {
    return [normalized];
  }

  const grams = new Set<string>();
  for (let i = 0; i < normalized.length - 1; i += 1) {
    grams.add(normalized.slice(i, i + 2));
  }
  return Array.from(grams);
}

function toPrefixes(value: string, limit = 24): string[] {
  const normalized = normalizeToken(value);
  if (!normalized) {
    return [];
  }

  const out = new Set<string>();
  const max = Math.min(normalized.length, limit);
  for (let i = 1; i <= max; i += 1) {
    out.add(normalized.slice(0, i));
  }
  return Array.from(out);
}

function withBaseUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
}

async function parseCompressedJson(response: Response, format: 'gzip'): Promise<DictionaryPayload> {
  if (!response.body) {
    throw new Error('압축 데이터 스트림이 비어 있습니다.');
  }

  const decompression = new DecompressionStream(format);
  const stream = response.body.pipeThrough(decompression);
  return (await new Response(stream).json()) as DictionaryPayload;
}

export async function fetchDictionaryPayload(): Promise<DictionaryPayload> {
  const canDecompress = typeof DecompressionStream !== 'undefined';
  if (canDecompress) {
    const compressedTargets: Array<{ path: string; format: 'gzip' }> = [
      { path: withBaseUrl('data/dictionary.json.gz'), format: 'gzip' },
    ];

    for (const target of compressedTargets) {
      try {
        const compressedResponse = await fetch(target.path, { cache: 'force-cache' });
        if (!compressedResponse.ok) {
          continue;
        }
        return await parseCompressedJson(compressedResponse, target.format);
      } catch {
        // Ignore and continue fallback chain.
      }
    }
  }

  const response = await fetch(withBaseUrl('data/dictionary.json'), { cache: 'force-cache' });
  if (!response.ok) {
    throw new Error('사전 JSON 파일을 불러오지 못했습니다.');
  }

  return (await response.json()) as DictionaryPayload;
}

export async function fetchDictionaryManifest(): Promise<DictionaryManifest | null> {
  const response = await fetch(withBaseUrl('data/manifest.json'), { cache: 'no-cache' });
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as DictionaryManifest;
}

function sanitizeEntry(entry: DictionaryEntry): DictionaryEntry {
  return {
    id: entry.id,
    inWord: entry.inWord || '',
    inNorm: entry.inNorm || normalizeToken(entry.inWord || ''),
    inPrefixes: entry.inPrefixes || toPrefixes(entry.inWord || ''),
    rt: entry.rt || '',
    en: entry.en || '',
    kr: entry.kr || '',
    enTokens: entry.enTokens || [],
    rtTokens: entry.rtTokens || [],
    krGrams: entry.krGrams || toBigrams(entry.kr || ''),
  };
}

export async function ensureDictionaryData(
  db: DictionaryDb,
  payload?: DictionaryPayload,
): Promise<{ h2r: Record<string, string> }> {
  const count = await db.entries.count();
  const versionRaw = await db.meta.get('version');
  const currentVersion = versionRaw?.value ? Number(versionRaw.value) : 0;

  if (!payload && count > 0) {
    const h2rRaw = await db.meta.get('h2r');
    return { h2r: h2rRaw ? (JSON.parse(h2rRaw.value) as Record<string, string>) : {} };
  }

  const nextPayload = payload ?? (await fetchDictionaryPayload());
  if (count > 0 && currentVersion === Number(nextPayload.version || 1)) {
    const h2rRaw = await db.meta.get('h2r');
    return { h2r: h2rRaw ? (JSON.parse(h2rRaw.value) as Record<string, string>) : nextPayload.h2r || {} };
  }

  const batchSize = 1000;
  await db.transaction('rw', db.entries, db.meta, async () => {
    await db.entries.clear();
    for (let i = 0; i < nextPayload.entries.length; i += batchSize) {
      const slice = nextPayload.entries.slice(i, i + batchSize).map(sanitizeEntry);
      await db.entries.bulkPut(slice);
    }

    await db.meta.put({ key: 'version', value: String(nextPayload.version || 1) });
    await db.meta.put({ key: 'h2r', value: JSON.stringify(nextPayload.h2r || {}) });
  });

  return { h2r: nextPayload.h2r || {} };
}

export function normalizeKrQuery(value: string): string {
  return value.replace(/\s+/g, '').toLowerCase();
}

export function toQueryBigrams(value: string): string[] {
  return toBigrams(value);
}
