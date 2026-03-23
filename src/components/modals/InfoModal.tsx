import type { LanguagePack } from '@/types/app';

type Props = {
  open: boolean;
  t: LanguagePack;
  logoSrc: string;
  profileUrl: string;
  onClose: () => void;
  onDonate: () => void;
  onAddWord: () => void;
};

export function InfoModal({ open, t, logoSrc, profileUrl, onClose, onDonate, onAddWord }: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="modal-logo-wrap">
          <img src={logoSrc} alt="InKrKamus logo" className="modal-logo" />
        </div>
        <p className="modal-text">
          InKrKamus v2.0
          <br />
          Designed by Sangkwon Nah
          <br />
          sknah0319@gmail.com
          <br />
          <a href={profileUrl} target="_blank" rel="noreferrer">
            {profileUrl}
          </a>
          <br />
          <br />
          Database from JongTaek Jang (CJ Indonesia)
          <br />
          <br />
          Special Thanks to Sunmi Oh
        </p>
        <div className="modal-actions">
          <button type="button" onClick={onDonate}>
            {t.donate}
          </button>
          <button type="button" onClick={onAddWord}>
            {t.addvoca}
          </button>
        </div>
      </section>
    </div>
  );
}
