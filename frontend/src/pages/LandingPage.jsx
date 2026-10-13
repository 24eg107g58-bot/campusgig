import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectApi, profileApi } from '../api';
import { 
  ArrowRight, 
  Search, 
  Code, 
  Palette, 
  Database, 
  Cpu, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Briefcase, 
  DollarSign,
  GraduationCap
} from 'lucide-react';
import Badge from '../components/Badge';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [topFreelancers, setTopFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, freeRes] = await Promise.all([
          projectApi.searchProjects({ size: 3, status: 'OPEN' }),
          profileApi.searchFreelancers({ size: 3 })
        ]);
        if (projRes.data?.content) setFeaturedProjects(projRes.data.content);
        if (freeRes.data?.content) setTopFreelancers(freeRes.data.content);
      } catch (err) {
        console.error('Failed to load landing data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/projects');
    }
  };

  const categories = [
    { name: 'Web Development', icon: Code, count: '140+ Projects' },
    { name: 'UI/UX & Design', icon: Palette, count: '95+ Projects' },
    { name: 'Backend & APIs', icon: Database, count: '80+ Projects' },
    { name: 'AI & Machine Learning', icon: Cpu, count: '65+ Projects' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)',
        padding: '5rem 0 6rem',
        borderBottom: '1px solid #E2E8F0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '880px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            background: 'rgba(79, 70, 229, 0.1)',
            color: '#4F46E5',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={16} /> Campus Freelance Revolution
          </div>

          <h1 style={{
            fontSize: '3.25rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#0F172A',
            marginBottom: '1.25rem'
          }}>
            Connect Campus Talent With <span style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>High-Impact Projects</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: '#475569',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            maxWidth: '680px',
            margin: '0 auto 2.5rem'
          }}>
            CAMPUSGIG enables students to gain authentic commercial experience, build verified portfolios, and earn competitive freelance income while assisting businesses.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            borderRadius: '16px',
            padding: '0.5rem 0.65rem 0.5rem 1.25rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            border: '1.5px solid #E2E8F0',
            maxWidth: '640px',
            margin: '0 auto 2.5rem'
          }}>
            <Search size={22} color="#94A3B8" style={{ marginRight: '0.75rem', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search projects (e.g. React, Spring Boot, Mobile App, Figma)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                color: '#0F172A'
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.4rem' }}>
              Search Gigs
            </button>
          </form>

          {/* Dual Call-to-actions */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Freelancing as Student <ArrowRight size={18} />
            </Link>
            <Link to="/projects/create" className="btn btn-secondary btn-lg">
              Hire Student Talent
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #E2E8F0', padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#4F46E5' }}>100%</div>
              <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>Verified Campus Students</div>
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A' }}>4.9 ★</div>
              <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>Average Client Satisfaction</div>
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#10B981' }}>$150K+</div>
              <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>Earned by Students</div>
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#06B6D4' }}>Smart AI</div>
              <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>Skill Matching Algorithm</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>
              Explore Featured Skill Categories
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '0.5rem' }}>
              Discover project opportunities and student expertise across top technical domains
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {categories.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  className="card card-interactive"
                  onClick={() => navigate(`/projects?category=${encodeURIComponent(c.name)}`)}
                  style={{ cursor: 'pointer', textAlign: 'center', padding: '2rem 1.5rem' }}
                >
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '12px',
                    background: '#EEF2FF',
                    color: '#4F46E5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem'
                  }}>
                    <Icon size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
                    {c.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    {c.count}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section style={{ padding: '4rem 0', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A' }}>
                Latest Active Projects
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                Real project listings waiting for student bids right now
              </p>
            </div>
            <Link to="/projects" className="btn btn-outline">
              View All Projects <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <Loader message="Loading latest campus gigs..." />
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {featuredProjects.map((p) => (
                <div key={p.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    <span className="badge badge-primary">{p.category}</span>
                    <Badge status={p.status} />
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem', lineHeight: 1.35 }}>
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

                  <div style={{
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Budget</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                        ${p.budget}
                      </span>
                    </div>

                    <Link to={`/projects/${p.id}`} className="btn btn-primary btn-sm">
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top Campus Freelancers Preview */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A' }}>
                Featured Student Freelancers
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                Verified students from top universities with proven client track records
              </p>
            </div>
            <Link to="/freelancers" className="btn btn-outline">
              Explore All Talent <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {topFreelancers.map((f) => (
              <div key={f.id} className="card card-interactive" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                <img
                  src={f.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(f.fullName)}&background=4F46E5&color=fff`}
                  alt={f.fullName}
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 1rem',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
                  {f.fullName}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#64748B', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  <GraduationCap size={15} /> {f.university || 'University Student'}
                </div>

                <div style={{ margin: '0.85rem 0' }}>
                  <StarRating rating={f.ratingAvg} size={15} />
                  <span style={{ fontSize: '0.785rem', color: '#64748B', marginLeft: '6px' }}>
                    ({f.reviewCount} reviews)
                  </span>
                </div>

                <p style={{
                  fontSize: '0.85rem',
                  color: '#64748B',
                  lineHeight: 1.45,
                  marginBottom: '1rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {f.experienceSummary || f.bio || 'Passionate student freelancer.'}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {Array.from(f.skills || []).slice(0, 3).map((s, idx) => (
                    <span key={idx} style={{
                      fontSize: '0.75rem',
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

                <Link to={`/profile/${f.userId}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  View Portfolio & Hire
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Banner */}
      <section style={{ padding: '3rem 0 5rem' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
            borderRadius: '24px',
            padding: '3rem 2.5rem',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
            boxShadow: '0 20px 25px -5px rgba(30, 27, 75, 0.4)'
          }}>
            <div style={{ maxWidth: '580px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.3rem 0.8rem',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: '1rem'
              }}>
                <Sparkles size={14} color="#FBBF24" /> Instant Freelance Advice
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.75rem' }}>
                Supercharge Your Proposals with the CAMPUSGIG AI Assistant
              </h2>
              <p style={{ color: '#C7D2FE', fontSize: '1rem', lineHeight: 1.6 }}>
                Need help pitching clients, choosing competitive pricing, or polishing your portfolio? Get tailored guidance in seconds.
              </p>
            </div>
            <div>
              <Link to="/ai-assistant" className="btn btn-primary btn-lg" style={{ background: '#FFFFFF', color: '#312E81', fontWeight: 700 }}>
                Try AI Assistant Free <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
