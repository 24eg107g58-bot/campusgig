import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectApi, proposalApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Clock, 
  Send, 
  Check, 
  X, 
  Sparkles, 
  MessageSquare, 
  User, 
  AlertCircle,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import Badge from '../components/Badge';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent, isClient, isAdmin } = useAuth();

  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [myProposal, setMyProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Proposal form state
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('7');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const loadProjectData = async () => {
    try {
      setLoading(true);
      const projRes = await projectApi.getById(id);
      if (projRes.data) {
        setProject(projRes.data);
        setBidAmount(projRes.data.budget.toString());
      }

      if (isAuthenticated) {
        const propRes = await proposalApi.getForProject(id);
        if (propRes.data) {
          setProposals(propRes.data);
          if (isStudent) {
            const mine = propRes.data.find(p => p.studentId === user?.id);
            if (mine) setMyProposal(mine);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load project details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [id, isAuthenticated]);

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!coverLetter.trim()) {
      setFormError('Please enter a cover letter explaining your qualifications.');
      return;
    }

    if (!bidAmount || Number(bidAmount) <= 0) {
      setFormError('Please enter a valid bid amount.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await proposalApi.submitProposal({
        projectId: Number(id),
        coverLetter,
        bidAmount: Number(bidAmount),
        deliveryDays: Number(deliveryDays)
      });
      setFormSuccess('Proposal submitted successfully! The client will review your bid.');
      setMyProposal(res.data);
    } catch (err) {
      setFormError(err.message || 'Failed to submit proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptProposal = async (proposalId) => {
    try {
      await proposalApi.acceptProposal(proposalId);
      loadProjectData();
    } catch (err) {
      alert(err.message || 'Failed to accept proposal.');
    }
  };

  const handleRejectProposal = async (proposalId) => {
    try {
      await proposalApi.rejectProposal(proposalId);
      loadProjectData();
    } catch (err) {
      alert(err.message || 'Failed to reject proposal.');
    }
  };

  if (loading) return <Loader message="Loading project details..." />;
  if (!project) return <div className="page-container container">Project not found.</div>;

  const isOwner = user && project.clientId === user.id;

  return (
    <div className="page-container">
      <div className="container">
        {/* Top Breadcrumb & Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/projects" style={{ fontSize: '0.9rem', color: '#4F46E5', fontWeight: 600 }}>
            ← Back to all projects
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge badge-primary">{project.category}</span>
            <Badge status={project.status} />
          </div>
        </div>

        {/* Main Grid: Details (Left) & Sidebar (Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
          
          {/* Left Column: Project Description & Proposals */}
          <div>
            <div className="card" style={{ padding: '2.25rem', marginBottom: '2.5rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3, marginBottom: '1rem' }}>
                {project.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', color: '#64748B', fontSize: '0.9rem', paddingBottom: '1.5rem', borderBottom: '1px solid #F1F5F9', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <DollarSign size={17} color="#10B981" /> Budget: <strong style={{ color: '#0F172A' }}>${project.budget}</strong>
                </div>
                {project.deadline && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={17} color="#4F46E5" /> Deadline: <strong style={{ color: '#0F172A' }}>{project.deadline}</strong>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={17} color="#F59E0B" /> Status: <strong style={{ color: '#0F172A' }}>{project.status}</strong>
                </div>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.75rem' }}>
                Project Overview
              </h3>
              <div style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-line', marginBottom: '2rem' }}>
                {project.description}
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.75rem' }}>
                Required Skills & Tech Stack
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.requiredSkills?.map((skill, si) => (
                  <span key={si} style={{
                    fontSize: '0.85rem',
                    padding: '0.35rem 0.85rem',
                    background: '#EEF2FF',
                    color: '#4F46E5',
                    borderRadius: '8px',
                    fontWeight: 600
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Proposals Section for Owner Client */}
            {(isOwner || isAdmin) && (
              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                      Received Proposals ({proposals.length})
                    </h2>
                    <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                      Review student proposals, inspect credentials, and hire the ideal candidate
                    </p>
                  </div>

                  <Link to={`/recommendations/${project.id}`} className="btn btn-outline btn-sm">
                    <Sparkles size={16} color="#4F46E5" /> AI Candidate Match
                  </Link>
                </div>

                {proposals.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>
                    No proposals submitted for this project yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {proposals.map((p) => (
                      <div key={p.id} style={{
                        padding: '1.5rem',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '14px',
                        background: p.status === 'ACCEPTED' ? '#F0FDF4' : '#ffffff'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <img
                              src={p.studentAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.studentName)}&background=4F46E5&color=fff`}
                              alt={p.studentName}
                              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <Link to={`/profile/${p.studentId}`} style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0F172A' }}>
                                {p.studentName}
                              </Link>
                              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                {p.studentUniversity} • {p.studentDegree}
                              </div>
                              <StarRating rating={p.studentRating} size={14} />
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                              ${p.bidAmount}
                            </div>
                            <div style={{ fontSize: '0.785rem', color: '#64748B' }}>
                              in {p.deliveryDays} days
                            </div>
                            <Badge status={p.status} />
                          </div>
                        </div>

                        <div style={{
                          fontSize: '0.9rem',
                          color: '#334155',
                          lineHeight: 1.55,
                          background: '#F8FAFC',
                          padding: '1rem',
                          borderRadius: '8px',
                          marginBottom: '1rem'
                        }}>
                          {p.coverLetter}
                        </div>

                        {/* Proposal Actions for Client */}
                        {p.status === 'PENDING' && (
                          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleRejectProposal(p.id)}
                              className="btn btn-secondary btn-sm"
                            >
                              <X size={15} /> Decline
                            </button>
                            <button
                              onClick={() => handleAcceptProposal(p.id)}
                              className="btn btn-primary btn-sm"
                            >
                              <Check size={15} /> Accept & Hire
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Client info & Proposal Submission */}
          <div>
            {/* Client Card */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
                About the Client
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                <img
                  src={project.clientAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.clientName)}&background=4F46E5&color=fff`}
                  alt={project.clientName}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{project.clientName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Project Sponsor</div>
                </div>
              </div>

              {isAuthenticated && user.id !== project.clientId && (
                <button
                  onClick={() => navigate(`/messages?userId=${project.clientId}`)}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  <MessageSquare size={16} /> Message Client
                </button>
              )}
            </div>

            {/* Proposal Submission for Students */}
            {isStudent && (
              <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                  Submit a Proposal
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
                  Pitch your solution directly to the client.
                </p>

                {myProposal ? (
                  <div style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16A34A', fontWeight: 700, marginBottom: '0.5rem' }}>
                      <CheckCircle2 size={18} /> You have applied!
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.5rem' }}>
                      Your bid: <strong>${myProposal.bidAmount}</strong> • Est: <strong>{myProposal.deliveryDays} days</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Status: <Badge status={myProposal.status} />
                    </div>
                  </div>
                ) : project.status !== 'OPEN' ? (
                  <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', color: '#64748B', fontSize: '0.85rem' }}>
                    This project is no longer accepting new proposals.
                  </div>
                ) : (
                  <form onSubmit={handleProposalSubmit}>
                    {formError && (
                      <div style={{ padding: '0.65rem', background: '#FEE2E2', color: '#DC2626', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem' }}>
                        {formError}
                      </div>
                    )}
                    {formSuccess && (
                      <div style={{ padding: '0.65rem', background: '#DCFCE7', color: '#15803D', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem' }}>
                        {formSuccess}
                      </div>
                    )}

                    <div className="form-group">
                      <label className="form-label">Your Proposed Price ($)</label>
                      <input
                        type="number"
                        required
                        className="form-input"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Estimated Delivery (Days)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="form-input"
                        value={deliveryDays}
                        onChange={(e) => setDeliveryDays(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="form-label">Cover Letter</label>
                        <Link to="/ai-assistant" target="_blank" style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 600 }}>
                          AI Proposal Help ✨
                        </Link>
                      </div>
                      <textarea
                        required
                        rows="5"
                        className="form-input"
                        placeholder="Explain why you are the best fit, relevant coursework, or links to similar work..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.75rem' }}
                    >
                      {submitting ? 'Submitting Bid...' : 'Send Proposal'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {!isAuthenticated && (
              <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                  Want to submit a proposal?
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem' }}>
                  Sign in or register as a student freelancer to submit your bid.
                </p>
                <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                  Sign In to Apply
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
