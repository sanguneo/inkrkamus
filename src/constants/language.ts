import type { LanguageKey, LanguagePack } from '@/types/app';

export const LANGUAGE_SET: Record<LanguageKey, LanguagePack> = {
  ko_KR: {
    root: '어근',
    korean: '한국어',
    english: '영어',
    indonesian: '인니어',
    search: '검색',
    information: '정보',
    romanize: '로마자변환',
    donate: '개발자후원',
    addvoca: '새단어등록',
    inputholder: '검색어를 입력해주세요',
    nodata: '검색결과가 없습니다.\n입력을 확인해보세요.',
    krIndex:
      '한글로 검색하실 경우 정확한 단어로 검색해주셔야\n정확한 결과를 얻을 수 있습니다.\n\n한글검색기능은 인도네시아어 데이터베이스에서 검색하신 단어를 결과로 포함하는 인니어를 찾는 기능이므로,\n간혹 검색결과가 맞지않아 보이는 경우가 있습니다.\n\n단어를 검색하시고 리스트에서 인니어를 직접 클릭하여 맞는 단어인지 꼭 확인하시고 사용해주시기 바랍니다.',
    language: '언어',
    loading: '로딩중...',
    openForm: '폼 열기',
    close: '닫기',
    newWordTitle: '새 단어 등록',
    newWordHint: '아래 입력을 복사한 뒤 등록 폼에 붙여 넣어 주세요.',
    backToList: '목록으로',
  },
  en_US: {
    root: 'Radix',
    korean: 'Korean',
    english: 'English',
    indonesian: 'Indonesian',
    search: 'Search',
    information: 'Info',
    romanize: 'Romanize',
    donate: 'Donate',
    addvoca: 'Add new word',
    inputholder: 'Search word',
    nodata: 'No result found. Please check your input.',
    krIndex:
      'In order to get accurate results, use exact words.\n\nBefore using the result, click the Indonesian item in list and verify.',
    language: 'Language',
    loading: 'Loading...',
    openForm: 'Open form',
    close: 'Close',
    newWordTitle: 'Add New Word',
    newWordHint: 'Copy the text below and paste it into the submission form.',
    backToList: 'Back to list',
  },
  in_ID: {
    root: 'Kata dasar',
    korean: 'Bhs Korea',
    english: 'Bhs Inggris',
    indonesian: 'Bhs Indonesia',
    search: 'Cari',
    information: 'Informasi',
    romanize: 'Konversi latin',
    donate: 'Donasi',
    addvoca: 'Tambah kata',
    inputholder: 'Cari kata',
    nodata: 'Tidak ada hasil. Cek data masukan.',
    krIndex: 'Gunakan kata yang tepat untuk hasil yang lebih akurat.\n\nPeriksa hasil dengan klik kata pada daftar.',
    language: 'Bahasa',
    loading: 'Memuat...',
    openForm: 'Buka form',
    close: 'Tutup',
    newWordTitle: 'Tambah Kata Baru',
    newWordHint: 'Salin isi berikut lalu tempel ke form pendaftaran.',
    backToList: 'Kembali ke daftar',
  },
};

export function getInitialLanguage(): LanguageKey {
  const saved = window.localStorage.getItem('languageKey') as LanguageKey | null;
  if (saved && saved in LANGUAGE_SET) {
    return saved;
  }
  return 'ko_KR';
}
