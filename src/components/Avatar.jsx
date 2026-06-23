export default function Avatar({ username, size = 40 }) {
  const initial = username ? username.charAt(0).toUpperCase() : '?';
  const colors = [
    '#7c3aed', '#2563eb', '#059669', '#d97706',
    '#dc2626', '#7c3aed', '#0891b2', '#9333ea',
  ];
  const color = colors[username ? username.charCodeAt(0) % colors.length : 0];

  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        fontSize: size * 0.4,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        flexShrink: 0,
        letterSpacing: '0.02em',
      }}
    >
      {initial}
    </div>
  );
}
