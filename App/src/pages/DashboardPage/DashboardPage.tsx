// ===== Dashboard (Main Services) Page =====
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { mockServices } from '../../data/mockData';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredServices = mockServices.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <Sidebar />
      <main className={`${styles.main} page-transition`}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerInfo}>
            <h1>Service Directory</h1>
            <p>Configure monitoring and automated response protocols for your infrastructure ecosystem.</p>
          </div>

          <div className={`${styles.profileCard} glass-card`}>
            <div className={styles.profileAvatarWrap}>
              <div className={styles.profileAvatar}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span className="material-symbols-outlined" style={{ fontSize: 40, padding: 12 }}>person</span>
                )}
              </div>
              <div className={styles.profileEditOverlay}>
                <span className="material-symbols-outlined" style={{ color: 'white', fontSize: 14 }}>edit</span>
              </div>
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.profileName}>
                <span>{user?.name || 'User'}</span>
                <span className="material-symbols-outlined" style={{ color: '#44e2cd', fontSize: 14, fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <div className={styles.profileBtns}>
                <button className={styles.profileBtn}>Edit Profile</button>
                <button className={styles.profileBtn}>Security</button>
              </div>
            </div>
          </div>
        </header>

        {/* Search */}
        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <span className="material-symbols-outlined">search</span>
            <input
              id="service-search"
              className={styles.searchInput}
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className={`${styles.filterBtn} glass-card`}>
            <span className="material-symbols-outlined">filter_list</span>
            <span>Filters</span>
          </button>
        </div>

        {/* Service Grid */}
        <div className={styles.serviceGrid}>
          {filteredServices.map((service, index) => (
            <div
              key={service.id}
              id={`service-${service.id}`}
              className={`${styles.serviceCard} ${service.status === 'alert' ? styles.serviceCardAlert : ''} glass-card`}
              onClick={() => navigate(`/service/${service.id}`)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={styles.statusBadge}>
                <span className={
                  service.status === 'connected' ? styles.statusConnected :
                  service.status === 'alert' ? styles.statusAlert :
                  styles.statusStandby
                }>
                  {service.status === 'connected' ? 'Connected' : service.status === 'alert' ? 'Alert' : 'Standby'}
                </span>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardIcon}>
                  <span className="material-symbols-outlined" style={{ color: service.iconColor }}>{service.icon}</span>
                </div>
                <div>
                  <h3 className={styles.cardTitle}>{service.name}</h3>
                  <p className={`${styles.cardDesc} line-clamp-2`}>{service.description}</p>
                </div>
                <div className={styles.cardFooter}>
                  <div className={`${styles.cardDot} ${
                    service.status === 'connected' ? styles.cardDotGreen :
                    service.status === 'alert' ? styles.cardDotRed :
                    styles.cardDotGray
                  }`} />
                  <span className={`${styles.cardFooterText} ${service.status === 'alert' ? styles.cardFooterTextError : ''}`}>
                    {service.statusText}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Service */}
          <div className={styles.addServiceCard}>
            <div className={styles.addIcon}>
              <span className="material-symbols-outlined">add</span>
            </div>
            <p className={styles.addLabel}>Add Service</p>
          </div>
        </div>
      </main>
    </div>
  );
}
