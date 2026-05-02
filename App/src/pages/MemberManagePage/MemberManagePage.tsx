// ===== Member Management Page (member_adding) =====
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import {
  getServiceById,
  getStaffForService,
  getClientsForService,
  getAvailablePeopleForService,
  addMemberToService,
  removeMemberFromService,
  getUserRoleInService,
} from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import styles from './MemberManagePage.module.css';

export default function MemberManagePage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const service = getServiceById(serviceId || '');
  const userRole = getUserRoleInService(user?.id || '', serviceId || '');

  // State counter to force re-render after mutations
  const [version, setVersion] = useState(0);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Re-derive from data on each render (version forces re-calc)
  const members = useMemo(() => getStaffForService(serviceId || ''), [serviceId, version]);
  const clients = useMemo(() => getClientsForService(serviceId || ''), [serviceId, version]);
  const available = useMemo(() => getAvailablePeopleForService(serviceId || ''), [serviceId, version]);

  // Filter available people by search query
  const searchResults = useMemo(() => {
    if (!search.trim()) return available;
    const q = search.toLowerCase();
    return available.filter(
      p => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || p.initials.toLowerCase().includes(q)
    );
  }, [available, search]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = (personId: string, personName: string, role: 'staff' | 'client') => {
    const success = addMemberToService(serviceId || '', personId, role);
    if (success) {
      showToast(`${personName} added as ${role}`);
      setVersion(v => v + 1);
    } else {
      showToast(`${personName} is already in this service`, 'error');
    }
  };

  const handleRemove = (personId: string, personName: string) => {
    const success = removeMemberFromService(serviceId || '', personId);
    if (success) {
      showToast(`${personName} removed`);
      setVersion(v => v + 1);
    } else {
      showToast(`Cannot remove ${personName} (admin)`, 'error');
    }
  };

  const capacityStaff = members.length;
  const capacityClients = clients.length;
  const maxStaff = 15;
  const maxClients = 60;
  const capacityPercent = Math.round(((capacityStaff + capacityClients) / (maxStaff + maxClients)) * 100);

  if (!service) {
    return (
      <div className={styles.page}>
        <Sidebar />
        <main className={styles.main}>
          <p>Service not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Sidebar />
      <main className={`${styles.main} page-transition`}>
        <div className={styles.inner}>
          {/* Header */}
          <div className={styles.headerSection}>
            <div>
              <nav className={styles.breadcrumb}>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>Services</a>
                <span className="material-symbols-outlined">chevron_right</span>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/service/${service.id}`); }}>{service.name}</a>
                <span className="material-symbols-outlined">chevron_right</span>
                <span className={styles.breadcrumbActive}>Personnel</span>
              </nav>
              <h1 className={styles.pageTitle}>Manage Service Personnel</h1>
              <p className={styles.pageDesc}>
                Administer access controls and operational roles for the {service.name} infrastructure node. Search and invite new team members or clients to this service instance.
              </p>
            </div>
            <div className={`${styles.statusIndicator} glass-panel`}>
              <div className={styles.statusDot} />
              <span className={styles.statusText}>Service: Active</span>
            </div>
          </div>

          {/* Grid */}
          <div className={styles.grid}>
            {/* Left Column */}
            <section className={styles.leftCol}>
              {/* Add Member Panel */}
              <div className={`${styles.addPanel} glass-panel`}>
                <div className={styles.addPanelHeader}>
                  <h2 className={styles.addPanelTitle}>Add New Member</h2>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-on-primary-container)' }}>person_add</span>
                </div>
                <div>
                  <div className={styles.searchWrap}>
                    <span className="material-symbols-outlined">search</span>
                    <input
                      id="member-search"
                      className={styles.searchInput}
                      type="text"
                      placeholder="Search by name or username..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                      <button
                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}
                        onClick={() => setSearch('')}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                      </button>
                    )}
                  </div>

                  <div className={styles.searchResults} style={{ marginTop: 16 }}>
                    <p className={styles.searchResultsLabel}>
                      {search ? `Results for "${search}"` : 'Available People'} ({searchResults.length})
                    </p>
                    {searchResults.length === 0 && (
                      <p style={{ color: '#64748b', fontSize: 13, padding: '12px 0' }}>
                        {search ? 'No matching people found.' : 'Everyone is already assigned to this service.'}
                      </p>
                    )}
                    {searchResults.map((result) => (
                      <div key={result.id} className={`${styles.searchResult} glass-panel`}>
                        <div className={styles.searchResultInfo}>
                          <div className={styles.resultAvatar}>{result.initials}</div>
                          <div>
                            <p className={styles.resultName}>{result.name}</p>
                            <p className={styles.resultSub}>{result.role}</p>
                          </div>
                        </div>
                        <div className={styles.resultBtns}>
                          <button
                            className={`${styles.resultBtn} ${styles.resultBtnStaff}`}
                            onClick={() => handleAdd(result.id, result.name, 'staff')}
                          >
                            + Staff
                          </button>
                          <button
                            className={`${styles.resultBtn} ${styles.resultBtnClient}`}
                            onClick={() => handleAdd(result.id, result.name, 'client')}
                          >
                            + Client
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Capacity */}
              <div className={`${styles.capacityCard} glass-panel`}>
                <div className={styles.capacityHeader}>
                  <p className={styles.capacityLabel}>Service Capacity</p>
                  <span className={styles.capacityPercent}>{capacityPercent}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${capacityPercent}%` }} />
                </div>
                <div className={styles.capacityGrid}>
                  <div className={styles.capacityItem}>
                    <p className={styles.capacityItemLabel}>Staff Seats</p>
                    <p className={styles.capacityItemValue}>{capacityStaff} / {maxStaff}</p>
                  </div>
                  <div className={styles.capacityItem}>
                    <p className={styles.capacityItemLabel}>Client Slots</p>
                    <p className={styles.capacityItemValue}>{capacityClients} / {maxClients}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Right Column */}
            <section className={styles.rightCol}>
              {/* Staff */}
              <div className={`${styles.personnelPanel} glass-panel`}>
                <div className={styles.personnelHeader}>
                  <div className={styles.personnelHeaderLeft}>
                    <span className="material-symbols-outlined" style={{ color: '#44e2cd', fontVariationSettings: "'FILL' 1" }}>badge</span>
                    <h3 className={styles.personnelTitle}>Assigned Staff</h3>
                  </div>
                  <span className={styles.personnelBadge}>{members.length} members</span>
                </div>
                <div className={styles.personnelList}>
                  {members.length === 0 && (
                    <p style={{ color: '#64748b', fontSize: 13, padding: '12px 0', textAlign: 'center' }}>
                      No staff assigned yet.
                    </p>
                  )}
                  {members.map((m) => {
                    const isAdmin = getUserRoleInService(m.id, serviceId || '') === 'admin';
                    return (
                      <div key={m.id} className={styles.personnelRow}>
                        <div className={styles.personnelInfo}>
                          <div className={styles.personnelAvatarWrap}>
                            <div className={styles.personnelAvatar}>
                              {m.avatar ? (
                                <img src={m.avatar} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                              ) : m.initials}
                            </div>
                            {m.status === 'online' && <div className={styles.onlineDot} />}
                          </div>
                          <div>
                            <p className={styles.personnelName}>
                              {m.name}
                              {isAdmin && <span style={{ color: '#44e2cd', fontSize: 10, marginLeft: 6, fontWeight: 700 }}>ADMIN</span>}
                              {m.id === user?.id && <span style={{ color: '#7bd0ff', fontSize: 10, marginLeft: 6, fontWeight: 700 }}>YOU</span>}
                            </p>
                            <p className={styles.personnelRole}>
                              <span className="material-symbols-outlined">shield</span>
                              {m.role}
                            </p>
                          </div>
                        </div>
                        <div className={styles.personnelMeta}>
                          <div style={{ textAlign: 'right' }}>
                            <p className={styles.metaLabel}>Added</p>
                            <p className={styles.metaValue}>{m.dateAdded}</p>
                          </div>
                          {!isAdmin && (
                            <button
                              className={styles.removeBtn}
                              onClick={() => handleRemove(m.id, m.name)}
                              title={`Remove ${m.name}`}
                            >
                              <span className="material-symbols-outlined">person_remove</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Clients */}
              <div className={`${styles.personnelPanel} glass-panel`}>
                <div className={styles.personnelHeader}>
                  <div className={styles.personnelHeaderLeft}>
                    <span className="material-symbols-outlined" style={{ color: '#7bd0ff', fontVariationSettings: "'FILL' 1" }}>group</span>
                    <h3 className={styles.personnelTitle}>Assigned Clients</h3>
                  </div>
                  <span style={{ color: 'var(--color-on-primary-container)', fontFamily: "'Space Grotesk', monospace", fontSize: 12 }}>Total: {clients.length} Active</span>
                </div>
                <div className={styles.personnelList}>
                  {clients.length === 0 && (
                    <p style={{ color: '#64748b', fontSize: 13, padding: '12px 0', textAlign: 'center' }}>
                      No clients assigned yet.
                    </p>
                  )}
                  {clients.map((c) => (
                    <div key={c.id} className={styles.personnelRow}>
                      <div className={styles.personnelInfo}>
                        <div className={styles.clientIcon}>
                          {c.avatar ? (
                            <img src={c.avatar} alt={c.name} style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: '50%' }} />
                          ) : (
                            <span className="material-symbols-outlined">person</span>
                          )}
                        </div>
                        <div>
                          <p className={styles.clientName}>{c.name}</p>
                          <p className={styles.clientTier}>{c.role}</p>
                        </div>
                      </div>
                      <div className={styles.personnelMeta}>
                        <div className={styles.clientMeta} style={{ textAlign: 'right' }}>
                          <p className={styles.metaLabel}>Status</p>
                          <p className={styles.metaValue}>{c.status === 'online' ? 'Online' : 'Offline'}</p>
                        </div>
                        <button
                          className={styles.removeBtn}
                          onClick={() => handleRemove(c.id, c.name)}
                          title={`Remove ${c.name}`}
                        >
                          <span className="material-symbols-outlined">remove_circle_outline</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Toast notification */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : ''}`}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {toast.message}
        </div>
      )}
    </div>
  );
}
