type Props = {
  loading: boolean;
  text: string;
};

export function LoadingOverlay({ loading, text }: Props) {
  if (!loading) {
    return null;
  }

  return (
    <div className="loading-backdrop" role="status" aria-live="polite">
      <div className="loading-box">
        <div className="loading-spinner" />
        <p>{text}</p>
      </div>
    </div>
  );
}
