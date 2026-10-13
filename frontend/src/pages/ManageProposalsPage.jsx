import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { proposalApi } from '../api';
import { Send, DollarSign, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

export default function ManageProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const res = await proposalApi.getMyStudentProposals();
        if (res.data) setProposals(res.data);
      } catch (err) {
        console.error('Failed to load proposals', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  if (loading) return <Loader message="Loading your submitted proposals..." />;

  return (
    <div className="page-container">
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
            My Submitted Proposals
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.05rem' }}>
            Track the status of your project bids and accepted client contracts
          </p>
        </div>

        {proposals.length === 0 ? (
          <EmptyState
            icon={Send}
            title="No proposals submitted yet"
            description="Browse open freelance projects and start pitching clients to win contracts!"
            actionLabel="Browse Open Projects"
            onAction={() => window.location.href = '/projects'}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {proposals.map((p) => (
              <div key={p.id} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                      <Badge status={p.status} />
                      <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                        Submitted on {new Date(p.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
                      <Link to={`/projects/${p.projectId}`} style={{ color: 'inherit' }}>
                        {p.projectTitle}
                      </Link>
                    </h3>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>
                      ${p.bidAmount}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                      Est. delivery: {p.deliveryDays} days
                    </div>
                  </div>
                </div>

                <div style={{
                  background: '#F8FAFC',
                  borderRadius: '10px',
                  padding: '1.1rem',
                  fontSize: '0.9rem',
                  color: '#334155',
                  lineHeight: 1.6,
                  marginBottom: '1.25rem'
                }}>
                  <strong style={{ color: '#1E293B', display: 'block', marginBottom: '0.25rem' }}>Your Proposal Pitch:</strong>
                  {p.coverLetter}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link to={`/projects/${p.projectId}`} style={{ fontSize: '0.875rem', color: '#4F46E5', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    View Project Details <ExternalLink size={14} />
                  </Link>

                  {p.status === 'ACCEPTED' && (
                    <Link to="/contracts" className="btn btn-primary btn-sm">
                      Go to Active Contract <ArrowRight size={15} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
