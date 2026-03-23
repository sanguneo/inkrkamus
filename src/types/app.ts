export type SearchType = 'in' | 'kr' | 'en' | 'rt';
export type LanguageKey = 'ko_KR' | 'en_US' | 'in_ID';

export type WordItem = {
  ID: number;
  in: string;
};

export type WordDetail = {
  ID?: number;
  rt: string;
  en: string;
  kr: string;
  temporary?: string;
};

export type NewWordDraft = {
  inWord: string;
  rt: string;
  en: string;
  kr: string;
};

export type SearchOptions = {
  silent?: boolean;
  updateHistory?: boolean;
};

export type LanguagePack = {
  root: string;
  korean: string;
  english: string;
  indonesian: string;
  search: string;
  information: string;
  romanize: string;
  donate: string;
  addvoca: string;
  inputholder: string;
  nodata: string;
  krIndex: string;
  language: string;
  loading: string;
  openForm: string;
  close: string;
  newWordTitle: string;
  newWordHint: string;
  backToList: string;
};

export type SearchTypeOption = {
  label: string;
  value: SearchType;
};
