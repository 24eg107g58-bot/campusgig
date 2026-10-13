import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../api';
import { PlusCircle, DollarSign, Calendar, Tag, X, AlertCircle } from 'lucide-react';

export default function CreateProjectPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(['React.js', 'Spring Boot']);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !budget) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (skills.length === 0) {
      setError('Please add at least one required skill tag.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        category,
        description: description.trim(),
        budget: Number(budget),
        deadline: deadline || undefined,
        requiredSkills: skills
      };

      const res = await projectApi.createProject(payload);
      if (res.data) {
        navigate(`/projects/${res.data.id}`);
      } else {
        navigate('/client/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to post project.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Web Development',
    'Design & Creative',
    'Data & Analytics',
    'Backend & APIs',
    'Mobile Development',
    'AI & Machine Learning'
  ];

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: '720px' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
              Post a New Project Listing
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              Connect with talented students for web, software, and design projects
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
              marginBottom: '1.5rem'
            }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Build Campus Event Ticket Scanner with React & Spring Boot"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Total Budget ($)</label>
                <input
                  type="number"
                  required
                  min="5"
                  className="form-input"
                  placeholder="e.g. 500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Deadline (Optional)</label>
              <input
                type="date"
                className="form-input"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Project Description</label>
              <textarea
                required
                rows="6"
                className="form-input"
                placeholder="Describe project deliverables, expectations, tech stack requirements, and timelines..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Required Skills Multi-Tag Input */}
            <div className="form-group">
              <label className="form-label">Required Skills (Key for AI Matching)</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Type a skill (e.g. React.js, Java, Figma) and click Add"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="btn btn-secondary"
                >
                  Add
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: '#EEF2FF',
                      color: '#4F46E5',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}
                  >
                    {skill}
                    <X
                      size={14}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRemoveSkill(skill)}
                    />
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ flex: 2 }}
              >
                {loading ? 'Publishing...' : 'Publish Project Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
