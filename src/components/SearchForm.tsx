import type { FormEvent } from 'react';
import type { SearchType, SearchTypeOption, LanguagePack } from '@/types/app';

type Props = {
  searchType: SearchType;
  searchTypes: SearchTypeOption[];
  searchInput: string;
  t: LanguagePack;
  langIconSrc: string;
  onSubmit: (event: FormEvent) => void;
  onSearchTypeChange: (nextType: SearchType) => void;
  onSearchInputChange: (value: string) => void;
  onOpenLanguageSelect: () => void;
};

export function SearchForm({
  searchType,
  searchTypes,
  searchInput,
  t,
  langIconSrc,
  onSubmit,
  onSearchTypeChange,
  onSearchInputChange,
  onOpenLanguageSelect,
}: Props) {
  return (
    <form className="search-form" onSubmit={onSubmit}>
      <select value={searchType} onChange={(event) => onSearchTypeChange(event.target.value as SearchType)}>
        {searchTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      <div className="search-input-wrap">
        <input
          value={searchInput}
          onChange={(event) => onSearchInputChange(event.target.value)}
          placeholder={t.inputholder}
          autoComplete="off"
        />
        <button type="submit" className="search-icon-button" aria-label={t.search}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M16.5 16.5L21 21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <button type="button" className="lang-button" onClick={onOpenLanguageSelect} aria-label={t.language}>
        <img src={langIconSrc} alt="" />
      </button>
    </form>
  );
}
