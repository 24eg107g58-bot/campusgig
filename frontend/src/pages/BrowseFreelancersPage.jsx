import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profileApi } from '../api';
import { Search, GraduationCap, Star, DollarSign, ArrowRight, ExternalLink } from 'lucide-react';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

export default function BrowseFreelancersPage() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchFreelancers = async () => {
    setLoading(true);
    try {
      const res = await profileApi.searchFreelancers({
        page,
        size: 9,
        query: query.trim() || undefined
      });
      if (res.data) {
        setFreelancers(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to load freelancers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchFreelancers();
  };

  return (
    <div className="page-container">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
            Discover University Freelance Talent
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.05rem' }}>
            Hire top student developers, UI/UX designers, and tech innovators for your next project
          </p>
        </div>

        {/* Search Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2.5rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
              <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="Search by student name, university, or skill (e.g. Stanford, React, Java)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
              Search Freelancers
            </button>
          </form>
        </div>

        {/* Results Info */}
        <div style={{ marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>
          Showing {freelancers.length} of {totalElements} verified campus freelancers
        </div>

        {loading ? (
          <Loader message="Loading freelancers..." />
        ) : freelancers.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="No student freelancers found"
            description="Try searching with different skills, names, or universities."
          />
        ) : (
          <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '3rem' }}>
            {freelancers.map((f) => (
              <div key={f.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', padding: '2rem 1.5rem' }}>
                <img
                  src={f.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(f.fullName)}&background=4F46E5&color=fff`}
                  alt={f.fullName}
                  style={{
                    width: '78px',
                    height: '78px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 1rem',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                />

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.2rem' }}>
                  <Link to={`/profile/${f.userId}`} style={{ color: 'inherit' }}>
                    {f.fullName}
                  </Link>
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.85rem' }}>
                  <GraduationCap size={15} /> {f.university || 'University Student'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                  {f.degree}
                </div>

                {/* Rating & Reviews */}
                <div style={{ margin: '0.85rem 0' }}>
                  <StarRating rating={f.ratingAvg} size={15} />
                  <span style={{ fontSize: '0.8rem', color: '#64748B', marginLeft: '6px' }}>
                    ({f.reviewCount} reviews)
                  </span>
                </div>

                <p style={{
                  fontSize: '0.85rem',
                  color: '#64748B',
                  lineHeight: 1.45,
                  marginBottom: '1rem',
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {f.experienceSummary || f.bio || 'Motivated university freelancer ready for challenging commercial projects.'}
                </p>

                {/* Skills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {Array.from(f.skills || []).slice(0, 4).map((s, idx) => (
                    <span key={idx} style={{
                      fontSize: '0.725rem',
                      padding: '0.2rem 0.5rem',
                      background: '#EEF2FF',
                      color: '#4F46E5',
                      borderRadius: '6px',
                      fontWeight: 600
                    }}>
                      {s}
                    </span>
                  ))}
                </div>

                <div style={{
                  borderTop: '1px solid #F1F5F9',
                  paddingTop: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#94A3B8', display: 'block' }}>Rate</span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                      ${f.hourlyRate || '30'}/hr
                    </span>
                  </div>

                  <Link to={`/profile/${f.userId}`} className="btn btn-primary btn-sm">
                    View Portfolio <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
            <button
              disabled={page === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              className="btn btn-secondary btn-sm"
            >
              Previous
            </button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
              Page {page + 1} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="btn btn-secondary btn-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
