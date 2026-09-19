export default function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--bg-base)',
      gap: 'var(--space-4)',
    }}>
      <div style={{
        width: 48,
        height: 48,
        background: 'linear-gradient(135deg, var(--color-primary), hsl(250,80%,60%))',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-glow)',
        animation: 'pulse 2s infinite',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
        Loading AssetSync...
      </span>
    </div>
  );
}
