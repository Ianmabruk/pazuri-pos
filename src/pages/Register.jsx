import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Navigate to verification page with user data
    navigate('/verify-code', {
      state: {
        userData: {
          name: name.trim(),
          email: email.trim(),
          password
        }
      }
    });
  };

  return (
    <section className="section">
      <div className="container auth-grid">
        <div className="auth-left">
          <img src="/logo.png" alt="Pazuri Fish" />
          <h2>Get started with Pazuri</h2>
          <p style={{opacity:0.95}}>Create your account and start managing sales, inventory and staff in minutes.</p>

          <div className="auth-features">
            <div className="auth-feature">Easy setup</div>
            <div className="auth-feature">Inventory by kg</div>
            <div className="auth-feature">Reports & receipts</div>
          </div>

          <div style={{marginTop:18}}>
            <Link to="/" className="btn btn-outline">Back to home</Link>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card card padded">
            <h1 style={{fontSize:22, fontWeight:800, color:'var(--primary)', marginBottom:12}}>Create your account</h1>
            <p className="muted" style={{marginBottom:16}}>Enter your details to create an admin or cashier account.</p>

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

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full name"
                className="input mb-4"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email address"
                className="input mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="input mb-6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Continue to Verification
              </button>
            </form>

            <div style={{display:'flex', justifyContent:'space-between', marginTop:12}}>
              <Link to="/login" style={{color:'var(--primary)', fontWeight:700}}>Already have an account?</Link>
              <Link to="/" className="muted">Back to home</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}