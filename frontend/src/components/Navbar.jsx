import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  Briefcase, 
  Bell, 
  MessageSquare, 
  User as UserIcon, 
  LogOut, 
  PlusCircle, 
  Menu, 
  X, 
  Bot, 
  Compass, 
  FileText, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, isStudent, isClient } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #E2E8F0',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
            color: '#fff',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
          }}>
            <Briefcase size={20} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0F172A' }}>
              CAMPUS<span style={{ color: '#4F46E5' }}>GIG</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Freelance Student Hub
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }} className="nav-desktop-links">
          <Link to="/projects" style={{
            fontSize: '0.925rem',
            fontWeight: 600,
            color: isActive('/projects') ? '#4F46E5' : '#475569',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <Compass size={17} /> Projects
          </Link>

          <Link to="/freelancers" style={{
            fontSize: '0.925rem',
            fontWeight: 600,
            color: isActive('/freelancers') ? '#4F46E5' : '#475569'
          }}>
            Talent
          </Link>

          <Link to="/ai-assistant" style={{
            fontSize: '0.925rem',
            fontWeight: 600,
            color: isActive('/ai-assistant') ? '#4F46E5' : '#475569',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <Sparkles size={16} color="#4F46E5" /> AI Hub
          </Link>

          {isAuthenticated && (
            <>
              {isStudent && (
                <>
                  <Link to="/student/dashboard" style={{
                    fontSize: '0.925rem',
                    fontWeight: 600,
                    color: isActive('/student/dashboard') ? '#4F46E5' : '#475569'
                  }}>
                    Dashboard
                  </Link>
                  <Link to="/student/proposals" style={{
                    fontSize: '0.925rem',
                    fontWeight: 600,
                    color: isActive('/student/proposals') ? '#4F46E5' : '#475569'
                  }}>
                    Proposals
                  </Link>
                  <Link to="/contracts" style={{
                    fontSize: '0.925rem',
                    fontWeight: 600,
                    color: isActive('/contracts') ? '#4F46E5' : '#475569'
                  }}>
                    Contracts
                  </Link>
                </>
              )}

              {isClient && (
                <>
                  <Link to="/client/dashboard" style={{
                    fontSize: '0.925rem',
                    fontWeight: 600,
                    color: isActive('/client/dashboard') ? '#4F46E5' : '#475569'
                  }}>
                    Dashboard
                  </Link>
                  <Link to="/contracts" style={{
                    fontSize: '0.925rem',
                    fontWeight: 600,
                    color: isActive('/contracts') ? '#4F46E5' : '#475569'
                  }}>
                    Contracts
                  </Link>
                  <Link to="/projects/create" className="btn btn-primary btn-sm" style={{ padding: '0.45rem 0.9rem' }}>
                    <PlusCircle size={16} /> Post Project
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Right Section: Auth & Notifications */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              {/* Messages shortcut */}
              <Link to="/messages" style={{
                position: 'relative',
                padding: '8px',
                borderRadius: '8px',
                color: '#475569',
                display: 'flex'
              }} title="Messages">
                <MessageSquare size={20} />
              </Link>

              {/* Notifications bell */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    position: 'relative',
                    padding: '8px',
                    borderRadius: '8px',
                    color: showNotifications ? '#4F46E5' : '#475569',
                    display: 'flex'
                  }}
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      background: '#EF4444',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      minWidth: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 3px',
                      border: '2px solid #fff'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown menu */}
                {showNotifications && (
                  <div style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '340px',
                    maxHeight: '420px',
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    border: '1px solid #E2E8F0',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      padding: '1rem',
                      borderBottom: '1px solid #F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>
                        Notifications ({unreadCount})
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4F46E5' }}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div style={{ overflowY: 'auto', maxHeight: '340px' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                          No notifications yet
                        </div>
                      ) : (
                        notifications.slice(0, 8).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            style={{
                              padding: '0.85rem 1rem',
                              borderBottom: '1px solid #F8FAFC',
                              background: n.read ? '#fff' : '#EEF2FF',
                              cursor: 'pointer',
                              transition: 'background 0.15s'
                            }}
                          >
                            <div style={{ fontWeight: 600, fontSize: '0.825rem', color: '#1E293B', marginBottom: '2px' }}>
                              {n.title}
                            </div>
                            <div style={{ fontSize: '0.785rem', color: '#64748B', lineHeight: 1.35 }}>
                              {n.message}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User avatar menu */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '4px',
                    borderRadius: '24px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <img
                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=4F46E5&color=fff`}
                    alt={user.fullName}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B', paddingRight: '6px' }}>
                    {user.fullName.split(' ')[0]}
                  </span>
                </button>

                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '210px',
                    background: '#fff',
                    borderRadius: '14px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                    border: '1px solid #E2E8F0',
                    zIndex: 200,
                    overflow: 'hidden',
                    padding: '0.5rem 0'
                  }}>
                    <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #F1F5F9' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>{user.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{user.email}</div>
                      <span className="badge badge-primary" style={{ marginTop: '4px', fontSize: '0.65rem' }}>
                        {user.role ? user.role.replace('ROLE_', '') : ''}
                      </span>
                    </div>

                    <Link
                      to={isStudent ? `/profile/${user.id}` : '/client/dashboard'}
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.65rem 1rem',
                        fontSize: '0.85rem',
                        color: '#334155'
                      }}
                    >
                      <UserIcon size={16} /> My Profile
                    </Link>

                    {isStudent && (
                      <Link
                        to="/student/services"
                        onClick={() => setShowUserMenu(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.65rem 1rem',
                          fontSize: '0.85rem',
                          color: '#334155'
                        }}
                      >
                        <Briefcase size={16} /> Manage Gigs
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.65rem 1rem',
                        fontSize: '0.85rem',
                        color: '#EF4444',
                        borderTop: '1px solid #F1F5F9',
                        textAlign: 'left'
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Join CAMPUSGIG
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'flex', padding: '6px', color: '#475569' }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 868px) {
          .nav-desktop-links { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
