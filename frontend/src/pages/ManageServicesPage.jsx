import React, { useState, useEffect } from 'react';
import { serviceApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Plus, Trash2, Edit2, DollarSign, Clock, CheckCircle } from 'lucide-react';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

export default function ManageServicesPage() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Full-Stack Development');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('100.00');
  const [deliveryDays, setDeliveryDays] = useState('3');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await serviceApi.getByStudent(user.id);
      if (res.data) setServices(res.data);
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadServices();
  }, [user]);

  const handleCreateService = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await serviceApi.createService({
        title,
        category,
        description,
        price: parseFloat(price),
        deliveryDays: parseInt(deliveryDays),
        active: true
      });
      if (res.data) {
        setServices([res.data, ...services]);
        setShowAddModal(false);
        setTitle('');
        setDescription('');
        setPrice('100.00');
        setDeliveryDays('3');
      }
    } catch (err) {
      setError(err.message || 'Failed to create gig.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service listing?')) return;
    try {
      await serviceApi.deleteService(id);
      setServices(services.filter(s => s.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete gig.');
    }
  };

  if (loading) return <Loader message="Loading your freelance gigs..." />;

  return (
    <div className="page-container">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
              Manage Freelance Gigs & Services
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              Create pre-packaged freelance offerings that clients can purchase directly
            </p>
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <Plus size={18} /> Create New Gig
          </button>
        </div>

        {/* Modal for creating a new gig */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}>
            <div className="card" style={{ maxWidth: '580px', width: '100%', padding: '2rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem' }}>
                Create New Freelance Service Package
              </h2>

              {error && (
                <div style={{ padding: '0.65rem', background: '#FEE2E2', color: '#DC2626', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateService}>
                <div className="form-group">
                  <label className="form-label">Service Title</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Build High-Speed Spring Boot API & MySQL Database"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Full-Stack Development">Full-Stack Development</option>
                    <option value="Backend Development">Backend Development</option>
                    <option value="Frontend Development">Frontend Development</option>
                    <option value="Design & Creative">Design & Creative</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Price ($)</label>
                    <input
                      type="number"
                      required
                      min="5"
                      step="5"
                      className="form-input"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Delivery Time (Days)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="form-input"
                      value={deliveryDays}
                      onChange={(e) => setDeliveryDays(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description & Scope</label>
                  <textarea
                    required
                    rows="4"
                    className="form-input"
                    placeholder="Specify what is included in this package..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>
                    {saving ? 'Creating...' : 'Publish Gig'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Services List */}
        {services.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No freelance service listings yet"
            description="Offer standard fixed-price gigs to attract clients looking for fast student talent."
            actionLabel="Create First Gig"
            onAction={() => setShowAddModal(true)}
          />
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span className="badge badge-primary">{s.category}</span>
                    <span style={{ fontSize: '0.75rem', color: s.active ? '#10B981' : '#94A3B8', fontWeight: 700 }}>
                      {s.active ? '● Active' : '○ Inactive'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem', lineHeight: 1.35 }}>
                    {s.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {s.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748B', fontSize: '0.85rem' }}>
                      <Clock size={15} /> {s.deliveryDays} days delivery
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
                      ${s.price}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(s.id)}
                    className="btn btn-danger btn-sm"
                    style={{ width: '100%' }}
                  >
                    <Trash2 size={15} /> Remove Gig
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
