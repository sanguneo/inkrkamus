import type { LanguagePack, WordDetail } from '@/types/app';

type Props = {
  t: LanguagePack;
  result: WordDetail;
  onBackToList: () => void;
};

export function DetailPane({ t, result, onBackToList }: Props) {
  return (
    <article className="detail">
      <div className="mobile-detail-bar">
        <button type="button" className="mobile-back-btn" onClick={onBackToList} aria-label={t.backToList} title={t.backToList}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5L8 12L15 19" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <label htmlFor="root">{t.root}</label>
      <input id="root" value={result.rt} readOnly />

      <label htmlFor="english">{t.english}</label>
      <input id="english" value={result.en} readOnly />

      <label htmlFor="meaning">{t.korean}</label>
      <textarea id="meaning" value={result.kr} readOnly />
    </article>
  );
}
