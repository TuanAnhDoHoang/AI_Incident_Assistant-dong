// ===== Sidebar Component =====
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/dashboard', icon: 'hub', label: 'Services' },
    { to: '/dashboard', icon: 'emergency_share', label: 'Incidents' },
    { to: '/dashboard', icon: 'group', label: 'Team' },
    { to: '/dashboard', icon: 'settings', label: 'Settings' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logoBox}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: '#0f172a' }}>security</span>
        </div>
        <span className={styles.title}>IncidentX Console</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem} ${i === 1 && isActive ? styles.navItemActive : ''}`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <button className={styles.reportBtn}>
          <span className="material-symbols-outlined">add_alert</span>
          Report Incident
        </button>

        <div className={styles.footerLinks}>
          <a href="#" className={styles.footerLink}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>menu_book</span>
            Documentation
          </a>
          <a href="#" className={styles.footerLink}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>support_agent</span>
            Support
          </a>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span className="material-symbols-outlined">person</span>
            )}
          </div>
          <div>
            <p className={styles.userName}>{user?.name || 'User'}</p>
            <p className={styles.userStatus}>System Operational</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn} title="Sign out">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
