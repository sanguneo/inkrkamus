import type { LanguagePack, NewWordDraft } from '@/types/app';

type Props = {
  open: boolean;
  t: LanguagePack;
  draft: NewWordDraft;
  onClose: () => void;
  onChange: (next: NewWordDraft) => void;
  onCopy: () => void;
  onOpenForm: () => void;
};

export function NewWordDialog({ open, t, draft, onClose, onChange, onCopy, onOpenForm }: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className="new-word-backdrop" role="presentation" onClick={onClose}>
      <section className="new-word-dialog" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <h3>{t.newWordTitle}</h3>
        <p>{t.newWordHint}</p>
        <input value={draft.inWord} onChange={(event) => onChange({ ...draft, inWord: event.target.value })} placeholder={t.indonesian} />
        <input value={draft.rt} onChange={(event) => onChange({ ...draft, rt: event.target.value })} placeholder={t.root} />
        <input value={draft.en} onChange={(event) => onChange({ ...draft, en: event.target.value })} placeholder={t.english} />
        <textarea value={draft.kr} onChange={(event) => onChange({ ...draft, kr: event.target.value })} placeholder={t.korean} />
        <div className="new-word-actions">
          <button type="button" onClick={onCopy}>
            Copy
          </button>
          <button type="button" onClick={onOpenForm}>
            {t.openForm}
          </button>
          <button type="button" onClick={onClose}>
            {t.close}
          </button>
        </div>
      </section>
    </div>
  );
}
