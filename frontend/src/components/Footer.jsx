import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, Shield, Award, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#0F172A',
      color: '#94A3B8',
      padding: '4rem 0 2rem',
      borderTop: '1px solid #1E293B',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                color: '#fff',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Briefcase size={18} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                CAMPUS<span style={{ color: '#818CF8' }}>GIG</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#94A3B8' }}>
              The premiere freelance marketplace bridging ambitious university students with clients, tech startups, and campus innovations.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              For Students
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/projects" style={{ color: '#94A3B8' }}>Browse Projects</Link></li>
              <li><Link to="/student/dashboard" style={{ color: '#94A3B8' }}>Student Dashboard</Link></li>
              <li><Link to="/ai-assistant" style={{ color: '#94A3B8' }}>Proposal AI Assistant</Link></li>
              <li><Link to="/register" style={{ color: '#94A3B8' }}>Join as Freelancer</Link></li>
            </ul>
          </div>

          {/* Client links */}
          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              For Clients
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/freelancers" style={{ color: '#94A3B8' }}>Explore Campus Talent</Link></li>
              <li><Link to="/projects/create" style={{ color: '#94A3B8' }}>Post a Freelance Project</Link></li>
              <li><Link to="/client/dashboard" style={{ color: '#94A3B8' }}>Client Dashboard</Link></li>
              <li><Link to="/login" style={{ color: '#94A3B8' }}>Client Sign In</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              Platform Highlights
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={16} color="#10B981" /> Verified Student Profiles
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} color="#818CF8" /> Skill-Match Recommendations
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={16} color="#F59E0B" /> Milestone Progress Tracking
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #1E293B',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#64748B'
        }}>
          <div>
            © {new Date().getFullYear()} CAMPUSGIG Hub. Built with Spring Boot, MySQL & React. All rights reserved.
          </div>
          <div>
            Empowering students to build real-world careers before graduation.
          </div>
        </div>
      </div>
    </footer>
  );
}
