import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileApi, proposalApi, contractApi, projectApi } from '../api';
import { 
  DollarSign, 
  CheckCircle, 
  Star, 
  Send, 
  Briefcase, 
  Clock, 
  ArrowRight, 
  PlusCircle, 
  FileText,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import Badge from '../components/Badge';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [profRes, propRes, contRes, projRes] = await Promise.all([
          profileApi.getMyProfile(),
          proposalApi.getMyStudentProposals(),
          contractApi.getMyContracts(),
          projectApi.searchProjects({ size: 4, status: 'OPEN' })
        ]);

        if (profRes.data) setProfile(profRes.data);
        if (propRes.data) setProposals(propRes.data);
        if (contRes.data) setContracts(contRes.data);
        if (projRes.data?.content) setRecommendedProjects(projRes.data.content);
      } catch (err) {
        console.error('Failed to load student dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <Loader message="Loading your student hub..." />;

  const pendingProposalsCount = proposals.filter(p => p.status === 'PENDING').length;

  return (
    <div className="page-container">
      <div className="container">
        {/* Welcome Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>
                Welcome back, {user?.fullName}!
              </h1>
              <span className="badge badge-primary">Student Freelancer</span>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              {profile?.university || 'University Student'} • {profile?.degree || 'Undergraduate'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/projects" className="btn btn-primary">
              <Briefcase size={17} /> Browse Projects
            </Link>
            <Link to="/ai-assistant" className="btn btn-secondary">
              <Sparkles size={17} color="#4F46E5" /> AI Proposal Helper
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6" style={{ marginBottom: '2.5rem' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: '#ECFDF5',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <DollarSign size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Total Earnings</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A' }}>
                ${profile?.totalEarned || '0.00'}
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: '#EEF2FF',
              color: '#4F46E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CheckCircle size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Completed Projects</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A' }}>
                {profile?.completedProjects || 0}
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: '#FEF3C7',
              color: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Star size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Client Rating</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A' }}>
                {profile?.ratingAvg ? Number(profile.ratingAvg).toFixed(1) : '5.0'} ★
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: '#F0FDF4',
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Send size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Active Proposals</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A' }}>
                {pendingProposalsCount}
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout: Active Contracts & Recent Proposals */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          
          {/* Active Contracts */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                Active & Hired Contracts
              </h2>
              <Link to="/contracts" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4F46E5' }}>
                View all ({contracts.length})
              </Link>
            </div>

            {contracts.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No active contracts yet"
                description="Submit proposals to projects to get hired and begin milestone tracking!"
                actionLabel="Explore Projects"
                onAction={() => window.location.href = '/projects'}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {contracts.slice(0, 3).map((c) => (
                  <div key={c.id} style={{
                    padding: '1rem',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.2rem' }}>
                        {c.projectTitle}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                        Client: {c.clientName} • Agreed: <strong>${c.agreedAmount}</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Badge status={c.status} />
                      <Link to="/contracts" className="btn btn-secondary btn-sm">
                        Track Progress
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Proposals */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                Recent Proposals
              </h2>
              <Link to="/student/proposals" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4F46E5' }}>
                Manage ({proposals.length})
              </Link>
            </div>

            {proposals.length === 0 ? (
              <EmptyState
                icon={Send}
                title="No proposals submitted yet"
                description="Browse available student projects and submit competitive proposals!"
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {proposals.slice(0, 4).map((p) => (
                  <div key={p.id} style={{
                    padding: '0.85rem 1rem',
                    background: '#F8FAFC',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1E293B' }}>
                        {p.projectTitle}
                      </div>
                      <div style={{ fontSize: '0.785rem', color: '#64748B' }}>
                        Bid: <strong>${p.bidAmount}</strong> • Est: {p.deliveryDays} days
                      </div>
                    </div>
                    <Badge status={p.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recommended Open Projects */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                Open Projects Looking for Campus Talent
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                New client listings matching popular skills
              </p>
            </div>
            <Link to="/projects" className="btn btn-outline btn-sm">
              Explore All <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {recommendedProjects.map((p) => (
              <div key={p.id} style={{
                padding: '1.25rem',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="badge badge-primary">{p.category}</span>
                    <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.1rem' }}>${p.budget}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem' }}>
                    <Link to={`/projects/${p.id}`} style={{ color: 'inherit' }}>
                      {p.title}
                    </Link>
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.45, marginBottom: '1rem' }}>
                    {p.description.length > 120 ? p.description.substring(0, 117) + '...' : p.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {p.requiredSkills?.slice(0, 3).map((s, idx) => (
                      <span key={idx} style={{ fontSize: '0.7rem', padding: '0.2rem 0.45rem', background: '#F1F5F9', borderRadius: '4px', color: '#475569' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <Link to={`/projects/${p.id}`} className="btn btn-primary btn-sm">
                    View & Pitch
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
