import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, Phone, GraduationCap, Building, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('ROLE_STUDENT');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('');
  const [graduationYear, setGraduationYear] = useState('2026');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName,
        email,
        password,
        phone,
        role,
        ...(role === 'ROLE_STUDENT' && {
          university: university || 'University Student',
          degree: degree || 'Undergraduate',
          graduationYear: parseInt(graduationYear) || 2026
        })
      };

      const newUser = await register(payload);
      if (newUser.role === 'ROLE_CLIENT') {
        navigate('/client/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '540px' }}>
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
              <UserPlus size={24} />
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A' }}>
              Create your account
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Join the student freelance community on CAMPUSGIG
            </p>
          </div>

          {/* Role selector tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: '#F1F5F9',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '1.75rem',
            gap: '4px'
          }}>
            <button
              type="button"
              onClick={() => setRole('ROLE_STUDENT')}
              style={{
                padding: '0.65rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                background: role === 'ROLE_STUDENT' ? '#ffffff' : 'transparent',
                color: role === 'ROLE_STUDENT' ? '#4F46E5' : '#64748B',
                boxShadow: role === 'ROLE_STUDENT' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
              }}
            >
              <GraduationCap size={18} /> Student Freelancer
            </button>

            <button
              type="button"
              onClick={() => setRole('ROLE_CLIENT')}
              style={{
                padding: '0.65rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                background: role === 'ROLE_CLIENT' ? '#ffffff' : 'transparent',
                color: role === 'ROLE_CLIENT' ? '#4F46E5' : '#64748B',
                boxShadow: role === 'ROLE_CLIENT' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
              }}
            >
              <Building size={18} /> Client / Recruiter
            </button>
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
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="text"
                  required
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="e.g. Jordan Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  required
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder={role === 'ROLE_STUDENT' ? 'name@university.edu' : 'name@company.com'}
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
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number (Optional)</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {role === 'ROLE_STUDENT' && (
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
                  Student Education Details
                </div>

                <div className="form-group">
                  <label className="form-label">University / College</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Stanford University"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Degree & Major</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. B.S. Computer Science"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Grad Year</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              {loading ? 'Creating Account...' : `Register as ${role === 'ROLE_STUDENT' ? 'Student' : 'Client'}`}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748B' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#4F46E5', fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
