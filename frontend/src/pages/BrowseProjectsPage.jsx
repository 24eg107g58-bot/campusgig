import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { projectApi } from '../api';
import { Search, Filter, Briefcase, Calendar, DollarSign, ArrowRight, X } from 'lucide-react';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

export default function BrowseProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'OPEN');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [page, setPage] = useState(0);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 9,
        query: searchQuery || undefined,
        category: category || undefined,
        status: status && status !== 'ALL' ? status : undefined,
        minBudget: minBudget ? Number(minBudget) : undefined,
        maxBudget: maxBudget ? Number(maxBudget) : undefined
      };

      const res = await projectApi.searchProjects(params);
      if (res.data) {
        setProjects(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [category, status, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchProjects();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategory('');
    setStatus('OPEN');
    setMinBudget('');
    setMaxBudget('');
    setPage(0);
    setSearchParams({});
  };

  const categories = [
    'All Categories',
    'Web Development',
    'Design & Creative',
    'Data & Analytics',
    'Backend & APIs',
    'Mobile Development'
  ];

  return (
    <div className="page-container">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
            Browse Campus Freelance Projects
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.05rem' }}>
            Explore open projects, submit proposals, and build your verified student portfolio
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="Search by keywords or skills (e.g. React, Java, Figma)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
                Search
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              alignItems: 'center',
              borderTop: '1px solid #F1F5F9',
              paddingTop: '1rem'
            }}>
              <div>
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={category}
                  onChange={(e) => {
                    const val = e.target.value === 'All Categories' ? '' : e.target.value;
                    setCategory(val);
                    setPage(0);
                  }}
                >
                  {categories.map((c, i) => (
                    <option key={i} value={c === 'All Categories' ? '' : c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Project Status</label>
                <select
                  className="form-input"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="OPEN">Open for Bids</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ALL">All Statuses</option>
                </select>
              </div>

              <div>
                <label className="form-label">Min Budget ($)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Min $"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Max Budget ($)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Max $"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', padding: '0.65rem' }}
                >
                  <X size={15} /> Reset Filters
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>
            Showing {projects.length} of {totalElements} available projects
          </div>
        </div>

        {/* Project Listings Grid */}
        {loading ? (
          <Loader message="Fetching projects..." />
        ) : projects.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No matching projects found"
            description="Try relaxing your search terms or filter criteria to see more project listings."
            actionLabel="Reset All Filters"
            onAction={clearFilters}
          />
        ) : (
          <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '3rem' }}>
            {projects.map((p) => (
              <div key={p.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <span className="badge badge-primary">{p.category}</span>
                  <Badge status={p.status} />
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem', lineHeight: 1.35 }}>
                  <Link to={`/projects/${p.id}`} style={{ color: 'inherit' }}>
                    {p.title}
                  </Link>
                </h3>

                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748B',
                  lineHeight: 1.5,
                  marginBottom: '1.25rem',
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {p.description}
                </p>

                {/* Skills tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {p.requiredSkills?.map((skill, si) => (
                    <span key={si} style={{
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.55rem',
                      background: '#F1F5F9',
                      borderRadius: '6px',
                      color: '#475569',
                      fontWeight: 600
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Card footer */}
                <div style={{
                  borderTop: '1px solid #F1F5F9',
                  paddingTop: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#94A3B8', display: 'block' }}>Budget</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                      ${p.budget}
                    </span>
                  </div>

                  <Link to={`/projects/${p.id}`} className="btn btn-primary btn-sm">
                    View Details <ArrowRight size={15} />
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
