import type { RefObject } from 'react';
import type { WordItem } from '@/types/app';

type Props = {
  listRef: RefObject<HTMLDivElement | null>;
  visibleWords: WordItem[];
  selectedWordId: number | null;
  topPadding: number;
  bottomPadding: number;
  totalCount: number;
  indexReady: boolean;
  onScroll: (scrollTop: number) => void;
  onSelectWord: (id: number) => void;
};

export function WordListPane({
  listRef,
  visibleWords,
  selectedWordId,
  topPadding,
  bottomPadding,
  totalCount,
  indexReady,
  onScroll,
  onSelectWord,
}: Props) {
  return (
    <div className="left-pane">
      <aside className="word-list" ref={listRef} onScroll={(event) => onScroll(event.currentTarget.scrollTop)}>
        <ul style={{ paddingTop: topPadding, paddingBottom: bottomPadding }}>
          {visibleWords.map((word) => (
            <li key={word.ID} className={selectedWordId === word.ID ? 'active' : ''} onClick={() => onSelectWord(word.ID)}>
              {word.in}
            </li>
          ))}
        </ul>
        <div className="count">
          {totalCount.toLocaleString()}
          {!indexReady && <span className="indexing-badge"> - indexing</span>}
        </div>
      </aside>
    </div>
  );
}
