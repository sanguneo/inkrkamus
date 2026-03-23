import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  DictionaryDb,
  type DictionaryEntry,
  fetchDictionaryManifest,
  fetchDictionaryPayload,
  normalizeKrQuery,
  normalizeToken,
  toQueryBigrams,
} from '@/lib/dictionary-db';
import { DONATE_URL, BLOG_URL, LIST_OVERSCAN, MOBILE_BREAKPOINT, NEW_VOCA_URL, ROW_HEIGHT, SEARCH_DEBOUNCE_MS } from '@/constants/app';
import { LANGUAGE_SET, getInitialLanguage } from '@/constants/language';
import { emptyResult, krQualityMatch, sortWordsByPriority, withBaseUrl } from '@/lib/search-utils';
import { trackEvent } from '@/lib/analytics';
import { SearchForm } from '@/components/SearchForm';
import { WordListPane } from '@/components/WordListPane';
import { DetailPane } from '@/components/DetailPane';
import { InfoModal } from '@/components/modals/InfoModal';
import { NewWordDialog } from '@/components/modals/NewWordDialog';
import { LanguageSelectModal } from '@/components/modals/LanguageSelectModal';
import { LoadingOverlay } from '@/components/modals/LoadingOverlay';
import type { LanguageKey, NewWordDraft, SearchOptions, SearchType, SearchTypeOption, WordDetail, WordItem } from '@/types/app';

const db = new DictionaryDb();

export default function App() {
  const [languageKey, setLanguageKey] = useState<LanguageKey>(getInitialLanguage);
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('IndexedDB를 준비하는 중...');
  const [searchType, setSearchType] = useState<SearchType>('in');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');
  const [records, setRecords] = useState<DictionaryEntry[]>([]);
  const [indexReady, setIndexReady] = useState(false);
  const [allWords, setAllWords] = useState<WordItem[]>([]);
  const [wordList, setWordList] = useState<WordItem[]>([]);
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);
  const [result, setResult] = useState<WordDetail>(emptyResult(false, LANGUAGE_SET[languageKey].krIndex));
  const [h2r, setH2r] = useState<Record<string, string>>({});
  const [errorText, setErrorText] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);
  const [newWordOpen, setNewWordOpen] = useState(false);
  const [newWordDraft, setNewWordDraft] = useState<NewWordDraft>({ inWord: '', rt: '', en: '', kr: '' });
  const [listScrollTop, setListScrollTop] = useState(0);
  const [listViewportHeight, setListViewportHeight] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(() => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  const listRef = useRef<HTMLDivElement | null>(null);
  const autoSearchRef = useRef('');

  // Query cache by search type. This avoids repeating heavy filter/index calls while typing.
  const cacheRef = useRef<Record<SearchType, Map<string, WordItem[]>>>({
    in: new Map<string, WordItem[]>(),
    kr: new Map<string, WordItem[]>(),
    en: new Map<string, WordItem[]>(),
    rt: new Map<string, WordItem[]>(),
  });

  const t = LANGUAGE_SET[languageKey];

  const searchTypes: SearchTypeOption[] = useMemo(
    () => [
      { label: t.indonesian, value: 'in' },
      { label: t.korean, value: 'kr' },
      { label: t.english, value: 'en' },
      { label: t.root, value: 'rt' },
    ],
    [t],
  );

  const recordById = useMemo(() => {
    const map = new Map<number, DictionaryEntry>();
    records.forEach((record) => map.set(record.id, record));
    return map;
  }, [records]);

  // Virtual range limits actual DOM rows while preserving full scroll height.
  const virtualRange = useMemo(() => {
    const total = wordList.length;
    if (total === 0 || listViewportHeight <= 0) {
      return { start: 0, end: Math.min(total, 80), topPadding: 0, bottomPadding: 0 };
    }

    const visibleRows = Math.ceil(listViewportHeight / ROW_HEIGHT) + LIST_OVERSCAN * 2;
    const start = Math.max(0, Math.floor(listScrollTop / ROW_HEIGHT) - LIST_OVERSCAN);
    const end = Math.min(total, start + visibleRows);
    return {
      start,
      end,
      topPadding: start * ROW_HEIGHT,
      bottomPadding: Math.max(0, (total - end) * ROW_HEIGHT),
    };
  }, [wordList.length, listViewportHeight, listScrollTop]);

  const visibleWords = useMemo(
    () => wordList.slice(virtualRange.start, virtualRange.end),
    [wordList, virtualRange.start, virtualRange.end],
  );

  const resetListScroll = () => {
    setListScrollTop(0);
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    window.localStorage.setItem('languageKey', languageKey);
  }, [languageKey]);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
      if (!event.matches) {
        setMobileView('list');
      }
    };

    setIsMobile(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (searchType === 'kr') {
      setResult(emptyResult(true, t.krIndex));
    }
  }, [searchType, t.krIndex]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedInput(searchInput), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }

    const measure = () => setListViewportHeight(list.clientHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let worker: Worker | null = null;

    const applyEntries = (entries: DictionaryEntry[], nextH2r: Record<string, string>) => {
      const words = entries.map((entry) => ({ ID: entry.id, in: entry.inWord }));
      setRecords(entries);
      setAllWords(words);
      setWordList(words);
      setH2r(nextH2r);
    };

    const startIndexBuild = (payload: { entries: DictionaryEntry[]; h2r: Record<string, string> }) => {
      setLoadingText('IndexedDB를 백그라운드에서 생성 중...');
      worker = new Worker(new URL('./workers/dictionary-index.worker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = (event: MessageEvent<{ type: string; h2r?: Record<string, string>; message?: string }>) => {
        if (cancelled) {
          return;
        }
        if (event.data.type === 'index-ready') {
          setIndexReady(true);
          if (event.data.h2r) {
            setH2r(event.data.h2r);
          }
        }
        if (event.data.type === 'index-error') {
          setErrorText(event.data.message || 'IndexedDB 생성 실패');
        }
      };
      worker.postMessage({ type: 'build-index', payload });
    };

    // Fast path: boot from local IndexedDB first, then check manifest and refresh only when needed.
    (async () => {
      try {
        setLoading(true);
        setLoadingText('로컬 사전 불러오는 중...');

        const [count, versionRaw, h2rRaw] = await Promise.all([db.entries.count(), db.meta.get('version'), db.meta.get('h2r')]);
        const localVersion = versionRaw?.value ? Number(versionRaw.value) : 0;
        const localH2r = h2rRaw?.value ? (JSON.parse(h2rRaw.value) as Record<string, string>) : {};

        if (count > 0) {
          const localEntries = (await db.entries.orderBy('id').toArray()) as DictionaryEntry[];
          if (!cancelled) {
            applyEntries(localEntries, localH2r);
            setIndexReady(true);
            setLoading(false);
          }
        }

        setLoadingText('최신 데이터 확인 중...');
        const manifest = await fetchDictionaryManifest();
        const needsRefresh = count === 0 || (manifest !== null && manifest.version > localVersion);
        if (!needsRefresh) {
          return;
        }

        if (count === 0) {
          setLoading(true);
          setLoadingText('Loading dictionary...');
        }

        const payload = await fetchDictionaryPayload();
        if (cancelled) {
          return;
        }
        applyEntries(payload.entries, payload.h2r || {});
        setLoading(false);
        startIndexBuild(payload);
      } catch (error) {
        setErrorText(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      worker?.terminate();
    };
  }, []);

  useEffect(() => {
    cacheRef.current.in.clear();
    cacheRef.current.kr.clear();
    cacheRef.current.en.clear();
    cacheRef.current.rt.clear();
  }, [records, allWords]);

  const loadWordDetailById = async (id: number) => {
    const local = recordById.get(id);
    if (local) {
      setSelectedWordId(id);
      setResult({ ID: local.id, rt: local.rt || '', en: local.en || '', kr: local.kr || '' });
      if (isMobile) setMobileView('detail');
      return;
    }

    const hit = indexReady ? await db.entries.get(id) : undefined;
    if (!hit) {
      return;
    }

    setSelectedWordId(id);
    setResult({ ID: hit.id, rt: hit.rt || '', en: hit.en || '', kr: hit.kr || '' });
    if (isMobile) setMobileView('detail');
  };

  const getBestCachedPrefix = (query: string): WordItem[] | null => {
    const map = cacheRef.current.in;
    for (let length = query.length; length > 0; length -= 1) {
      const hit = map.get(query.slice(0, length));
      if (hit) {
        return hit;
      }
    }
    return null;
  };

  const searchByInWord = async (query: string, options: SearchOptions) => {
    const normalized = normalizeToken(query);
    if (!normalized) {
      return;
    }

    const map = cacheRef.current.in;
    const cached = map.get(normalized);
    if (cached) {
      setWordList(cached);
      resetListScroll();
      if (cached.length > 0 && !isMobile) {
        await loadWordDetailById(cached[0].ID);
      } else if (cached.length === 0 && !options.silent) {
        alert(t.nodata);
      }
      return;
    }

    const base = getBestCachedPrefix(normalized) || allWords;
    const containsMatches = base.filter((word) => normalizeToken(word.in).includes(normalized));
    const merged = new Map<number, WordItem>();
    containsMatches.forEach((item) => merged.set(item.ID, item));

    if (indexReady) {
      const prefixHits = (await db.entries.where('inPrefixes').equals(normalized).toArray()) as DictionaryEntry[];
      prefixHits.forEach((entry) => merged.set(entry.id, { ID: entry.id, in: entry.inWord }));
    }

    const sorted = sortWordsByPriority(Array.from(merged.values()), query);
    map.set(normalized, sorted);

    setWordList(sorted);
    resetListScroll();

    const exact = sorted.find((word) => normalizeToken(word.in) === normalized);
    if (exact && !isMobile) {
      await loadWordDetailById(exact.ID);
      return;
    }
    if (sorted.length > 0 && !isMobile) {
      await loadWordDetailById(sorted[0].ID);
    } else if (sorted.length === 0 && !options.silent) {
      alert(t.nodata);
    }
  };

  const searchByToken = async (field: 'enTokens' | 'rtTokens', query: string, options: SearchOptions) => {
    const token = normalizeToken(query);
    if (!token) {
      return;
    }

    const key = `${field}:${token}`;
    const map = field === 'enTokens' ? cacheRef.current.en : cacheRef.current.rt;
    const cached = map.get(key);
    if (cached) {
      setWordList(cached);
      resetListScroll();
      if (cached.length === 0 && !options.silent) {
        alert(t.nodata);
      }
      return;
    }

    const hits = indexReady
      ? ((await db.entries.where(field).equals(token).toArray()) as DictionaryEntry[])
      : records.filter((entry) => (field === 'enTokens' ? entry.enTokens : entry.rtTokens).includes(token));

    const dedup = new Map<number, WordItem>();
    hits.forEach((entry) => dedup.set(entry.id, { ID: entry.id, in: entry.inWord }));

    const words = sortWordsByPriority(Array.from(dedup.values()), query);
    map.set(key, words);

    setWordList(words);
    resetListScroll();

    if (words.length === 0 && !options.silent) {
      alert(t.nodata);
    }
  };

  const searchByKr = async (query: string, options: SearchOptions) => {
    const normalized = normalizeKrQuery(query);
    if (!normalized) {
      return;
    }

    const map = cacheRef.current.kr;
    const cached = map.get(normalized);
    if (cached) {
      setWordList(cached);
      resetListScroll();
      if (cached.length === 0 && !options.silent) {
        alert(t.nodata);
      }
      return;
    }

    let candidates: DictionaryEntry[];
    if (!indexReady) {
      candidates = records;
    } else if (normalized.length < 2) {
      candidates = (await db.entries.toArray()) as DictionaryEntry[];
    } else {
      const firstGram = toQueryBigrams(normalized)[0];
      candidates = firstGram ? ((await db.entries.where('krGrams').equals(firstGram).toArray()) as DictionaryEntry[]) : [];
    }

    const filtered = candidates
      .filter((entry) => krQualityMatch(entry.kr, query))
      .map((entry) => ({ ID: entry.id, in: entry.inWord }));

    const sorted = sortWordsByPriority(filtered, query);
    map.set(normalized, sorted);

    setWordList(sorted);
    resetListScroll();

    if (sorted.length === 0 && !options.silent) {
      alert(t.nodata);
    }
  };

  const performSearch = async (rawQuery: string, type: SearchType, options: SearchOptions = {}) => {
    const trimmed = rawQuery.trim();
    if (!trimmed) {
      setWordList(allWords);
      setSelectedWordId(null);
      setResult(emptyResult(type === 'kr', t.krIndex));
      resetListScroll();
      if (isMobile) setMobileView('list');
      return;
    }

    setSelectedWordId(null);
    setResult(emptyResult(type === 'kr', t.krIndex));
    if (isMobile) setMobileView('list');

    if (type === 'in') return searchByInWord(trimmed, options);
    if (type === 'kr') return searchByKr(trimmed, options);
    return searchByToken(type === 'en' ? 'enTokens' : 'rtTokens', trimmed, options);
  };

  useEffect(() => {
    if (allWords.length === 0) {
      return;
    }

    const query = debouncedInput.trim();
    if (!query) {
      autoSearchRef.current = '';
      void performSearch('', searchType, { silent: true, updateHistory: false });
      return;
    }

    const key = `${searchType}:${query}`;
    if (autoSearchRef.current === key) {
      return;
    }

    autoSearchRef.current = key;
    void performSearch(query, searchType, { silent: true, updateHistory: false });
  }, [debouncedInput, searchType, allWords.length]);

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    const query = searchInput.trim();
    trackEvent('search_submit', {
      search_type: searchType,
      query_length: query.length,
    });
    autoSearchRef.current = `${searchType}:${query}`;
    await performSearch(query, searchType, { silent: false, updateHistory: true });
  };

  const handleRomanizeToggle = () => {
    trackEvent('romanize_toggle');
    setResult((previous) => {
      if (!previous.kr) return previous;
      if (previous.temporary) return { ...previous, kr: previous.temporary, temporary: undefined };

      let romanized = '';
      for (let index = 0; index < previous.kr.length; index += 1) {
        const char = previous.kr[index];
        romanized += h2r[char] || char;
      }
      return { ...previous, temporary: previous.kr, kr: romanized };
    });
  };

  const openExternal = (href: string) => {
    trackEvent('outbound_click', { href });
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const openNewWordDialog = () => {
    trackEvent('open_new_word_dialog');
    setInfoOpen(false);
    setNewWordDraft({ inWord: '', rt: '', en: '', kr: '' });
    setNewWordOpen(true);
  };

  const copyNewWordText = async () => {
    const text = `IN: ${newWordDraft.inWord}\nRT: ${newWordDraft.rt}\nEN: ${newWordDraft.en}\nKR: ${newWordDraft.kr}`;
    await navigator.clipboard.writeText(text);
  };

  if (errorText) {
    return (
      <main className="app-shell">
        <section className="panel error">
          <h1>Error</h1>
          <p>{errorText}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="dictionary">
      <header className="topbar">
        <SearchForm
          searchType={searchType}
          searchTypes={searchTypes}
          searchInput={searchInput}
          t={t}
          langIconSrc={withBaseUrl('img/lang.png')}
          onSubmit={handleSearch}
          onSearchTypeChange={(nextType) => {
            trackEvent('search_type_change', { search_type: nextType });
            setSearchType(nextType);
            setSelectedWordId(null);
            setWordList(allWords);
            resetListScroll();
          }}
          onSearchInputChange={setSearchInput}
          onOpenLanguageSelect={() => {
            trackEvent('open_language_select');
            setShowLanguageSelect(true);
          }}
        />
      </header>

      <section className={`content ${isMobile ? `mobile-${mobileView}` : ''}`}>
        <WordListPane
          listRef={listRef}
          visibleWords={visibleWords}
          selectedWordId={selectedWordId}
          topPadding={virtualRange.topPadding}
          bottomPadding={virtualRange.bottomPadding}
          totalCount={wordList.length}
          indexReady={indexReady}
          onScroll={setListScrollTop}
          onSelectWord={(id) => {
            trackEvent('select_word', { word_id: id });
            void loadWordDetailById(id);
          }}
        />

        <DetailPane t={t} result={result} onBackToList={() => setMobileView('list')} />
      </section>

      <footer className="bottombar">
        <button
          type="button"
          onClick={() => {
            trackEvent('open_info_modal');
            setInfoOpen(true);
          }}>
          {t.information}
        </button>
        <div className="spacer" />
        <button type="button" onClick={handleRomanizeToggle}>
          {t.romanize}
        </button>
      </footer>

      <InfoModal
        open={infoOpen}
        t={t}
        logoSrc={withBaseUrl('img/info-logo.png')}
        profileUrl={BLOG_URL}
        onClose={() => setInfoOpen(false)}
        onDonate={() => openExternal(DONATE_URL)}
        onAddWord={openNewWordDialog}
      />

      <NewWordDialog
        open={newWordOpen}
        t={t}
        draft={newWordDraft}
        onClose={() => setNewWordOpen(false)}
        onChange={setNewWordDraft}
        onCopy={() => {
          trackEvent('copy_new_word_template');
          void copyNewWordText();
        }}
        onOpenForm={() => openExternal(NEW_VOCA_URL)}
      />

      <LanguageSelectModal
        open={showLanguageSelect}
        onClose={() => setShowLanguageSelect(false)}
        onSelectLanguage={(key) => {
          trackEvent('select_language', { language: key });
          setLanguageKey(key);
          setShowLanguageSelect(false);
        }}
      />

      <LoadingOverlay loading={loading} text={loadingText} />
    </main>
  );
}
