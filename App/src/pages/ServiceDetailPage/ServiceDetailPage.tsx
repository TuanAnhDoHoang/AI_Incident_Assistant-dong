// ===== Service Detail Page (service_apps) =====
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useAuth } from '../../context/AuthContext';
import {
  getServiceById,
  getStaffForService,
  getClientsForService,
  getAdminForService,
  getUserRoleInService,
  removeMemberFromService,
} from '../../data/mockData';
import styles from './ServiceDetailPage.module.css';

export default function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const service = getServiceById(serviceId || '');
  const userRole = getUserRoleInService(user?.id || '', serviceId || '');

  // State counter to force re-render after mutations
  const [version, setVersion] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const members = useMemo(() => getStaffForService(serviceId || ''), [serviceId, version]);
  const clients = useMemo(() => getClientsForService(serviceId || ''), [serviceId, version]);
  const admin = useMemo(() => getAdminForService(serviceId || ''), [serviceId, version]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRemoveStaff = (personId: string, personName: string) => {
    const success = removeMemberFromService(serviceId || '', personId);
    if (success) {
      showToast(`${personName} removed`);
      setVersion(v => v + 1);
    } else {
      showToast(`Cannot remove ${personName}`, 'error');
    }
  };

  if (!service) {
    return (
      <div className={styles.page}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.content} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 className="text-h2">Service not found</h2>
              <button className={styles.backLink} onClick={() => navigate('/dashboard')}>
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Sidebar />
      <main className={`${styles.main} page-transition`}>
        {/* Left: Service Overview & Apps */}
        <div className={styles.content}>
          <button className={styles.backLink} onClick={() => navigate('/dashboard')}>
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Services
          </button>

          {/* Service Header */}
          <div className={styles.serviceHeader}>
            <div className={`${styles.serviceIcon} glass-panel`}>
              <span className="material-symbols-outlined" style={{ color: service.iconColor }}>{service.icon}</span>
            </div>
            <div>
              <div className={styles.serviceTitleRow}>
                <h1 className={styles.serviceTitle}>{service.name}</h1>
                <span className={styles.statusPill}>
                  <span className={styles.statusDot} />
                  {service.status === 'connected' ? 'OPERATIONAL' : service.status === 'alert' ? 'ALERT' : 'STANDBY'}
                </span>
              </div>
              <p className={styles.serviceDesc}>{service.description}</p>
            </div>
          </div>

          {/* Apps Grid */}
          <div>
            <div className={styles.appsHeader}>
              <h2 className={styles.appsTitle}>Integrated Ecosystem</h2>
              <div className={styles.viewBtns}>
                <button className={`${styles.viewBtn} glass-panel`}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-on-surface-variant)' }}>grid_view</span>
                </button>
                <button className={`${styles.viewBtn} glass-panel`}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-on-surface-variant)' }}>view_list</span>
                </button>
              </div>
            </div>

            <div className={styles.appsGrid}>
              {service.apps.map((app) => (
                <div
                  key={app.id}
                  id={`app-${app.id}`}
                  className={`${styles.appCard} glass-panel`}
                  onClick={() => navigate(`/service/${service.id}/chat/${app.id}`)}
                >
                  <div className={styles.appCardHeader}>
                    <div className={`${styles.appIcon} glass-panel`}>
                      <span className="material-symbols-outlined">{app.icon}</span>
                    </div>
                    <span className={`${styles.appStatus} ${app.status === 'active' ? styles.appStatusActive :
                        app.status === 'syncing' ? styles.appStatusSyncing :
                          styles.appStatusIdle
                      }`}>
                      {app.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className={styles.appName}>{app.name}</h3>
                  <p className={styles.appDesc}>{app.description}</p>
                  <div className={styles.appFooter}>
                    <span className={styles.appFooterText}>{app.statusText}</span>
                    <span className={`material-symbols-outlined ${styles.appArrow}`} style={{ fontSize: 14 }}>arrow_forward</span>
                  </div>
                </div>
              ))}

              {/* Add New */}
              <div className={styles.addApp}>
                <span className="material-symbols-outlined">add_circle</span>
                <p>Connect New App</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <aside className={`${styles.aside} glass-panel`}>
          {/* User Profile */}
          <section>
            <h4 className={styles.sectionLabel}>MY SERVICE PROFILE</h4>
            <div className={styles.profileWrap}>
              <div className={styles.profilePic}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <div className={styles.profilePicPlaceholder}>
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div>
                <p className={styles.appName}>{user?.name || 'User'}</p>
                <p style={{ fontSize: 12, color: userRole === 'admin' ? '#44e2cd' : 'var(--color-on-surface-variant)' }}>
                  {userRole === 'admin' ? 'Service Admin' : userRole === 'staff' ? 'Staff Member' : userRole === 'client' ? 'Client' : 'No Access'}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className={`${styles.profileMetaRow} glass-panel`}>
                <span style={{ color: 'var(--color-on-surface-variant)' }}>Access Level</span>
                <span style={{ color: userRole === 'admin' ? '#44e2cd' : '#7bd0ff' }}>{userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'None'}</span>
              </div>
              <div className={`${styles.profileMetaRow} glass-panel`}>
                <span style={{ color: 'var(--color-on-surface-variant)' }}>Token Expiry</span>
                <span>24h 12m</span>
              </div>
            </div>
          </section>

          {/* Bot Section */}
          <section>
            <h4 className={styles.sectionLabel}>SERVICE AGENTS</h4>
            <div className={`${styles.botCard} glass-panel`}>
              <div className={styles.botHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="material-symbols-outlined">precision_manufacturing</span>
                  <span>IncidentX Bot</span>
                </div>
                {userRole === 'admin' && (
                  <button
                    className={styles.notifyBtn}
                    onClick={() => navigate(`/service/${service.id}/bot`)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>notifications_active</span>
                    Notify
                    <span className={styles.notifyBadge}>3</span>
                  </button>
                )}
              </div>
              <p className={styles.botDesc}>Autonomous monitoring engine active. Analyzing real-time telemetry and generating reports.</p>
              <div className={styles.botStatus}>STATUS: MONITORING_ACTIVE</div>
            </div>
          </section>

          {/* Staff */}
          <section style={{ flex: 1 }}>
            <div className={styles.staffHeader}>
              <h4 className={styles.sectionLabel}>ASSIGNED STAFF {admin ? `(Admin: ${admin.name})` : ''}</h4>
              <span className={styles.staffCount}>{members.length} Staff · {clients.length} Clients</span>
            </div>
            <div className={styles.staffList}>
              {members.map((m) => {
                const isAdmin = getUserRoleInService(m.id, serviceId || '') === 'admin';
                return (
                  <div key={m.id} className={styles.staffRow}>
                    <div className={styles.staffInfo}>
                      <div className={styles.staffInitials}>
                        {m.avatar ? (
                          <img src={m.avatar} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        ) : m.initials}
                      </div>
                      <div>
                        <p className={styles.staffName}>
                          {m.name}
                          {isAdmin && <span style={{ color: '#44e2cd', fontSize: 9, marginLeft: 4 }}>★</span>}
                        </p>
                        <p className={styles.staffRole}>{m.role}</p>
                      </div>
                    </div>
                    {!isAdmin && userRole === 'admin' && (
                      <button
                        className={styles.staffRemoveBtn}
                        onClick={() => handleRemoveStaff(m.id, m.name)}
                        title={`Remove ${m.name}`}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>person_remove</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={styles.manageBtns}>
              <button
                className={styles.manageBtn}
                onClick={() => navigate(`/service/${service.id}/members`)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>group_add</span>
                Add/Remove Staff
              </button>
              <button
                className={`${styles.manageBtn} ${styles.manageBtnSecondary}`}
                onClick={() => navigate(`/service/${service.id}/members`)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>supervised_user_circle</span>
                Add/Remove Clients
              </button>
            </div>
          </section>
        </aside>
      </main>

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          padding: '12px 24px',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 14,
          fontWeight: 600,
          zIndex: 9999,
          animation: 'slideUp 0.3s ease-out',
          background: toast.type === 'success' ? 'rgba(68, 226, 205, 0.15)' : 'rgba(255, 100, 100, 0.15)',
          color: toast.type === 'success' ? '#44e2cd' : '#ff6464',
          border: `1px solid ${toast.type === 'success' ? 'rgba(68, 226, 205, 0.3)' : 'rgba(255, 100, 100, 0.3)'}`,
          backdropFilter: 'blur(20px)',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {toast.message}
        </div>
      )}
    </div>
  );
}
