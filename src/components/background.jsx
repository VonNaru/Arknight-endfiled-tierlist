export default function Background({ page, children }) {
  const colors = {
    home: '#1a1a1a',
    about: '#1a1a1a',
    default: '#1a1a1a'
  };

  return (
    <div style={{
      backgroundColor: colors[page] || colors.default,
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      {children}
    </div>
  );
}