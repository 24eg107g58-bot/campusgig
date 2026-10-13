import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'ROLE_CLIENT') {
        navigate('/client/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        <div className="card" style={{ padding: '2.5rem 2rem', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#EEF2FF',
              color: '#4F46E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem'
            }}>
              <LogIn size={24} />
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A' }}>
              Welcome back
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Sign in to manage your campus gigs and projects
            </p>
          </div>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: '#FEE2E2',
              color: '#DC2626',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  required
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="password"
                  required
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: '0.785rem', fontWeight: 700, color: '#64748B', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.85rem' }}>
              One-Click Demo Credentials
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleDemoFill('client@campusgig.com')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'space-between', padding: '0.5rem 0.85rem' }}
              >
                <span>Dr. Evelyn Carter <span style={{ color: '#4F46E5', fontWeight: 700 }}>(Client)</span></span>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>client@campusgig.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('alex@campusgig.com')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'space-between', padding: '0.5rem 0.85rem' }}
              >
                <span>Alex Rivera <span style={{ color: '#10B981', fontWeight: 700 }}>(Student Dev)</span></span>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>alex@campusgig.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('sarah@campusgig.com')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'space-between', padding: '0.5rem 0.85rem' }}
              >
                <span>Sarah Chen <span style={{ color: '#06B6D4', fontWeight: 700 }}>(Student UI/UX)</span></span>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>sarah@campusgig.com</span>
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748B' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: '#4F46E5', fontWeight: 700 }}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
