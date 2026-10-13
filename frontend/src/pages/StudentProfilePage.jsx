import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { profileApi, serviceApi, reviewApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  MapPin, 
  DollarSign, 
  Github, 
  Linkedin, 
  Globe, 
  Star, 
  MessageSquare, 
  Edit3, 
  ExternalLink,
  Briefcase,
  CheckCircle,
  Clock
} from 'lucide-react';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';

export default function StudentProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const targetUserId = userId || currentUser?.id;
        if (!targetUserId) return;

        const [profRes, servRes, revRes] = await Promise.all([
          profileApi.getByUserId(targetUserId),
          serviceApi.getByStudent(targetUserId),
          reviewApi.getForUser(targetUserId)
        ]);

        if (profRes.data) setProfile(profRes.data);
        if (servRes.data) setServices(servRes.data);
        if (revRes.data) setReviews(revRes.data);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId, currentUser]);

  if (loading) return <Loader message="Loading student portfolio..." />;
  if (!profile) return <div className="page-container container">Profile not found.</div>;

  const isOwner = currentUser && Number(profile.userId) === Number(currentUser.id);

  return (
    <div className="page-container">
      <div className="container">
        {/* Profile Header Banner */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <img
              src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=4F46E5&color=fff`}
              alt={profile.fullName}
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #EEF2FF',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
              }}
            />

            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
                    {profile.fullName}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4F46E5', fontWeight: 600, fontSize: '0.95rem' }}>
                    <GraduationCap size={18} /> {profile.university || 'University Student'}
                  </div>
                  <div style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '2px' }}>
                    {profile.degree} (Class of {profile.graduationYear})
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {isOwner ? (
                    <Link to="/profile/edit" className="btn btn-outline btn-sm">
                      <Edit3 size={16} /> Edit Profile & Skills
                    </Link>
                  ) : (
                    <button
                      onClick={() => navigate(`/messages?userId=${profile.userId}`)}
                      className="btn btn-primary"
                    >
                      <MessageSquare size={17} /> Message Freelancer
                    </button>
                  )}
                </div>
              </div>

              {/* Stats & Rating Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                marginTop: '1.25rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid #F1F5F9',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <StarRating rating={profile.ratingAvg} size={16} />
                  <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    ({profile.reviewCount} client reviews)
                  </span>
                </div>

                <div style={{ fontSize: '0.9rem', color: '#64748B' }}>
                  Hourly Rate: <strong style={{ color: '#0F172A' }}>${profile.hourlyRate || '30'}/hr</strong>
                </div>

                <div style={{ fontSize: '0.9rem', color: '#64748B' }}>
                  Completed Projects: <strong style={{ color: '#0F172A' }}>{profile.completedProjects || 0}</strong>
                </div>

                {/* Social links */}
                <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
                  {profile.githubUrl && (
                    <a href={profile.githubUrl} target="_blank" rel="noreferrer" style={{ color: '#475569' }} title="GitHub">
                      <Github size={19} />
                    </a>
                  )}
                  {profile.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: '#0077B5' }} title="LinkedIn">
                      <Linkedin size={19} />
                    </a>
                  )}
                  {profile.websiteUrl && (
                    <a href={profile.websiteUrl} target="_blank" rel="noreferrer" style={{ color: '#4F46E5' }} title="Personal Website">
                      <Globe size={19} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio & Skills */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem', marginBottom: '3rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
              About & Experience
            </h2>
            <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {profile.experienceSummary || profile.bio || 'No bio provided yet.'}
            </p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
              Verified Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {Array.from(profile.skills || []).map((skill, si) => (
                <span key={si} style={{
                  fontSize: '0.85rem',
                  padding: '0.35rem 0.75rem',
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
        </div>

        {/* Portfolio Showcase */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A' }}>
                Featured Portfolio Projects
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                Verified technical coursework, hackathons, and commercial work
              </p>
            </div>

            {isOwner && (
              <Link to="/profile/edit" className="btn btn-outline btn-sm">
                Add Project
              </Link>
            )}
          </div>

          {(!profile.portfolioItems || profile.portfolioItems.length === 0) ? (
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8' }}>
              No portfolio items added yet.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {profile.portfolioItems.map((item) => (
                <div key={item.id} className="card" style={{ overflow: 'hidden', padding: 0 }}>
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'}
                    alt={item.title}
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {item.description}
                    </p>
                    {item.tags && (
                      <div style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 600, marginBottom: '1rem' }}>
                        {item.tags}
                      </div>
                    )}
                    {item.projectUrl && (
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%' }}
                      >
                        <ExternalLink size={14} /> View Live Project
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Client Reviews Section */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
            Client Reviews & Ratings ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>
              No reviews yet. Complete your first contract to earn ratings!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {reviews.map((r) => (
                <div key={r.id} style={{
                  paddingBottom: '1.5rem',
                  borderBottom: '1px solid #F1F5F9'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={r.reviewerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.reviewerName)}&background=4F46E5&color=fff`}
                        alt={r.reviewerName}
                        style={{ width: '38px', height: '38px', borderRadius: '50%' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>{r.reviewerName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Project: {r.projectTitle}</div>
                      </div>
                    </div>

                    <StarRating rating={r.rating} size={15} />
                  </div>

                  <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5, marginTop: '0.5rem' }}>
                    "{r.feedback}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
