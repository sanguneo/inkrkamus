import type { LanguageKey } from '@/types/app';

type Props = {
  open: boolean;
  onClose: () => void;
  onSelectLanguage: (key: LanguageKey) => void;
};

export function LanguageSelectModal({ open, onClose, onSelectLanguage }: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className="language-backdrop" onClick={onClose}>
      <div className="language-select" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={() => onSelectLanguage('ko_KR')}>
          한국어
        </button>
        <button type="button" onClick={() => onSelectLanguage('en_US')}>
          English
        </button>
        <button type="button" onClick={() => onSelectLanguage('in_ID')}>
          Bahasa Indonesia
        </button>
      </div>
    </div>
  );
}
