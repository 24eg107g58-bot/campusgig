import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi, userApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { Save, Plus, Trash2, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import Loader from '../components/Loader';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, updateCurrentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('');
  const [graduationYear, setGraduationYear] = useState('2026');
  const [hourlyRate, setHourlyRate] = useState('30.00');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [experienceSummary, setExperienceSummary] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [portfolioItems, setPortfolioItems] = useState([]);

  // New portfolio item modal state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newProjectUrl, setNewProjectUrl] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTags, setNewTags] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await profileApi.getMyProfile();
        if (res.data) {
          const p = res.data;
          setFullName(p.fullName || user?.fullName || '');
          setPhone(p.phone || '');
          setUniversity(p.university || '');
          setDegree(p.degree || '');
          setGraduationYear(p.graduationYear?.toString() || '2026');
          setHourlyRate(p.hourlyRate?.toString() || '30.00');
          setGithubUrl(p.githubUrl || '');
          setLinkedinUrl(p.linkedinUrl || '');
          setWebsiteUrl(p.websiteUrl || '');
          setExperienceSummary(p.experienceSummary || '');
          setSkills(Array.from(p.skills || []));
          setPortfolioItems(p.portfolioItems || []);
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    const clean = skillInput.trim();
    if (clean && !skills.includes(clean)) {
      setSkills([...skills, clean]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await profileApi.addPortfolio({
        title: newTitle.trim(),
        description: newDescription.trim(),
        projectUrl: newProjectUrl.trim(),
        imageUrl: newImageUrl.trim(),
        tags: newTags.trim()
      });
      if (res.data) {
        setPortfolioItems([...portfolioItems, res.data]);
        setNewTitle('');
        setNewDescription('');
        setNewProjectUrl('');
        setNewImageUrl('');
        setNewTags('');
      }
    } catch (err) {
      setError('Failed to add portfolio item: ' + err.message);
    }
  };

  const handleDeletePortfolio = async (id) => {
    try {
      await profileApi.deletePortfolio(id);
      setPortfolioItems(portfolioItems.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete portfolio item: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      // 1. Update basic user info
      await userApi.updateProfile({
        fullName,
        phone
      });

      // 2. Update student profile
      const profRes = await profileApi.updateMyProfile({
        university,
        degree,
        graduationYear: parseInt(graduationYear),
        hourlyRate: parseFloat(hourlyRate),
        githubUrl,
        linkedinUrl,
        websiteUrl,
        experienceSummary,
        skills
      });

      setMessage('Profile and skills updated successfully!');
      if (user) {
        updateCurrentUser({ ...user, fullName });
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading profile settings..." />;

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: '820px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>
              Edit Student Profile
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              Refine your bio, hourly rate, and portfolio to maximize client match rates
            </p>
          </div>
          <button onClick={() => navigate(`/profile/${user?.id}`)} className="btn btn-secondary btn-sm">
            View Live Profile
          </button>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: '#FEE2E2', color: '#DC2626', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {message && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: '#DCFCE7', color: '#15803D', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={18} /> {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section: Academic Details */}
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem' }}>
              Academic & Personal Info
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">University / College</label>
              <input
                type="text"
                required
                className="form-input"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Degree & Major</label>
                <input
                  type="text"
                  required
                  className="form-input"
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

              <div className="form-group">
                <label className="form-label">Rate ($/hr)</label>
                <input
                  type="number"
                  required
                  step="0.50"
                  className="form-input"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Bio & Experience Summary</label>
              <textarea
                rows="4"
                className="form-input"
                placeholder="Share your strengths, background, hackathons won, and preferred projects..."
                value={experienceSummary}
                onChange={(e) => setExperienceSummary(e.target.value)}
              />
            </div>
          </div>

          {/* Section: Web & Social Links */}
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem' }}>
              Portfolio Links & Profiles
            </h2>

            <div className="form-group">
              <label className="form-label">GitHub Profile URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://github.com/yourusername"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn Profile URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://linkedin.com/in/yourusername"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Personal Website / Portfolio</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://yourportfolio.dev"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Section: Skills */}
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              My Technical & Design Skills
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Add skills that power our AI candidate recommendation engine
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Enter skill (e.g. React.js, Spring Boot, MySQL, Figma)..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(e);
                  }
                }}
              />
              <button type="button" onClick={handleAddSkill} className="btn btn-secondary">
                Add Skill
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {skills.map((s, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: '#EEF2FF',
                    color: '#4F46E5',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  {s}
                  <X
                    size={14}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveSkill(s)}
                  />
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
            <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
              <Save size={18} /> {saving ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>

        {/* Section: Add Portfolio Items */}
        <div className="card" style={{ padding: '2rem', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
            Add Portfolio Project Showcase
          </h2>

          <form onSubmit={handleAddPortfolio} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. UniRide Carpooling Platform"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Live Link / GitHub URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://github.com/..."
                  value={newProjectUrl}
                  onChange={(e) => setNewProjectUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                rows="2"
                className="form-input"
                placeholder="What did this project do and what was your role?"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Tags (e.g. React, Spring Boot)</label>
                <input
                  type="text"
                  className="form-input"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
              <Plus size={16} /> Add to Portfolio
            </button>
          </form>

          {/* Existing portfolio items */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid #F1F5F9', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: '1rem' }}>
              Current Portfolio Items ({portfolioItems.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {portfolioItems.map((item) => (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  background: '#F8FAFC',
                  borderRadius: '10px'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>{item.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{item.tags}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePortfolio(item.id)}
                    style={{ color: '#EF4444', padding: '6px', cursor: 'pointer' }}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
