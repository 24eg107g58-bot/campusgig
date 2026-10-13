import React, { useState, useEffect } from 'react';
import { contractApi, reviewApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Plus, 
  Star, 
  MessageSquare, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import Badge from '../components/Badge';
import StarRating from '../components/StarRating';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

export default function ContractsProgressPage() {
  const { user, isClient, isStudent } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Add Milestone Modal state
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  const [milestoneAmount, setMilestoneAmount] = useState('100.00');

  const loadContracts = async () => {
    try {
      setLoading(true);
      const res = await contractApi.getMyContracts();
      if (res.data) setContracts(res.data);
    } catch (err) {
      console.error('Failed to load contracts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const handleUpdateMilestone = async (milestoneId, newStatus) => {
    try {
      await contractApi.updateMilestoneStatus(milestoneId, newStatus);
      loadContracts();
    } catch (err) {
      alert(err.message || 'Failed to update milestone.');
    }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!selectedContract) return;

    try {
      await contractApi.addMilestone(selectedContract.id, {
        title: milestoneTitle,
        description: milestoneDesc,
        amount: parseFloat(milestoneAmount)
      });
      setShowMilestoneModal(false);
      setMilestoneTitle('');
      setMilestoneDesc('');
      loadContracts();
    } catch (err) {
      alert(err.message || 'Failed to add milestone.');
    }
  };

  const handleCompleteContract = async (contractId) => {
    if (!window.confirm('Are you sure you want to mark this contract as completed?')) return;
    try {
      await contractApi.updateStatus(contractId, 'COMPLETED');
      loadContracts();
    } catch (err) {
      alert(err.message || 'Failed to update contract status.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedContract) return;

    setSubmittingReview(true);
    try {
      await reviewApi.createReview({
        contractId: selectedContract.id,
        rating: reviewRating,
        feedback: reviewFeedback
      });
      setShowReviewModal(false);
      setReviewFeedback('');
      loadContracts();
    } catch (err) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader message="Loading active contracts..." />;

  return (
    <div className="page-container">
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
            Hired Projects & Milestone Tracker
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.05rem' }}>
            Collaborate on deliverables, verify milestones, and complete student projects
          </p>
        </div>

        {contracts.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No active contracts found"
            description="When a client accepts a proposal, an active contract is created here automatically."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {contracts.map((c) => {
              const otherPersonName = isClient ? c.studentName : c.clientName;
              const otherPersonAvatar = isClient ? c.studentAvatar : c.clientAvatar;
              const otherPersonLabel = isClient ? 'Student Freelancer' : 'Client';

              return (
                <div key={c.id} className="card" style={{ padding: '2rem' }}>
                  {/* Contract Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1.25rem',
                    paddingBottom: '1.5rem',
                    borderBottom: '1px solid #E2E8F0',
                    marginBottom: '1.5rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                        <Badge status={c.status} />
                        <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                          Started {new Date(c.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A' }}>
                        {c.projectTitle}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <img
                          src={otherPersonAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherPersonName)}&background=4F46E5&color=fff`}
                          alt={otherPersonName}
                          style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                        />
                        <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                          {otherPersonLabel}: <strong>{otherPersonName}</strong>
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'block' }}>Contract Value</span>
                      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981' }}>
                        ${c.agreedAmount}
                      </div>

                      {/* Contract Completion / Review Buttons */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', justifyContent: 'flex-end' }}>
                        {c.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleCompleteContract(c.id)}
                            className="btn btn-secondary btn-sm"
                          >
                            <CheckCircle size={15} color="#10B981" /> Mark Complete
                          </button>
                        )}

                        {c.status === 'COMPLETED' && isClient && !c.hasReview && (
                          <button
                            onClick={() => {
                              setSelectedContract(c);
                              setShowReviewModal(true);
                            }}
                            className="btn btn-primary btn-sm"
                          >
                            <Star size={15} /> Leave Review
                          </button>
                        )}

                        {c.status === 'COMPLETED' && c.hasReview && (
                          <span className="badge badge-success">
                            ✓ Reviewed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Milestones Checklist */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>
                        Project Deliverable Milestones
                      </h3>
                      <button
                        onClick={() => {
                          setSelectedContract(c);
                          setShowMilestoneModal(true);
                        }}
                        className="btn btn-outline btn-sm"
                      >
                        <Plus size={15} /> Add Milestone
                      </button>
                    </div>

                    {(!c.milestones || c.milestones.length === 0) ? (
                      <div style={{
                        padding: '1.25rem',
                        background: '#F8FAFC',
                        borderRadius: '10px',
                        textAlign: 'center',
                        color: '#94A3B8',
                        fontSize: '0.875rem'
                      }}>
                        No milestones created yet. Add milestones to track step-by-step progress!
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {c.milestones.map((m) => {
                          const isDone = m.status === 'COMPLETED';
                          return (
                            <div key={m.id} style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '1rem',
                              borderRadius: '10px',
                              background: isDone ? '#F0FDF4' : '#F8FAFC',
                              border: isDone ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
                              flexWrap: 'wrap',
                              gap: '0.75rem'
                            }}>
                              <div>
                                <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>
                                  {m.title}
                                </div>
                                {m.description && (
                                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                                    {m.description}
                                  </div>
                                )}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>
                                  ${m.amount}
                                </span>

                                <select
                                  className="form-input"
                                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', width: 'auto' }}
                                  value={m.status}
                                  onChange={(e) => handleUpdateMilestone(m.id, e.target.value)}
                                >
                                  <option value="PENDING">Pending</option>
                                  <option value="IN_PROGRESS">In Progress</option>
                                  <option value="COMPLETED">Completed</option>
                                </select>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Add Milestone */}
        <Modal
          isOpen={showMilestoneModal}
          onClose={() => setShowMilestoneModal(false)}
          title="Add Milestone Deliverable"
        >
          <form onSubmit={handleAddMilestone}>
            <div className="form-group">
              <label className="form-label">Milestone Title</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Frontend Wireframes & Figma Prototype"
                value={milestoneTitle}
                onChange={(e) => setMilestoneTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Amount ($)</label>
              <input
                type="number"
                required
                step="5"
                className="form-input"
                value={milestoneAmount}
                onChange={(e) => setMilestoneAmount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Deliverable Scope (Optional)</label>
              <textarea
                rows="3"
                className="form-input"
                placeholder="Details of what needs to be delivered..."
                value={milestoneDesc}
                onChange={(e) => setMilestoneDesc(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setShowMilestoneModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Add Milestone
              </button>
            </div>
          </form>
        </Modal>

        {/* Modal: Client Review */}
        <Modal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          title="Rate & Review Student Freelancer"
        >
          <form onSubmit={handleSubmitReview}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '0.75rem' }}>
                How would you rate the quality and delivery of {selectedContract?.studentName}?
              </p>
              <StarRating
                rating={reviewRating}
                size={28}
                interactive={true}
                onRatingChange={setReviewRating}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Review Feedback</label>
              <textarea
                rows="4"
                required
                className="form-input"
                placeholder="Share your experience working with this student (communication, code quality, timeliness)..."
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setShowReviewModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" disabled={submittingReview} className="btn btn-primary" style={{ flex: 1 }}>
                {submittingReview ? 'Submitting...' : 'Submit 5★ Review'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
