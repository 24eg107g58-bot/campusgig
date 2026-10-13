import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectApi, contractApi } from '../api';
import { 
  FolderPlus, 
  Briefcase, 
  Users, 
  DollarSign, 
  CheckCircle, 
  PlusCircle, 
  ArrowRight, 
  Sparkles,
  Eye,
  MessageSquare,
  Edit
} from 'lucide-react';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projRes, contRes] = await Promise.all([
          projectApi.getMyProjects(),
          contractApi.getMyContracts()
        ]);
        if (projRes.data) setProjects(projRes.data);
        if (contRes.data) setContracts(contRes.data);
      } catch (err) {
        console.error('Failed to load client dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <Loader message="Loading client portal..." />;

  const activeProjectsCount = projects.filter(p => p.status === 'OPEN').length;
  const totalProposalsReceived = projects.reduce((acc, p) => acc + (p.proposalCount || 0), 0);
  const totalCommitted = contracts.reduce((acc, c) => acc + Number(c.agreedAmount || 0), 0);

  return (
    <div className="page-container">
      <div className="container">
        {/* Header */}
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
                Client Dashboard
              </h1>
              <span className="badge badge-primary">Project Client</span>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Manage your project listings, review student proposals, and track contracted milestones
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/projects/create" className="btn btn-primary">
              <PlusCircle size={18} /> Post a New Project
            </Link>
            <Link to="/freelancers" className="btn btn-secondary">
              <Users size={18} /> Browse Talent
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
              background: '#EEF2FF',
              color: '#4F46E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Briefcase size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Active Projects</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A' }}>
                {activeProjectsCount}
              </div>
            </div>
          </div>

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
              <Users size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Proposals Received</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A' }}>
                {totalProposalsReceived}
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
              <CheckCircle size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Active Contracts</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A' }}>
                {contracts.filter(c => c.status === 'ACTIVE' || c.status === 'IN_PROGRESS').length}
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
              <DollarSign size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Total Committed</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A' }}>
                ${totalCommitted.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* My Project Listings */}
        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                My Published Project Listings
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                Manage candidate proposals and use AI matching to invite student talent
              </p>
            </div>

            <Link to="/projects/create" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> Post Project
            </Link>
          </div>

          {projects.length === 0 ? (
            <EmptyState
              icon={FolderPlus}
              title="You haven't posted any projects yet"
              description="Post a project with your budget and required skills to receive student proposals."
              actionLabel="Create First Project"
              onAction={() => window.location.href = '/projects/create'}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{
                  padding: '1.25rem',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className="badge badge-primary">{p.category}</span>
                      <Badge status={p.status} />
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                        Budget: <strong>${p.budget}</strong>
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
                      <Link to={`/projects/${p.id}`} style={{ color: 'inherit' }}>
                        {p.title}
                      </Link>
                    </h3>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {p.requiredSkills?.map((skill, si) => (
                        <span key={si} style={{ fontSize: '0.725rem', padding: '0.15rem 0.5rem', background: '#F1F5F9', borderRadius: '4px', color: '#475569', fontWeight: 600 }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                    <Link to={`/projects/${p.id}`} className="btn btn-secondary btn-sm">
                      <Eye size={15} /> Proposals ({p.proposalCount || 0})
                    </Link>

                    <Link to={`/recommendations/${p.id}`} className="btn btn-outline btn-sm" style={{ background: '#EEF2FF' }}>
                      <Sparkles size={15} color="#4F46E5" /> AI Recommendations
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hired Contracts Tracking */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                Hired Freelancers & Contracts
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                Monitor delivery milestones, inspect progress, and submit reviews upon completion
              </p>
            </div>
            <Link to="/contracts" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4F46E5' }}>
              View All Contracts <ArrowRight size={15} />
            </Link>
          </div>

          {contracts.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No active contracts"
              description="Review proposals on your project listings and accept student bids to create contracts."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {contracts.slice(0, 3).map((c) => (
                <div key={c.id} style={{
                  padding: '1rem 1.25rem',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={c.studentAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.studentName)}&background=4F46E5&color=fff`}
                      alt={c.studentName}
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.15rem' }}>
                        {c.studentName} • {c.projectTitle}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                        Agreed Budget: <strong>${c.agreedAmount}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Badge status={c.status} />
                    <Link to="/contracts" className="btn btn-secondary btn-sm">
                      Inspect Milestones
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
