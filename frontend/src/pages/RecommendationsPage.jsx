import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { recommendationApi, projectApi } from '../api';
import { Sparkles, ArrowLeft, Star, MessageSquare, Check, X, GraduationCap, DollarSign } from 'lucide-react';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

export default function RecommendationsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const [projRes, recRes] = await Promise.all([
          projectApi.getById(projectId),
          recommendationApi.getForProject(projectId)
        ]);
        if (projRes.data) setProject(projRes.data);
        if (recRes.data) setRecommendations(recRes.data);
      } catch (err) {
        console.error('Failed to load recommendations', err);
      } finally {
        setLoading(false);
      }
    };
    loadRecommendations();
  }, [projectId]);

  if (loading) return <Loader message="Analyzing student skills and calculating match scores..." />;

  return (
    <div className="page-container">
      <div className="container">
        <Link to={`/projects/${projectId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: '#4F46E5', fontWeight: 600, marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Project Overview
        </Link>

        {/* Header */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, #EEF2FF 0%, #FFFFFF 100%)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: '#4F46E5', color: '#fff', borderRadius: '9999px', fontSize: '0.785rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Sparkles size={14} /> AI Skill-Match Engine
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            Candidate Recommendations for "{project?.title}"
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
            Students ranked by mathematical skill overlap with required project tags ({project?.requiredSkills?.join(', ') || 'General'})
          </p>
        </div>

        {/* Recommendations list */}
        {recommendations.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No matching students found"
            description="No student profiles currently match the required technical tags for this project."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {recommendations.map((r, idx) => {
              const sp = r.studentProfile;
              const matchPercent = Math.round(r.matchScore);

              return (
                <div key={idx} className="card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '1.25rem' }}>
                      <img
                        src={sp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(sp.fullName)}&background=4F46E5&color=fff`}
                        alt={sp.fullName}
                        style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
                          <Link to={`/profile/${sp.userId}`} style={{ color: 'inherit' }}>
                            {sp.fullName}
                          </Link>
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.85rem' }}>
                          <GraduationCap size={15} /> {sp.university} • {sp.degree}
                        </div>
                        <div style={{ marginTop: '0.35rem' }}>
                          <StarRating rating={sp.ratingAvg} size={15} />
                          <span style={{ fontSize: '0.8rem', color: '#64748B', marginLeft: '6px' }}>
                            ({sp.reviewCount} client reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.4rem 0.9rem',
                        borderRadius: '9999px',
                        background: matchPercent >= 80 ? '#ECFDF5' : '#EEF2FF',
                        color: matchPercent >= 80 ? '#059669' : '#4F46E5',
                        fontWeight: 800,
                        fontSize: '1.15rem'
                      }}>
                        <Sparkles size={16} /> {matchPercent}% Match
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.35rem' }}>
                        Rate: <strong>${sp.hourlyRate || '30'}/hr</strong>
                      </div>
                    </div>
                  </div>

                  {/* Honest Explanation Box */}
                  <div style={{
                    padding: '1rem 1.25rem',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    color: '#334155',
                    lineHeight: 1.6,
                    marginBottom: '1.25rem'
                  }}>
                    <strong style={{ color: '#0F172A', display: 'block', marginBottom: '0.2rem' }}>Why this match:</strong>
                    {r.matchExplanation}
                  </div>

                  {/* Matched vs Missing Skills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16A34A', display: 'block', marginBottom: '0.35rem' }}>
                        Matched Skills:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {r.matchedSkills.map((s, si) => (
                          <span key={si} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: '#DCFCE7', color: '#15803D', borderRadius: '6px', fontWeight: 600 }}>
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {r.missingSkills.length > 0 && (
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '0.35rem' }}>
                          Other Requirements:
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {r.missingSkills.map((s, si) => (
                            <span key={si} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: '#F1F5F9', color: '#64748B', borderRadius: '6px' }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
                    <Link to={`/profile/${sp.userId}`} className="btn btn-secondary btn-sm">
                      View Student Portfolio
                    </Link>
                    <button
                      onClick={() => navigate(`/messages?userId=${sp.userId}`)}
                      className="btn btn-primary btn-sm"
                    >
                      <MessageSquare size={15} /> Invite to Project
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
