import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function VerifyCode() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyCode } = useAuth();

  // Get user data passed from login/register
  const userData = location.state?.userData;

  // Redirect if no user data
  if (!userData) {
    navigate('/login');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Please enter your verification code');
      return;
    }

    const firstChar = code.trim()[0].toUpperCase();

    // Validate code prefix
    if (firstChar !== 'D' && firstChar !== 'C') {
      setError('Invalid verification code. Code must start with D (admin) or C (cashier)');
      return;
    }

    // Determine role based on code prefix
    const role = firstChar === 'D' ? 'admin' : 'cashier';

    // Complete the login/registration with role
    const user = verifyCode({ ...userData, code: code.trim(), role });

    if (user) {
      // Navigate based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'cashier') {
        navigate('/cashier');
      }
    } else {
      setError('Verification failed. Please try again.');
    }
  };

  return (
    <section className="min-h-70vh center">
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card padded" style={{ width: '100%', maxWidth: 480 }}>
          <h1 className="text-center" style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>
            Verification Code
          </h1>
          <p className="text-center muted" style={{ fontSize: 14, marginBottom: 24 }}>
            Enter your verification code to continue
          </p>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '12px',
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 14
            }}>
              {error}
            </div>
          )}

          <div style={{
            background: '#dbeafe',
            color: '#1e40af',
            padding: '12px',
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 13
          }}>
            <strong>Code Format:</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
              <li>Admin codes start with <strong>D</strong></li>
              <li>Cashier codes start with <strong>C</strong></li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter verification code (e.g., D12345 or C67890)"
              className="input mb-6"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              autoFocus
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Verify & Continue
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: 14,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}