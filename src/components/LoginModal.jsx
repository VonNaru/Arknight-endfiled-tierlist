import { useState } from 'react';

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000
  },
  modal: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '15px',
    padding: '40px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    position: 'relative'
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '30px',
    cursor: 'pointer',
    lineHeight: 1,
    padding: '5px 10px',
    transition: 'color 0.3s'
  },
  h2: {
    color: '#fff',
    marginBottom: '30px',
    textAlign: 'center',
    fontSize: '28px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    color: '#aaa',
    fontSize: '14px',
    fontWeight: '500'
  },
  input: {
    padding: '12px',
    border: '1px solid #333',
    borderRadius: '8px',
    backgroundColor: '#0f0f1e',
    color: '#fff',
    fontSize: '14px',
    transition: 'border-color 0.3s'
  },
  button: {
    padding: '14px 20px',
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    marginTop: '10px'
  },
  switchButton: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px',
    textAlign: 'center',
    padding: '10px'
  },
  errorMessage: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    border: '1px solid #ff4444',
    color: '#ff6666',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '15px'
  },
  successMessage: {
    backgroundColor: 'rgba(68, 255, 136, 0.1)',
    border: '1px solid #44ff88',
    color: '#66ffaa',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '15px'
  }
};

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin 
        ? { username, password }
        : { username, email, password };
        
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // Login berhasil
          localStorage.setItem('user', JSON.stringify(data.user));
          // Store session token
          if (data.session && data.session.access_token) {
            localStorage.setItem('token', data.session.access_token);
          }
          setSuccess('Login berhasil!');
          setTimeout(() => {
            onLoginSuccess(data.user);
            onClose();
          }, 500);
        } else {
          // Signup berhasil
          setSuccess(data.message || 'Pendaftaran berhasil! Silakan login.');
          setTimeout(() => {
            setIsLogin(true);
            setSuccess('');
          }, 1500);
        }
      } else {
        setError(data.error || 'Terjadi kesalahan');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          style={styles.closeButton}
          onClick={onClose}
          onMouseEnter={(e) => e.target.style.color = '#ff4444'}
          onMouseLeave={(e) => e.target.style.color = '#fff'}
        >
          ×
        </button>

        <h2 style={styles.h2}>{isLogin ? 'Login' : 'Sign Up'}</h2>

        {error && <div style={styles.errorMessage}>{error}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>

          {!isLogin && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={!isLogin}
                disabled={loading}
                placeholder="contoh@email.com"
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
              <small style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
                Harus mengandung @, ., dan com
              </small>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
            {!isLogin && (
              <small style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
                Minimal 6 karakter, harus ada huruf besar dan kecil
              </small>
            )}
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 5px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <button
          style={styles.switchButton}
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setSuccess('');
            setEmail('');
          }}
          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
        >
          {isLogin ? 'Belum punya akun? Sign Up' : 'Sudah punya akun? Login'}
        </button>
      </div>
    </div>
  );
}
